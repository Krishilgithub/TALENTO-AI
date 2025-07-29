"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import createClientForBrowser from '@/utils/supabase/client';
import { ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function OnboardingPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [form, setForm] = useState({
    company: "",
    experience: "",
    careerLevel: "",
    usage: [],
    usageOther: "",
    targetRoles: "",
    industry: "",
    lookingFor: [],
    skills: [],
    technicalInterests: [],
    technicalOther: "",
    resumeStyle: "",
    addSections: [],
    socialLinks: "",
  });
  const router = useRouter();

  const totalPages = 4;

  useEffect(() => {
    const checkOtp = async () => {
      const supabase = createClientForBrowser();
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.push('/login');
        return;
      }
      if (!data.user.email_confirmed_at) {
        router.push(`/verify-otp?email=${encodeURIComponent(data.user.email)}`);
        return;
      }
    };
    checkOtp();
  }, [router]);

  const handleCheckbox = (field, value) => {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter(v => v !== value)
        : [...f[field], value]
    }));
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const skipToNext = () => {
    nextPage();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Save form data to DB or Supabase
    const supabase = createClientForBrowser();
    const { data, error } = await supabase.auth.getUser();
    if (data?.user) {
      // Update user metadata to set onboarded: true
      await supabase.auth.updateUser({
        data: { onboarded: true },
      });
    }
    // After onboarding, redirect to dashboard
    router.push("/dashboard");
  };

  const renderPage = () => {
    switch (currentPage) {
      case 0:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-cyan-400 mb-2">Welcome to TALENTO AI</h2>
              <p className="text-gray-300">Let's get to know you better to personalize your experience</p>
            </div>
            
            {/* Company/Institute */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-cyan-300">
                Current Company/Institute
              </label>
              <input 
                type="text" 
                name="company" 
                value={form.company} 
                onChange={e => setForm(f => ({...f, company: e.target.value}))} 
                className="w-full px-4 py-3 rounded-lg bg-[#101113] text-white border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-lg" 
                placeholder="Your company or college" 
              />
            </div>

            {/* Years of Experience */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-cyan-300">
                Years of Experience
              </label>
              <input 
                type="number" 
                name="experience" 
                value={form.experience} 
                onChange={e => setForm(f => ({...f, experience: e.target.value}))} 
                className="w-full px-4 py-3 rounded-lg bg-[#101113] text-white border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-lg" 
                min="0" 
                placeholder="e.g. 2" 
              />
            </div>

            {/* Career Level */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-cyan-300">
                Career Level
              </label>
              <select 
                name="careerLevel" 
                value={form.careerLevel} 
                onChange={e => setForm(f => ({...f, careerLevel: e.target.value}))} 
                className="w-full px-4 py-3 rounded-lg bg-[#101113] text-white border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-lg"
              >
                <option value="">Select your career level</option>
                <option>Student</option>
                <option>Fresher</option>
                <option>Experienced</option>
                <option>Manager</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-cyan-400 mb-2">Your Goals</h2>
              <p className="text-gray-300">Tell us what you're looking to achieve</p>
            </div>

            {/* Usage */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-cyan-300">
                What are you using this website for?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {["Build my first resume", "Improve existing resume", "Tailor resume for job roles", "Apply for internships/jobs"].map(opt => (
                  <label key={opt} className="flex items-center gap-3 text-gray-200 bg-[#232425] px-4 py-3 rounded-lg cursor-pointer hover:bg-cyan-900 transition-all border border-gray-700 hover:border-cyan-400">
                    <input type="checkbox" checked={form.usage.includes(opt)} onChange={() => handleCheckbox("usage", opt)} className="accent-cyan-400 w-5 h-5" />
                    <span className="text-base">{opt}</span>
                  </label>
                ))}
              </div>
              <div className="mt-4">
                <label className="flex items-center gap-3 text-gray-200 bg-[#232425] px-4 py-3 rounded-lg cursor-pointer hover:bg-cyan-900 transition-all border border-gray-700 hover:border-cyan-400">
                  <input type="checkbox" checked={!!form.usageOther} onChange={e => setForm(f => ({...f, usageOther: e.target.checked ? "" : ""}))} className="accent-cyan-400 w-5 h-5" />
                  <span className="text-base">Other</span>
                  <input type="text" value={form.usageOther} onChange={e => setForm(f => ({...f, usageOther: e.target.value}))} className="ml-2 px-3 py-1 rounded bg-[#101113] text-white border border-gray-700 focus:border-cyan-400 flex-1" placeholder="Specify" />
                </label>
              </div>
            </div>

            {/* Target Job Roles */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-cyan-300">
                Target Job Role(s)
              </label>
              <input 
                type="text" 
                name="targetRoles" 
                value={form.targetRoles} 
                onChange={e => setForm(f => ({...f, targetRoles: e.target.value}))} 
                className="w-full px-4 py-3 rounded-lg bg-[#101113] text-white border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-lg" 
                placeholder="e.g. Software Developer, Data Analyst" 
              />
            </div>

            {/* Preferred Industry */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-cyan-300">
                Preferred Industry
              </label>
              <input 
                type="text" 
                name="industry" 
                value={form.industry} 
                onChange={e => setForm(f => ({...f, industry: e.target.value}))} 
                className="w-full px-4 py-3 rounded-lg bg-[#101113] text-white border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-lg" 
                placeholder="e.g. IT, Finance, Marketing" 
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-cyan-400 mb-2">Your Interests</h2>
              <p className="text-gray-300">Help us understand your skills and preferences</p>
            </div>

            {/* Looking For */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-cyan-300">
                Looking for
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {["Internships", "Full-Time Jobs", "Freelancing", "Higher Studies"].map(opt => (
                  <label key={opt} className="flex items-center gap-3 text-gray-200 bg-[#232425] px-4 py-3 rounded-lg cursor-pointer hover:bg-cyan-900 transition-all border border-gray-700 hover:border-cyan-400">
                    <input type="checkbox" checked={form.lookingFor.includes(opt)} onChange={() => handleCheckbox("lookingFor", opt)} className="accent-cyan-400 w-5 h-5" />
                    <span className="text-base">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Top Skills */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-cyan-300">
                Top Skills (comma separated)
              </label>
              <input 
                type="text" 
                name="skills" 
                value={form.skills.join(", ")} 
                onChange={e => setForm(f => ({...f, skills: e.target.value.split(",").map(s => s.trim())}))} 
                className="w-full px-4 py-3 rounded-lg bg-[#101113] text-white border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-lg" 
                placeholder="e.g. Python, React, SQL" 
              />
            </div>

            {/* Technical Interests */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-cyan-300">
                Technical Interests
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {["Web Development", "Data Science", "Machine Learning", "UI/UX Design", "Cybersecurity", "App Development"].map(opt => (
                  <label key={opt} className="flex items-center gap-3 text-gray-200 bg-[#232425] px-4 py-3 rounded-lg cursor-pointer hover:bg-cyan-900 transition-all border border-gray-700 hover:border-cyan-400">
                    <input type="checkbox" checked={form.technicalInterests.includes(opt)} onChange={() => handleCheckbox("technicalInterests", opt)} className="accent-cyan-400 w-5 h-5" />
                    <span className="text-base">{opt}</span>
                  </label>
                ))}
              </div>
              <div className="mt-4">
                <label className="flex items-center gap-3 text-gray-200 bg-[#232425] px-4 py-3 rounded-lg cursor-pointer hover:bg-cyan-900 transition-all border border-gray-700 hover:border-cyan-400">
                  <input type="checkbox" checked={!!form.technicalOther} onChange={e => setForm(f => ({...f, technicalOther: e.target.checked ? "" : ""}))} className="accent-cyan-400 w-5 h-5" />
                  <span className="text-base">Other</span>
                  <input type="text" value={form.technicalOther} onChange={e => setForm(f => ({...f, technicalOther: e.target.value}))} className="ml-2 px-3 py-1 rounded bg-[#101113] text-white border border-gray-700 focus:border-cyan-400 flex-1" placeholder="Specify" />
                </label>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-cyan-400 mb-2">Final Touches</h2>
              <p className="text-gray-300">Customize your resume and add your details</p>
            </div>

            {/* Resume Style */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-cyan-300">
                Choose Resume Style
              </label>
              <select 
                name="resumeStyle" 
                value={form.resumeStyle} 
                onChange={e => setForm(f => ({...f, resumeStyle: e.target.value}))} 
                className="w-full px-4 py-3 rounded-lg bg-[#101113] text-white border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-lg"
              >
                <option value="">Select your preferred style</option>
                <option>Modern</option>
                <option>Professional</option>
                <option>Minimalistic</option>
                <option>Creative</option>
              </select>
            </div>

            {/* Want to add */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-cyan-300">
                Want to add
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {["Projects", "Certifications", "Achievements", "Hobbies", "Social Links (GitHub, LinkedIn)"].map(opt => (
                  <label key={opt} className="flex items-center gap-3 text-gray-200 bg-[#232425] px-4 py-3 rounded-lg cursor-pointer hover:bg-cyan-900 transition-all border border-gray-700 hover:border-cyan-400">
                    <input type="checkbox" checked={form.addSections.includes(opt)} onChange={() => handleCheckbox("addSections", opt)} className="accent-cyan-400 w-5 h-5" />
                    <span className="text-base">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-cyan-300">
                Social Links
              </label>
              <input 
                type="text" 
                name="socialLinks" 
                value={form.socialLinks} 
                onChange={e => setForm(f => ({...f, socialLinks: e.target.value}))} 
                className="w-full px-4 py-3 rounded-lg bg-[#101113] text-white border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-lg" 
                placeholder="GitHub, LinkedIn URLs" 
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#18191b] to-[#101113] px-4 py-8 font-sans">
      <div className="max-w-2xl w-full bg-[#18191b] p-8 rounded-2xl shadow-2xl border border-gray-800 relative overflow-hidden">
        {/* Decorative background gradient blobs */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-cyan-900 opacity-30 rounded-full blur-3xl z-0 animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-900 opacity-20 rounded-full blur-3xl z-0 animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Progress Bar */}
        <div className="mb-8 z-10 relative">
          <div className="flex justify-between items-center mb-4">
            <span className="text-cyan-400 font-semibold">Step {currentPage + 1} of {totalPages}</span>
            <span className="text-gray-400 text-sm">{Math.round(((currentPage + 1) / totalPages) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="z-10 relative">
          {renderPage()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 z-10 relative">
          <button
            type="button"
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              currentPage === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            <ChevronLeftIcon className="w-5 h-5" />
            Previous
          </button>

          <div className="flex gap-3">
            {currentPage < totalPages - 1 && (
              <button
                type="button"
                onClick={skipToNext}
                className="px-6 py-3 rounded-lg font-semibold bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all duration-200"
              >
                Skip
              </button>
            )}
            
            {currentPage < totalPages - 1 ? (
              <button
                type="button"
                onClick={nextPage}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-300 hover:to-blue-400 transition-all duration-200 shadow-lg"
              >
                Next
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-300 hover:to-blue-400 transition-all duration-200 shadow-lg"
              >
                Complete Setup
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}