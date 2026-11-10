import type { Metadata } from "next";
import SurveyForm from "@/components/survey/SurveyForm";

export const metadata: Metadata = {
  title: "LTC Resident & Family Satisfaction Survey | HealthcareJob.Agency",
  description: "Share feedback about care, staff, and the living environment. Responses are saved.",
};

export default function SurveyPage() {
  return <SurveyForm />;
}
