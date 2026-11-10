import type { Metadata } from "next";
import SurveyQr from "@/components/survey/SurveyQr";

export const metadata: Metadata = {
  title: "Survey QR code | HealthcareJob.Agency",
  robots: { index: false, follow: false },
};

export default function SurveyQrPage() {
  return <SurveyQr />;
}
