"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function CareerPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Header Section */}
      <section className="relative text-white py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[40vh] overflow-hidden bg-brand">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/backgroundhomepage.jpeg"
            alt="Healthcare Facility Background"
            fill
            className="object-cover object-center opacity-30"
            priority
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            {t.career.heroTitle}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl font-medium text-white/90 max-w-2xl text-balance mb-8"
          >
            {t.career.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <a
              href="https://healthcare-job-agency-gpbjdvfqftgwedf7.eastus2-01.azurewebsites.net/apply-now"
              className="inline-flex items-center justify-center bg-white text-brand px-8 py-3 rounded-md font-semibold hover:bg-gray-50 transition-colors shadow-sm text-lg"
            >
              {t.career.applyNow}
            </a>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-900 mb-12"
          >
            {t.career.sectionTitle}
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* PSW Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            >
              <div className="relative h-48 w-full">
                <Image 
                  src="https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=800&auto=format&fit=crop"
                  alt="Personal Support Worker"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-brand mb-4">{t.career.psw.title}</h3>
                
                <div className="space-y-6 text-sm text-gray-600">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t.career.psw.summaryLabel}</h4>
                    <p className="leading-relaxed">{t.career.psw.summary}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t.career.psw.respLabel}</h4>
                    <ul className="list-disc pl-5 space-y-1.5 marker:text-gray-400">
                      <li>{t.career.psw.resp1}</li>
                      <li>{t.career.psw.resp2}</li>
                      <li>{t.career.psw.resp3}</li>
                      <li>{t.career.psw.resp4}</li>
                      <li>{t.career.psw.resp5}</li>
                      <li>{t.career.psw.resp6}</li>
                      <li>{t.career.psw.resp7}</li>
                      <li>{t.career.psw.resp8}</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t.career.psw.qualLabel}</h4>
                    <ul className="list-disc pl-5 space-y-1.5 marker:text-gray-400">
                      <li>{t.career.psw.qual1}</li>
                      <li>{t.career.psw.qual2}</li>
                      <li>{t.career.psw.qual3}</li>
                      <li>{t.career.psw.qual4}</li>
                      <li>{t.career.psw.qual5}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RPN Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            >
              <div className="relative h-48 w-full">
                <Image 
                  src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=800&auto=format&fit=crop"
                  alt="Registered Practical Nurse"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-brand mb-4">{t.career.rpn.title}</h3>
                
                <div className="space-y-6 text-sm text-gray-600">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t.career.rpn.summaryLabel}</h4>
                    <p className="leading-relaxed">{t.career.rpn.summary}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t.career.rpn.respLabel}</h4>
                    <ul className="list-disc pl-5 space-y-1.5 marker:text-gray-400">
                      <li>{t.career.rpn.resp1}</li>
                      <li>{t.career.rpn.resp2}</li>
                      <li>{t.career.rpn.resp3}</li>
                      <li>{t.career.rpn.resp4}</li>
                      <li>{t.career.rpn.resp5}</li>
                      <li>{t.career.rpn.resp6}</li>
                      <li>{t.career.rpn.resp7}</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t.career.rpn.qualLabel}</h4>
                    <ul className="list-disc pl-5 space-y-1.5 marker:text-gray-400">
                      <li>{t.career.rpn.qual1}</li>
                      <li>{t.career.rpn.qual2}</li>
                      <li>{t.career.rpn.qual3}</li>
                      <li>{t.career.rpn.qual4}</li>
                      <li>{t.career.rpn.qual5}</li>
                      <li>{t.career.rpn.qual6}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
