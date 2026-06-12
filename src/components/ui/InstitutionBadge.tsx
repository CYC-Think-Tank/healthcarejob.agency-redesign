"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface InstitutionBadgeProps {
  name: string;
  logoPath: string;
  delay?: number;
}

export default function InstitutionBadge({ name, logoPath, delay = 0 }: InstitutionBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl p-6 flex flex-col items-center justify-center text-center gap-4 h-40 hover:border-brand/20 hover:bg-brand-light/30 transition-colors cursor-default shadow-sm hover:shadow-md border border-gray-100"
    >
      <div className="relative w-full h-16 flex items-center justify-center">
        <Image 
          src={logoPath}
          alt={`${name} logo`}
          fill
          className="object-contain"
        />
      </div>
      <span className="font-semibold text-gray-800 text-sm leading-tight">{name}</span>
    </motion.div>
  );
}
