import { randomBytes, randomUUID, timingSafeEqual } from "crypto";
import { promises as fs } from "fs";
import path from "path";
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

const RESPONDENTS: readonly RespondentType[] = ["resident", "family", "other"];

let chain: Promise<void> = Promise.resolve();

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

async function readResponses(): Promise<SurveyResponse[]> {
  try {
    const raw = await fs.readFile(responsesFile, "utf8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SurveyResponse[]) : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function saveSurveyResponse(
  submission: Omit<SurveyResponse, "id" | "submittedAt">,
): Promise<void> {
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
  return locked(async () => {
    const responses = await readResponses();
    return responses.slice().reverse();
  });
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

export async function getAccessCode(): Promise<string> {
  const fromEnv = process.env.SURVEY_ACCESS_CODE?.trim();
  if (fromEnv) return fromEnv;
  return locked(() => readOrCreateAccessCode());
}

export function accessCodeMatches(input: string, expected: string): boolean {
  const provided = Buffer.from(input);
  const actual = Buffer.from(expected);
  if (provided.length === 0 || provided.length !== actual.length) return false;
  return timingSafeEqual(provided, actual);
}
