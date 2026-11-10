import type { Metadata } from "next";
import SurveyResponses from "@/components/survey/SurveyResponses";

export const metadata: Metadata = {
  title: "Survey responses | HealthcareJob.Agency",
  robots: { index: false, follow: false },
};

export default function SurveyResponsesPage() {
  return <SurveyResponses />;
}
