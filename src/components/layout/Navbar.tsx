"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { name: t.nav.services, href: "/#services" },
    { name: t.nav.collaboration, href: "/collaborations" },
    { name: t.nav.career, href: "/career" },
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group transition-transform duration-300 hover:scale-105">
            <Image 
              src="/healthcarejobagencylogo.png"
              alt="HealthcareJob.Agency Logo"
              width={200}
              height={200}
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-brand transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://healthcare-job-agency-gpbjdvfqftgwedf7.eastus2-01.azurewebsites.net/apply-now"
              className="bg-brand hover:bg-brand-hover text-white px-5 py-2 rounded-md text-sm font-semibold transition-all hover:shadow-sm"
            >
              {t.nav.apply}
            </a>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
              <button 
                onClick={() => setLanguage('en')}
                className={language === 'en' ? "text-brand" : "hover:text-brand transition-colors"}
              >
                EN
              </button>
              <span>|</span>
              <button 
                onClick={() => setLanguage('zh')}
                className={language === 'zh' ? "text-brand" : "hover:text-brand transition-colors"}
              >
                ZH
              </button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-white overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand hover:bg-brand-light"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-4 px-3 flex gap-4 text-sm font-medium">
                <button 
                  onClick={() => { setLanguage('en'); setIsOpen(false); }}
                  className={language === 'en' ? "text-brand" : "text-gray-500 hover:text-brand"}
                >
                  EN
                </button>
                <button 
                  onClick={() => { setLanguage('zh'); setIsOpen(false); }}
                  className={language === 'zh' ? "text-brand" : "text-gray-500 hover:text-brand"}
                >
                  ZH
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
