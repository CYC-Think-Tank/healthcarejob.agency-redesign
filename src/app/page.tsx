"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, Users, Stethoscope, Building2 } from "lucide-react";
import ServiceCard from "@/components/ui/ServiceCard";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[85vh] overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/backgroundhomepage.jpeg"
            alt="Healthcare Facility Background"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(140, 0, 0, 0.8)' }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center -mt-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6 relative z-10"
          >
            <Image 
              src="/healthcarejobagencylogo.png"
              alt="HealthcareJob.Agency Logo"
              width={100}
              height={100}
              className="w-20 h-20 mx-auto object-contain opacity-95 drop-shadow-md"
              style={{ filter: 'brightness(0) invert(1)' }}
              priority
            />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-balance mb-8 tracking-tight text-white relative z-10"
          >
            {t.home.heroTitlePart1} <br className="hidden md:block"/>
            <span className="text-white">{t.home.heroTitlePart2}</span> {t.home.heroTitlePart3}
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6 text-lg md:text-xl font-medium text-white/90 mb-10 relative z-10"
          >
            <p>
              {t.home.heroSubtitlePart1} <br className="hidden md:block"/>
              <span className="font-bold text-white">{t.home.heroSubtitlePart2}</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-lg font-semibold relative z-10"
          >
            <a href="tel:4163433379" className="flex items-center gap-3 bg-white text-brand hover:bg-gray-50 px-8 py-3.5 rounded-md transition-colors shadow-sm font-semibold">
              <Phone className="w-5 h-5" />
              <span>(416) 343-3379</span>
            </a>
            <a href="/apply" className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-white px-8 py-3.5 rounded-md transition-colors shadow-sm font-semibold">
              {t.home.applyNow}
            </a>
          </motion.div>
        </div>
      </section>
        
      {/* Split Services Intro Section */}
      <section id="services" className="py-0 border-b border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Text Content */}
          <div className="p-12 md:p-24 flex flex-col justify-center bg-white">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-8 text-brand"
            >
              {t.home.servicesTitle}
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6 text-lg text-brand/80"
            >
              <p>
                {t.home.servicesDesc1}
              </p>
              <p>
                {t.home.servicesDesc2}
              </p>
            </motion.div>
          </div>
          
          {/* Image */}
          <div className="relative min-h-[400px] lg:min-h-full">
            <Image 
              src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=2000&auto=format&fit=crop"
              alt="Nurse providing care to an elderly patient"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* Service Cards Section */}
      <section className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard 
              title={t.home.pswTitle}
              description={t.home.pswDesc}
              icon={Users}
              delay={0.1}
            />
            <ServiceCard 
              title={t.home.rpnTitle}
              description={t.home.rpnDesc}
              icon={Stethoscope}
              delay={0.2}
            />
            <ServiceCard 
              title={t.home.nsTitle}
              description={t.home.nsDesc}
              icon={Building2}
              delay={0.3}
            />
          </div>
        </div>
      </section>
      
      {/* Footer Banner */}
      <section className="bg-brand text-white py-16 px-4 sm:px-6 lg:px-8 border-t-4 border-brand-hover">
         <div className="max-w-4xl mx-auto text-center space-y-6">
             <a href={`mailto:${t.home.footerBannerEmail}`} className="text-2xl md:text-3xl font-bold hover:text-brand-light transition-colors inline-block">
               {t.home.footerBannerEmail}
             </a>
             <p className="text-white/90 text-lg md:text-xl text-balance max-w-3xl mx-auto">
               {t.home.footerBannerDesc}
             </p>
         </div>
      </section>
    </div>
  );
}
