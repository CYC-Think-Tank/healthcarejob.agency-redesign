"use client";

import { UserPlus, Upload, XCircle, Download, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="block text-xs font-bold text-gray-700 mb-1.5">
    {children} {required && <span className="text-brand">*</span>}
  </label>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 mb-6">
    {children}
  </h2>
);

const inputBaseClass = "w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-colors text-gray-900 placeholder:text-gray-400";

export default function ApplyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-8 sm:p-12">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-brand text-white p-2 rounded-lg shadow-sm">
              <UserPlus className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{t.apply.title}</h1>
          </div>
          <p className="text-gray-500 mb-10 text-xs">
            {t.apply.subtitle}
          </p>

          <motion.form 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10"
          >
            {/* Personal Information */}
            <motion.div variants={sectionVariants}>
              <SectionTitle>{t.apply.personalInfo}</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label required>{t.apply.firstName}</Label>
                  <input type="text" placeholder="John" className={inputBaseClass} />
                </div>
                <div>
                  <Label required>{t.apply.lastName}</Label>
                  <input type="text" placeholder="Smith" className={inputBaseClass} />
                </div>
              </div>
              <div className="mb-6">
                <Label required>{t.apply.email}</Label>
                <input type="email" placeholder="john.smith@example.com" className={inputBaseClass} />
              </div>
              <div>
                <Label required>{t.apply.phone}</Label>
                <div className="flex">
                  <div className="flex items-center border border-gray-200 border-r-0 rounded-l-md px-3 bg-gray-50 text-sm">
                    <span className="mr-1">🇨🇦</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </div>
                  <input type="tel" placeholder="(123) 456-7890" className={`${inputBaseClass} rounded-l-none`} />
                </div>
              </div>
            </motion.div>

            {/* Professional Information */}
            <motion.div variants={sectionVariants}>
              <SectionTitle>{t.apply.professionalInfo}</SectionTitle>
              
              <div className="mb-6">
                <Label required>{t.apply.position}</Label>
                <div className="relative">
                  <select className={`${inputBaseClass} appearance-none pr-10 text-gray-600`}>
                    <option>Select Position</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div className="mb-6">
                <Label required>{t.apply.certificate}</Label>
                <div className="relative">
                  <select className={`${inputBaseClass} appearance-none pr-10 text-gray-600`}>
                    <option>Select Status</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label required>{t.apply.experience}</Label>
                  <div className="relative">
                    <select className={`${inputBaseClass} appearance-none pr-10 bg-gray-50 text-gray-600`}>
                      <option>Select Experience</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <Label required>{t.apply.status}</Label>
                  <div className="relative">
                    <select className={`${inputBaseClass} appearance-none pr-10 text-gray-600`}>
                      <option>Select Status</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label required>{t.apply.education}</Label>
                  <div className="relative">
                    <select className={`${inputBaseClass} appearance-none pr-10 text-gray-600`}>
                      <option>Select Education Level</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <Label required>{t.apply.startDate}</Label>
                  <input type="date" className={`${inputBaseClass} text-gray-600`} />
                </div>
              </div>

              <div className="mb-6">
                <Label required>{t.apply.languages}</Label>
                <div className="relative">
                  <select className={`${inputBaseClass} appearance-none pr-10 text-gray-600`}>
                    <option>Select Languages</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div className="mb-6">
                <Label>{t.apply.salary}</Label>
                <input type="text" placeholder="Enter hourly expected salary" className={inputBaseClass} />
              </div>

              <div className="mb-6">
                <Label>{t.apply.healthcareExp}</Label>
                <textarea 
                  rows={4} 
                  placeholder="Describe your volunteer experience" 
                  className={`${inputBaseClass} resize-y`}
                />
              </div>

              <div className="mb-6">
                <Label>{t.apply.profExp}</Label>
                <textarea 
                  rows={4} 
                  placeholder="Describe your professional experience" 
                  className={`${inputBaseClass} resize-y`}
                />
              </div>

              <div className="mb-6">
                <Label>{t.apply.howDidYouHear}</Label>
                <div className="relative">
                  <select className={`${inputBaseClass} appearance-none pr-10 text-gray-600`}>
                    <option>Select an Option</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label>{t.apply.driverLicense}</Label>
                  <div className="relative">
                    <select className={`${inputBaseClass} appearance-none pr-10 text-gray-600`}>
                      <option>Select</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <Label>{t.apply.car}</Label>
                  <div className="relative">
                    <select className={`${inputBaseClass} appearance-none pr-10 text-gray-600`}>
                      <option>Select</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Documents Section */}
            <motion.div variants={sectionVariants}>
              <SectionTitle>{t.apply.documents}</SectionTitle>
              <p className="text-xs text-gray-500 mb-4 -mt-4">{t.apply.docSubtitle}</p>
              
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-gray-400 border-b border-gray-200 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="px-6 py-4 font-medium whitespace-nowrap">{t.apply.docType}</th>
                        <th className="px-6 py-4 font-medium whitespace-nowrap">{t.apply.fileName}</th>
                        <th className="px-6 py-4 font-medium whitespace-nowrap">{t.apply.size}</th>
                        <th className="px-6 py-4 font-medium whitespace-nowrap">{t.apply.uploadDate}</th>
                        <th className="px-6 py-4 font-medium whitespace-nowrap">{t.apply.docStatus}</th>
                        <th className="px-6 py-4 font-medium whitespace-nowrap">{t.apply.uploadAdd}</th>
                        <th className="px-6 py-4 font-medium whitespace-nowrap">{t.apply.actions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="px-6 py-5 align-top">
                          <p className="font-medium text-gray-900 mb-1">{t.apply.resumeTitle}</p>
                          <p className="text-gray-400 text-[11px] whitespace-nowrap">{t.apply.resumeDesc}</p>
                        </td>
                        <td className="px-6 py-5 text-gray-400 align-top pt-7 whitespace-nowrap">{t.apply.noFile}</td>
                        <td className="px-6 py-5 text-gray-400 align-top pt-7 whitespace-nowrap">-</td>
                        <td className="px-6 py-5 text-gray-400 align-top pt-7 whitespace-nowrap">-</td>
                        <td className="px-6 py-5 align-top pt-7 whitespace-nowrap">
                          <div className="flex items-center text-brand font-medium gap-1.5">
                            <XCircle className="w-3.5 h-3.5" /> {t.apply.missing}
                          </div>
                        </td>
                        <td className="px-6 py-5 align-top pt-5 whitespace-nowrap">
                          <button type="button" className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors bg-white">
                            <Upload className="w-3.5 h-3.5" /> {t.apply.uploadBtn}
                          </button>
                        </td>
                        <td className="px-6 py-5"></td>
                      </tr>
                      <tr>
                        <td className="px-6 py-5 align-top">
                          <p className="font-medium text-gray-900 mb-1">{t.apply.idTitle}</p>
                          <p className="text-gray-400 text-[11px] max-w-[200px] leading-tight">{t.apply.idDesc}</p>
                        </td>
                        <td className="px-6 py-5 text-gray-400 align-top pt-7 whitespace-nowrap">{t.apply.noFile}</td>
                        <td className="px-6 py-5 text-gray-400 align-top pt-7 whitespace-nowrap">-</td>
                        <td className="px-6 py-5 text-gray-400 align-top pt-7 whitespace-nowrap">-</td>
                        <td className="px-6 py-5 align-top pt-7 whitespace-nowrap">
                          <div className="flex items-center text-brand font-medium gap-1.5">
                            <XCircle className="w-3.5 h-3.5" /> {t.apply.missing}
                          </div>
                        </td>
                        <td className="px-6 py-5 align-top pt-5 whitespace-nowrap">
                          <button type="button" className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors bg-white">
                            <Upload className="w-3.5 h-3.5" /> {t.apply.uploadBtn}
                          </button>
                        </td>
                        <td className="px-6 py-5"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-center p-4 border-t border-gray-100 bg-gray-50/50">
                  <button type="button" className="flex items-center gap-2 text-xs text-gray-500 font-medium px-4 py-2 border border-gray-200 rounded-md bg-white hover:bg-gray-50 transition-colors shadow-sm">
                    <Download className="w-3.5 h-3.5" /> {t.apply.downloadAll} <span className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center text-[10px] ml-1 border border-gray-200">0</span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="w-full bg-[#da291c] hover:bg-[#b82218] text-white font-medium py-3 rounded-md transition-colors shadow-sm text-sm">
                {t.apply.submit}
              </button>
            </motion.div>
            
            {/* Footer Links */}
            <motion.div variants={sectionVariants} className="flex justify-between items-center text-xs text-[#da291c] font-medium pt-2">
              <a href="#" className="hover:underline">{t.apply.staffSignIn}</a>
              <a href="#" className="hover:underline">{t.apply.checkStatus}</a>
            </motion.div>

          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}
