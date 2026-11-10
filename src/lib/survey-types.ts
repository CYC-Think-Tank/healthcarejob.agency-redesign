export const RATING_IDS = [
  "qualityOfCare",
  "staffProfessionalism",
  "responsiveness",
  "communication",
  "cleanliness",
  "overallSatisfaction",
] as const;

export type RatingId = (typeof RATING_IDS)[number];
export type RespondentType = "resident" | "family" | "other";

export const STAFF_NAME_MAX = 120;
export const APPRECIATION_MAX = 2000;

export type SurveyResponse = {
  id: string;
  submittedAt: string;
  respondent: RespondentType;
  ratings: Record<RatingId, number>;
  staffName: string;
  appreciation: string;
  careAppreciation: string;
  improvement: string;
  language: "en" | "zh";
};

export type SurveySubmission = {
  respondent: RespondentType;
  ratings: Record<RatingId, number>;
  staffName: string;
  appreciation: string;
  careAppreciation: string;
  improvement: string;
  language: "en" | "zh";
  company?: string;
};
