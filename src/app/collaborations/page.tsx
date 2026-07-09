"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BookOpen, HeartHandshake, Briefcase } from "lucide-react";
import InstitutionBadge from "@/components/ui/InstitutionBadge";
import { useLanguage } from "@/context/LanguageContext";

const institutions = [
  { name: "McMaster University", logo: "/mcmaster.png" },
  { name: "University of Toronto", logo: "/uoft.png" },
  { name: "Western University", logo: "/western.png" },
  { name: "Queen's University", logo: "/queens.png" },
  { name: "York University", logo: "/yorku.png" },
  { name: "University of Waterloo", logo: "/waterloo.png" },
  { name: "TMU", logo: "/tmu.png" },
  { name: "Carleton University", logo: "/carleton.png" },
  { name: "University of Windsor", logo: "/uwindsor.png" },
  { name: "Seneca Polytechnic", logo: "/seneca.png" },
];

export default function CollaborationsPage() {
  const { t } = useLanguage();

  const supportPillars = [
    {
      title: t.collaborations.supportPillar1,
      icon: BookOpen,
    },
    {
      title: t.collaborations.supportPillar2,
      icon: HeartHandshake,
    },
    {
      title: t.collaborations.supportPillar3,
      icon: Briefcase,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-brand/5 via-white to-white py-24 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        {/* Decorative background glows */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-24 w-md h-112 rounded-full bg-brand/10 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
              backgroundSize: "28px 28px",
              color: "#8c0000",
            }}
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand tracking-tight text-balance"
          >
            {t.collaborations.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 leading-relaxed text-balance"
          >
            {t.collaborations.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-72 lg:h-full min-h-80 rounded-3xl overflow-hidden shadow-sm"
          >
            <Image
              src="/carefacility2.jpg"
              alt="Care facility interior"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass p-10 md:p-14 rounded-3xl"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.collaborations.missionTitle}</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              {t.collaborations.missionDesc1}
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t.collaborations.missionDesc2}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Institutions Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.collaborations.partnersTitle}</h2>
            <p className="text-lg text-gray-500">{t.collaborations.partnersSubtitle}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {institutions.map((inst, index) => (
              <InstitutionBadge key={inst.name} name={inst.name} logoPath={inst.logo} delay={index * 0.05} />
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-brand text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.collaborations.supportTitle}</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto text-balance">
              {t.collaborations.supportSubtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {supportPillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center"
              >
                <pillar.icon className="w-12 h-12 mx-auto mb-6 text-white" />
                <h3 className="text-xl font-semibold">{pillar.title}</h3>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center bg-black/20 p-8 rounded-2xl border border-white/10 max-w-4xl mx-auto"
          >
            <p className="text-lg md:text-xl font-medium leading-relaxed">
              {t.collaborations.supportFooter}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
