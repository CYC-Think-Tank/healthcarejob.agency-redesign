"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { getSurveyResponses } from "@/app/survey/actions";
import { useLanguage } from "@/context/LanguageContext";
import { RATING_IDS, type RatingId, type SurveyResponse } from "@/lib/survey-types";

const SESSION_KEY = "survey_access_code";

const QUESTION_LABELS: { id: RatingId; titleKey: "q1Title" | "q2Title" | "q3Title" | "q4Title" | "q5Title" | "q6Title" }[] = [
  { id: "qualityOfCare", titleKey: "q1Title" },
  { id: "staffProfessionalism", titleKey: "q2Title" },
  { id: "responsiveness", titleKey: "q3Title" },
  { id: "communication", titleKey: "q4Title" },
  { id: "cleanliness", titleKey: "q5Title" },
  { id: "overallSatisfaction", titleKey: "q6Title" },
];

function average(responses: SurveyResponse[], id: RatingId) {
  if (responses.length === 0) return "—";
  const total = responses.reduce((sum, response) => sum + response.ratings[id], 0);
  return (total / responses.length).toFixed(1);
}

function csvEscape(value: string | number) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function downloadCsv(responses: SurveyResponse[]) {
  const header = [
    "submittedAt",
    "respondent",
    ...RATING_IDS,
    "staffName",
    "appreciation",
    "careAppreciation",
    "improvement",
    "language",
  ];
  const rows = responses.map((response) => [
    response.submittedAt,
    response.respondent,
    ...RATING_IDS.map((id) => response.ratings[id]),
    response.staffName,
    response.appreciation,
    response.careAppreciation ?? "",
    response.improvement ?? "",
    response.language,
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\r\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "ltc-satisfaction-survey-responses.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}

export default function SurveyResponses() {
  const { t, language } = useLanguage();
  const [accessCode, setAccessCode] = useState("");
  const [responses, setResponses] = useState<SurveyResponse[] | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const respondentLabel = {
    resident: t.survey.resident,
    family: t.survey.family,
    other: t.survey.other,
  };

  async function load(code: string) {
    setPending(true);
    setError("");
    try {
      const result = await getSurveyResponses(code);
      if (!result.ok) {
        setResponses(null);
        sessionStorage.removeItem(SESSION_KEY);
        setError(result.error === "unauthorized" ? t.survey.wrongCode : t.survey.loadError);
        return;
      }
      sessionStorage.setItem(SESSION_KEY, code);
      setResponses(result.responses);
    } catch {
      setError(t.survey.loadError);
    } finally {
      setPending(false);
    }
  }

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      setAccessCode(saved);
      void load(saved);
    }
    // The saved code is read once when the page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await load(accessCode.trim());
  }

  const dateFormat = new Intl.DateTimeFormat(language === "zh" ? "zh-Hant" : "en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="flex-1 bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <p className="text-sm font-semibold tracking-wide text-brand">{t.siteName}</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">{t.survey.responsesTitle}</h1>
        <p className="mt-3 max-w-2xl text-gray-600">{t.survey.responsesIntro}</p>

        <form onSubmit={onSubmit} className="mt-8 max-w-xl bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <label htmlFor="access-code" className="block text-sm font-semibold text-gray-800 mb-2">
            {t.survey.accessCode}
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="access-code"
              type="password"
              value={accessCode}
              autoComplete="current-password"
              onChange={(event) => setAccessCode(event.target.value)}
              className="flex-1 border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
            />
            <button
              type="submit"
              disabled={pending || !accessCode.trim()}
              className="bg-brand hover:bg-brand-hover disabled:opacity-60 text-white px-5 py-2.5 rounded-md text-sm font-semibold transition-colors"
            >
              {pending ? t.survey.loading : t.survey.viewButton}
            </button>
          </div>
          {error && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {error}
            </p>
          )}
        </form>

        {responses && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-gray-700">
                {t.survey.responseCount}: {responses.length}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => load(accessCode.trim())}
                  className="border border-gray-200 bg-white hover:border-brand hover:text-brand text-gray-700 px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                >
                  {t.survey.refresh}
                </button>
                <button
                  type="button"
                  onClick={() => downloadCsv(responses)}
                  disabled={responses.length === 0}
                  className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover disabled:opacity-60 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                >
                  <Download className="h-4 w-4" />
                  {t.survey.exportCsv}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {QUESTION_LABELS.map((question) => (
                <div key={question.id} className="bg-white border border-gray-200 rounded-xl px-4 py-4">
                  <p className="text-sm text-gray-500">{t.survey[question.titleKey]}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {average(responses, question.id)}
                    <span className="ml-1 text-sm font-medium text-gray-400">{t.survey.average}</span>
                  </p>
                </div>
              ))}
            </div>

            {responses.length === 0 ? (
              <p className="rounded-xl border border-gray-200 bg-white px-6 py-10 text-center text-gray-500">
                {t.survey.noResponses}
              </p>
            ) : (
              <div className="space-y-4">
                {responses.map((response) => (
                  <article key={response.id} className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h2 className="text-base font-semibold text-gray-900">{respondentLabel[response.respondent]}</h2>
                      <time className="text-sm text-gray-500" dateTime={response.submittedAt}>
                        {dateFormat.format(new Date(response.submittedAt))}
                      </time>
                    </div>
                    <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                      {QUESTION_LABELS.map((question) => (
                        <div key={question.id} className="flex items-center justify-between gap-3 text-sm">
                          <dt className="text-gray-600">{t.survey[question.titleKey]}</dt>
                          <dd className="font-semibold text-gray-900">{response.ratings[question.id]}/5</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-4 border-t border-gray-100 pt-4 text-sm">
                      <p className="font-semibold text-gray-800">{t.survey.staffRecognition}</p>
                      <p className="mt-1 text-gray-700">
                        {response.staffName || t.survey.noneNoted}
                      </p>
                      {response.appreciation && (
                        <p className="mt-2 whitespace-pre-wrap break-words text-gray-600">{response.appreciation}</p>
                      )}
                    </div>
                    <div className="mt-4 border-t border-gray-100 pt-4 text-sm space-y-3">
                      <p className="font-semibold text-gray-800">{t.survey.q8Title}</p>
                      <div>
                        <p className="text-gray-500">{t.survey.careAppreciationLabel}</p>
                        <p className="mt-1 whitespace-pre-wrap break-words text-gray-700">
                          {response.careAppreciation || t.survey.noneNoted}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">{t.survey.improvementLabel}</p>
                        <p className="mt-1 whitespace-pre-wrap break-words text-gray-700">
                          {response.improvement || t.survey.noneNoted}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <p className="text-sm text-gray-500">{t.survey.storedNote}</p>
          </div>
        )}

        <p className="mt-8">
          <Link href="/survey" className="text-sm font-medium text-gray-500 hover:text-brand transition-colors">
            {t.survey.backToSurvey}
          </Link>
        </p>
      </div>
    </div>
  );
}
