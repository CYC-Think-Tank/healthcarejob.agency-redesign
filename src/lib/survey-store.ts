import { randomBytes, randomUUID, timingSafeEqual } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { get, list, put } from "@vercel/blob";
import {
  APPRECIATION_MAX,
  RATING_IDS,
  STAFF_NAME_MAX,
  type RatingId,
  type RespondentType,
  type SurveyResponse,
  type SurveySubmission,
} from "@/lib/survey-types";

const dataDir = path.join(process.cwd(), "data");
const responsesFile = path.join(dataDir, "survey-responses.json");
const accessFile = path.join(dataDir, "survey-access-code.txt");
const responsePrefix = "survey-responses/";
const accessBlobPath = "survey/access-code.txt";

const RESPONDENTS: readonly RespondentType[] = ["resident", "family", "other"];

let chain: Promise<void> = Promise.resolve();

function usesBlobStorage(): boolean {
  return (
    process.env.VERCEL === "1" ||
    Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim()) ||
    Boolean(process.env.BLOB_STORE_ID?.trim())
  );
}

function locked<T>(task: () => Promise<T>): Promise<T> {
  const run = chain.then(task, task);
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function isRespondent(value: unknown): value is RespondentType {
  return typeof value === "string" && RESPONDENTS.includes(value as RespondentType);
}

function parseRatings(value: unknown): Record<RatingId, number> | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  const ratings = {} as Record<RatingId, number>;

  for (const id of RATING_IDS) {
    const score = source[id];
    if (typeof score !== "number" || !Number.isInteger(score) || score < 1 || score > 5) {
      return null;
    }
    ratings[id] = score;
  }

  return ratings;
}

function parseText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length > max) return null;
  return trimmed;
}

export function parseSubmission(input: SurveySubmission): Omit<SurveyResponse, "id" | "submittedAt"> | null {
  if (!input || typeof input !== "object") return null;
  if (!isRespondent(input.respondent)) return null;

  const ratings = parseRatings(input.ratings);
  const staffName = parseText(input.staffName, STAFF_NAME_MAX);
  const appreciation = parseText(input.appreciation, APPRECIATION_MAX);
  const careAppreciation = parseText(input.careAppreciation, APPRECIATION_MAX);
  const improvement = parseText(input.improvement, APPRECIATION_MAX);
  if (!ratings || staffName === null || appreciation === null || careAppreciation === null || improvement === null) return null;
  if (input.language !== "en" && input.language !== "zh") return null;

  return {
    respondent: input.respondent,
    ratings,
    staffName,
    appreciation,
    careAppreciation,
    improvement,
    language: input.language,
  };
}

function textField(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function normalizeResponse(value: unknown): SurveyResponse | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Partial<SurveyResponse>;
  if (typeof source.id !== "string" || typeof source.submittedAt !== "string") return null;
  if (!isRespondent(source.respondent)) return null;
  const ratings = parseRatings(source.ratings);
  if (!ratings) return null;
  if (source.language !== "en" && source.language !== "zh") return null;

  return {
    id: source.id,
    submittedAt: source.submittedAt,
    respondent: source.respondent,
    ratings,
    staffName: textField(source.staffName),
    appreciation: textField(source.appreciation),
    careAppreciation: textField(source.careAppreciation),
    improvement: textField(source.improvement),
    language: source.language,
  };
}

function newestFirst(responses: SurveyResponse[]): SurveyResponse[] {
  return responses.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

async function readResponses(): Promise<SurveyResponse[]> {
  try {
    const raw = await fs.readFile(responsesFile, "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item) => {
      const response = normalizeResponse(item);
      return response ? [response] : [];
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function readPrivateText(pathname: string): Promise<string | null> {
  const result = await get(pathname, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200 || !result.stream) return null;
  return new Response(result.stream).text();
}

async function saveBlobResponse(submission: Omit<SurveyResponse, "id" | "submittedAt">): Promise<void> {
  const response: SurveyResponse = {
    ...submission,
    id: randomUUID(),
    submittedAt: new Date().toISOString(),
  };
  await put(`${responsePrefix}${response.id}.json`, JSON.stringify(response), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: false,
    contentType: "application/json",
  });
}

async function listBlobResponses(): Promise<SurveyResponse[]> {
  const pathnames: string[] = [];
  let cursor: string | undefined;

  do {
    const page = await list({ prefix: responsePrefix, cursor, limit: 1000 });
    for (const blob of page.blobs) {
      if (blob.pathname.endsWith(".json")) pathnames.push(blob.pathname);
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  const responses: SurveyResponse[] = [];
  for (let index = 0; index < pathnames.length; index += 20) {
    const texts = await Promise.all(pathnames.slice(index, index + 20).map((pathname) => readPrivateText(pathname)));
    for (const text of texts) {
      if (!text) continue;
      try {
        const response = normalizeResponse(JSON.parse(text));
        if (response) responses.push(response);
      } catch {
        // Skip a blob that is not a survey response.
      }
    }
  }

  return newestFirst(responses);
}

export async function saveSurveyResponse(
  submission: Omit<SurveyResponse, "id" | "submittedAt">,
): Promise<void> {
  if (usesBlobStorage()) {
    await saveBlobResponse(submission);
    return;
  }

  await locked(async () => {
    await fs.mkdir(dataDir, { recursive: true });
    const responses = await readResponses();
    responses.push({
      ...submission,
      id: randomUUID(),
      submittedAt: new Date().toISOString(),
    });
    const tempFile = `${responsesFile}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(responses, null, 2), "utf8");
    await fs.copyFile(tempFile, responsesFile);
    await fs.unlink(tempFile);
  });
}

export async function listSurveyResponses(): Promise<SurveyResponse[]> {
  if (usesBlobStorage()) return listBlobResponses();
  return locked(async () => newestFirst(await readResponses()));
}

async function readOrCreateAccessCode(): Promise<string> {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    const existing = (await fs.readFile(accessFile, "utf8")).trim();
    if (existing) return existing;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }

  const code = randomBytes(9).toString("base64url");
  await fs.writeFile(accessFile, `${code}\n`, "utf8");
  return code;
}

async function readOrCreateBlobAccessCode(): Promise<string> {
  const existing = (await readPrivateText(accessBlobPath))?.trim();
  if (existing) return existing;

  const code = randomBytes(9).toString("base64url");
  try {
    await put(accessBlobPath, `${code}\n`, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: false,
      contentType: "text/plain",
    });
    return code;
  } catch (error) {
    const raced = (await readPrivateText(accessBlobPath))?.trim();
    if (raced) return raced;
    throw error;
  }
}

export async function getAccessCode(): Promise<string> {
  const fromEnv = process.env.SURVEY_ACCESS_CODE?.trim();
  if (fromEnv) return fromEnv;
  if (usesBlobStorage()) return readOrCreateBlobAccessCode();
  return locked(() => readOrCreateAccessCode());
}

export function accessCodeMatches(input: string, expected: string): boolean {
  const provided = Buffer.from(input);
  const actual = Buffer.from(expected);
  if (provided.length === 0 || provided.length !== actual.length) return false;
  return timingSafeEqual(provided, actual);
}
