"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Check, QrCode } from "lucide-react";
import { motion } from "framer-motion";
import { submitSurvey } from "@/app/survey/actions";
import { useLanguage } from "@/context/LanguageContext";
import { APPRECIATION_MAX, RATING_IDS, STAFF_NAME_MAX, type RatingId, type RespondentType } from "@/lib/survey-types";

const RESPONDENTS: { id: RespondentType; labelKey: "resident" | "family" | "other" }[] = [
  { id: "resident", labelKey: "resident" },
  { id: "family", labelKey: "family" },
  { id: "other", labelKey: "other" },
];

const QUESTIONS: { id: RatingId; titleKey: "q1Title" | "q2Title" | "q3Title" | "q4Title" | "q5Title" | "q6Title"; promptKey: "q1Prompt" | "q2Prompt" | "q3Prompt" | "q4Prompt" | "q5Prompt" | "q6Prompt" }[] = [
  { id: "qualityOfCare", titleKey: "q1Title", promptKey: "q1Prompt" },
  { id: "staffProfessionalism", titleKey: "q2Title", promptKey: "q2Prompt" },
  { id: "responsiveness", titleKey: "q3Title", promptKey: "q3Prompt" },
  { id: "communication", titleKey: "q4Title", promptKey: "q4Prompt" },
  { id: "cleanliness", titleKey: "q5Title", promptKey: "q5Prompt" },
  { id: "overallSatisfaction", titleKey: "q6Title", promptKey: "q6Prompt" },
];

export default function SurveyForm() {
  const { t, language } = useLanguage();
  const [respondent, setRespondent] = useState<RespondentType | "">("");
  const [ratings, setRatings] = useState<Partial<Record<RatingId, number>>>({});
  const [staffName, setStaffName] = useState("");
  const [appreciation, setAppreciation] = useState("");
  const [careAppreciation, setCareAppreciation] = useState("");
  const [improvement, setImprovement] = useState("");
  const [company, setCompany] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [pending, setPending] = useState(false);
  const [errorCode, setErrorCode] = useState<"" | "missing" | "save">("");
  const [done, setDone] = useState(false);
  const error = errorCode === "missing" ? t.survey.missing : errorCode === "save" ? t.survey.errorSave : "";

  const scaleWords = [t.survey.poor, t.survey.fair, t.survey.satisfactory, t.survey.good, t.survey.excellent];
  const scaleLine = scaleWords.map((word, index) => `${index + 1} – ${word}`).join(" | ");
  const missingRespondent = attempted && !respondent;

  function reset() {
    setRespondent("");
    setRatings({});
    setStaffName("");
    setAppreciation("");
    setCareAppreciation("");
    setImprovement("");
    setCompany("");
    setAttempted(false);
    setErrorCode("");
    setDone(false);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
    setErrorCode("");

    if (!respondent || RATING_IDS.some((id) => ratings[id] === undefined)) {
      setErrorCode("missing");
      const target = !respondent ? "respondent" : RATING_IDS.find((id) => ratings[id] === undefined);
      document.getElementById(`question-${target}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setPending(true);
    try {
      const result = await submitSurvey({
        respondent,
        ratings: {
          qualityOfCare: ratings.qualityOfCare ?? 0,
          staffProfessionalism: ratings.staffProfessionalism ?? 0,
          responsiveness: ratings.responsiveness ?? 0,
          communication: ratings.communication ?? 0,
          cleanliness: ratings.cleanliness ?? 0,
          overallSatisfaction: ratings.overallSatisfaction ?? 0,
        },
        staffName,
        appreciation,
        careAppreciation,
        improvement,
        language,
        company,
      });

      if (!result.ok) {
        setErrorCode(result.error === "validation" ? "missing" : "save");
        return;
      }
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrorCode("save");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex-1 bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-10">
          <p className="text-sm font-semibold tracking-wide text-brand">{t.siteName}</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-balance">
            {t.survey.title}
          </h1>
          <p className="mt-3 text-base text-gray-600">{t.survey.intro}</p>

          {done ? (
            <div className="mt-10 rounded-xl border border-gray-100 bg-brand-light px-6 py-10 text-center" role="status">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white">
                <Check className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t.survey.successTitle}</h2>
              <p className="mt-3 text-gray-600">{t.survey.successBody}</p>
              <button
                type="button"
                onClick={reset}
                className="mt-6 bg-brand hover:bg-brand-hover text-white px-5 py-2.5 rounded-md text-sm font-semibold transition-colors"
              >
                {t.survey.submitAnother}
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit} className="mt-10 space-y-10">
              <div className="sr-only" aria-hidden="true">
                <label>
                  Website
                  <input
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
              </div>

              {error && (
                <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <fieldset id="question-respondent">
                <legend className="text-base font-semibold text-gray-900">
                  {t.survey.who} <span className="text-brand">*</span>
                </legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {RESPONDENTS.map((option) => {
                    const selected = respondent === option.id;
                    return (
                      <label
                        key={option.id}
                        className={`relative flex items-center justify-center rounded-lg border px-3 py-3 text-center text-sm font-semibold cursor-pointer transition-colors ${
                          selected
                            ? "border-brand bg-brand text-white"
                            : missingRespondent
                              ? "border-red-400 bg-white text-gray-700"
                              : "border-gray-200 bg-white text-gray-700 hover:border-brand hover:bg-brand-light"
                        }`}
                      >
                        <input
                          type="radio"
                          name="respondent"
                          value={option.id}
                          checked={selected}
                          onChange={() => setRespondent(option.id)}
                          className="absolute inset-0 cursor-pointer opacity-0"
                        />
                        {t.survey[option.labelKey]}
                      </label>
                    );
                  })}
                </div>
                {missingRespondent && (
                  <p className="mt-2 text-sm text-red-600">{t.survey.chooseRespondent}</p>
                )}
              </fieldset>

              <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                <p className="text-sm font-semibold text-gray-900">{t.survey.scaleLabel}</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{scaleLine}</p>
              </div>

              <div className="space-y-8">
                <h2 className="text-base font-semibold text-gray-900">{t.survey.pleaseRate}</h2>
                {QUESTIONS.map((question, index) => {
                  const missing = attempted && ratings[question.id] === undefined;
                  return (
                    <fieldset key={question.id} id={`question-${question.id}`} className="border-t border-gray-100 pt-8">
                      <legend className="w-full">
                        <span className="block text-lg font-semibold text-gray-900">
                          {index + 1}. {t.survey[question.titleKey]}
                        </span>
                        <span className="mt-2 block text-sm leading-relaxed text-gray-600">
                          {t.survey[question.promptKey]}
                        </span>
                      </legend>
                      <div className="mt-4 grid grid-cols-5 gap-2">
                        {scaleWords.map((word, scoreIndex) => {
                          const score = scoreIndex + 1;
                          const selected = ratings[question.id] === score;
                          return (
                            <label
                              key={score}
                              className={`relative flex h-14 items-center justify-center rounded-lg border text-lg font-semibold cursor-pointer transition-colors ${
                                selected
                                  ? "border-brand bg-brand text-white"
                                  : missing
                                    ? "border-red-400 bg-white text-gray-800"
                                    : "border-gray-200 bg-white text-gray-800 hover:border-brand hover:bg-brand-light"
                              }`}
                            >
                              <input
                                type="radio"
                                name={question.id}
                                value={score}
                                checked={selected}
                                onChange={() => setRatings((current) => ({ ...current, [question.id]: score }))}
                                className="absolute inset-0 cursor-pointer opacity-0"
                                aria-label={`${t.survey[question.titleKey]}: ${score} ${word}`}
                              />
                              {score}
                            </label>
                          );
                        })}
                      </div>
                      {missing && <p className="mt-2 text-sm text-red-600">{t.survey.chooseRating}</p>}
                    </fieldset>
                  );
                })}
              </div>

              <fieldset className="border-t border-gray-100 pt-8 space-y-5">
                <legend className="w-full">
                  <span className="block text-lg font-semibold text-gray-900">7. {t.survey.q7Title}</span>
                  <span className="mt-1 block text-xs font-medium uppercase tracking-wide text-gray-400">
                    {t.survey.optional}
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-gray-600">{t.survey.q7Prompt}</span>
                </legend>
                <div>
                  <label htmlFor="staff-name" className="block text-sm font-semibold text-gray-800 mb-2">
                    {t.survey.staffNameLabel}
                  </label>
                  <input
                    id="staff-name"
                    value={staffName}
                    maxLength={STAFF_NAME_MAX}
                    onChange={(event) => setStaffName(event.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
                  />
                </div>
                <div>
                  <label htmlFor="appreciation" className="block text-sm font-semibold text-gray-800 mb-2">
                    {t.survey.appreciateLabel}
                  </label>
                  <textarea
                    id="appreciation"
                    value={appreciation}
                    maxLength={APPRECIATION_MAX}
                    rows={4}
                    onChange={(event) => setAppreciation(event.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand resize-y"
                  />
                </div>
              </fieldset>

              <fieldset className="border-t border-gray-100 pt-8 space-y-5">
                <legend className="w-full">
                  <span className="block text-lg font-semibold text-gray-900">8. {t.survey.q8Title}</span>
                  <span className="mt-1 block text-xs font-medium uppercase tracking-wide text-gray-400">
                    {t.survey.optional}
                  </span>
                </legend>
                <div>
                  <label htmlFor="care-appreciation" className="block text-sm font-semibold text-gray-800 mb-2">
                    {t.survey.careAppreciationLabel}
                  </label>
                  <textarea
                    id="care-appreciation"
                    value={careAppreciation}
                    maxLength={APPRECIATION_MAX}
                    rows={4}
                    onChange={(event) => setCareAppreciation(event.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand resize-y"
                  />
                </div>
                <div>
                  <label htmlFor="improvement" className="block text-sm font-semibold text-gray-800 mb-2">
                    {t.survey.improvementLabel}
                  </label>
                  <textarea
                    id="improvement"
                    value={improvement}
                    maxLength={APPRECIATION_MAX}
                    rows={4}
                    onChange={(event) => setImprovement(event.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand resize-y"
                  />
                </div>
                <p className="text-sm font-medium text-gray-700">{t.survey.closing}</p>
              </fieldset>

              <button
                type="submit"
                disabled={pending}
                className="w-full sm:w-auto bg-brand hover:bg-brand-hover disabled:opacity-60 text-white px-8 py-3 rounded-md text-sm font-semibold transition-colors"
              >
                {pending ? t.survey.submitting : t.survey.submit}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center">
          <Link href="/survey/qr" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand transition-colors">
            <QrCode className="h-4 w-4" />
            {t.survey.printQr}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
