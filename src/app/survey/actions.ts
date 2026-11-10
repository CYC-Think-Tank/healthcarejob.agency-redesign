"use server";

import { accessCodeMatches, getAccessCode, listSurveyResponses, parseSubmission, saveSurveyResponse } from "@/lib/survey-store";
import type { SurveyResponse, SurveySubmission } from "@/lib/survey-types";

export async function submitSurvey(
  input: SurveySubmission,
): Promise<{ ok: true } | { ok: false; error: "validation" | "save" }> {
  if (typeof input?.company === "string" && input.company.trim()) {
    return { ok: true };
  }

  const submission = parseSubmission(input);
  if (!submission) return { ok: false, error: "validation" };

  try {
    await saveSurveyResponse(submission);
    return { ok: true };
  } catch (error) {
    console.error("Failed to save survey response", error);
    return { ok: false, error: "save" };
  }
}

export async function getSurveyResponses(
  accessCode: string,
): Promise<{ ok: true; responses: SurveyResponse[] } | { ok: false; error: "unauthorized" | "save" }> {
  try {
    const expected = await getAccessCode();
    if (!accessCodeMatches(typeof accessCode === "string" ? accessCode.trim() : "", expected)) {
      return { ok: false, error: "unauthorized" };
    }
    const responses = await listSurveyResponses();
    return { ok: true, responses };
  } catch (error) {
    console.error("Failed to load survey responses", error);
    return { ok: false, error: "save" };
  }
}
