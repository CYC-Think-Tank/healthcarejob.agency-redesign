"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy, Download, Printer } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const STORAGE_KEY = "survey_qr_url";

export default function SurveyQr() {
  const { t } = useLanguage();
  const [url, setUrl] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const current = `${window.location.origin}/survey`;
    const saved = localStorage.getItem(STORAGE_KEY);
    setUrl(saved || current);
  }, []);

  useEffect(() => {
    if (!url) return;
    localStorage.setItem(STORAGE_KEY, url);
    let cancelled = false;

    (async () => {
      try {
        const { toDataURL } = await import("qrcode");
        const next = await toDataURL(url, {
          width: 640,
          margin: 2,
          errorCorrectionLevel: "M",
          color: { dark: "#111827", light: "#ffffff" },
        });
        if (!cancelled) setDataUrl(next);
      } catch {
        if (!cancelled) setDataUrl("");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url]);

  const isLocal = /localhost|127\.0\.0\.1/i.test(url);

  function useCurrentAddress() {
    setUrl(`${window.location.origin}/survey`);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex-1 bg-gray-50 py-10 px-4 sm:px-6">
      <style>{`
        @media print {
          header, footer { display: none !important; }
          main { background: white !important; }
        }
      `}</style>
      <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm px-6 py-10 sm:px-10 text-center">
        <p className="text-sm font-semibold tracking-wide text-brand">{t.siteName}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 text-balance">{t.survey.qrPageTitle}</h1>
        <p className="mt-3 text-lg font-semibold text-gray-800">{t.survey.title}</p>
        <p className="mt-2 text-sm text-gray-600">{t.survey.qrPageIntro}</p>

        <div className="mt-8 flex justify-center">
          {dataUrl ? (
            // Data-URL QR codes are generated in the browser; next/image does not optimize them.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dataUrl} alt={t.survey.qrPageTitle} width={320} height={320} className="h-64 w-64 sm:h-80 sm:w-80" />
          ) : (
            <div className="h-64 w-64 sm:h-80 sm:w-80 rounded-lg bg-gray-50" />
          )}
        </div>
        <p className="mt-4 break-all text-sm text-gray-500">{url}</p>

        <div className="print:hidden mt-8 space-y-4 text-left">
          {isLocal && (
            <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {t.survey.qrLocalhostWarning}
            </p>
          )}
          <label htmlFor="survey-url" className="block text-sm font-semibold text-gray-800">
            {t.survey.qrUrlLabel}
          </label>
          <input
            id="survey-url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={useCurrentAddress}
              className="border border-gray-200 hover:border-brand hover:text-brand text-gray-700 px-4 py-2 rounded-md text-sm font-semibold transition-colors"
            >
              {t.survey.qrUseCurrent}
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-2 border border-gray-200 hover:border-brand hover:text-brand text-gray-700 px-4 py-2 rounded-md text-sm font-semibold transition-colors"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? t.survey.qrCopied : t.survey.qrCopy}
            </button>
            <a
              href={dataUrl || undefined}
              download="healthcarejob-satisfaction-survey-qr.png"
              className={`inline-flex items-center gap-2 border border-gray-200 hover:border-brand hover:text-brand text-gray-700 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${dataUrl ? "" : "pointer-events-none opacity-50"}`}
            >
              <Download className="h-4 w-4" />
              {t.survey.qrDownload}
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
            >
              <Printer className="h-4 w-4" />
              {t.survey.qrPrint}
            </button>
          </div>
          <p className="text-sm">
            <Link href="/survey/responses" className="font-medium text-gray-500 hover:text-brand transition-colors">
              {t.survey.viewResponses}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
