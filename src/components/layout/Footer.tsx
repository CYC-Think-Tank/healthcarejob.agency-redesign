"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-gray-50 border-t py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div variants={itemVariants}>
            <Link href="/" className="flex items-center mb-4 group transition-transform duration-300 hover:scale-105">
              <Image
                src={language === 'zh' ? "/chineselogo.png" : "/healthcarejobagencylogo.png"}
                alt={`${t.siteName} Logo`}
                width={200}
                height={200}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-gray-600 mb-4 text-balance">
              {t.footer.desc1}
            </p>
            <p className="text-sm text-gray-500 text-balance">
              {t.footer.desc2}
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-gray-900 mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/#services" className="hover:text-brand transition-colors">{t.nav.services}</Link></li>
              <li><Link href="/collaborations" className="hover:text-brand transition-colors">{t.nav.collaboration}</Link></li>
              <li><Link href="/career" className="hover:text-brand transition-colors">{t.nav.career}</Link></li>
              <li><a href="https://healthcare-job-agency-gpbjdvfqftgwedf7.eastus2-01.azurewebsites.net/apply-now" className="hover:text-brand transition-colors">{t.nav.apply}</a></li>
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-gray-900 mb-4">{t.footer.contact}</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand shrink-0" />
                <a href="mailto:care@healthcarejob.agency" className="hover:text-brand transition-colors truncate">
                  care@healthcarejob.agency
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand shrink-0" />
                <span>(416) 343-3379</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500"
        >
          <p>© {new Date().getFullYear()} {t.siteName}. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}
