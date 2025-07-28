"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import createClientForBrowser from '@/utils/supabase/client';

export default function OnboardingPage() {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#18191b] to-[#101113] px-4 py-8 font-sans">
      <form onSubmit={handleSubmit} className="max-w-2xl w-full bg-[#18191b] p-8 rounded-2xl shadow-2xl space-y-8 border border-gray-800 relative overflow-hidden">
        {/* Decorative background gradient blob */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-cyan-900 opacity-30 rounded-full blur-3xl z-0" />
        <h2 className="text-4xl font-extrabold text-cyan-400 mb-8 text-center tracking-tight drop-shadow-lg">Let’s personalize your experience</h2>
        <div className="space-y-6 z-10 relative">
          {/* Company/Institute */}
          <div>
            <label className="block text-base font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <span className="material-icons text-cyan-400"></span>Current Company/Institute
            </label>
            <input type="text" name="company" value={form.company} onChange={e => setForm(f => ({...f, company: e.target.value}))} className="w-full px-4 py-2 rounded-lg bg-[#101113] text-white border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none transition-all" placeholder="Your company or college" />
          </div>
          <hr className="border-gray-800" />
          {/* Years of Experience */}
          <div>
            <label className="block text-base font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <span className="material-icons text-cyan-400"></span>Years of Experience
            </label>
            <input type="number" name="experience" value={form.experience} onChange={e => setForm(f => ({...f, experience: e.target.value}))} className="w-full px-4 py-2 rounded-lg bg-[#101113] text-white border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none transition-all" min="0" placeholder="e.g. 2" />
          </div>
          <hr className="border-gray-800" />
          {/* Career Level */}
          <div>
            <label className="block text-base font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <span className="material-icons text-cyan-400"></span>Career Level
            </label>
            <select name="careerLevel" value={form.careerLevel} onChange={e => setForm(f => ({...f, careerLevel: e.target.value}))} className="w-full px-4 py-2 rounded-lg bg-[#101113] text-white border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none transition-all">
              <option value="">Select</option>
              <option>Student</option>
              <option>Fresher</option>
              <option>Experienced</option>
              <option>Manager</option>
              <option>Other</option>
            </select>
          </div>
          <hr className="border-gray-800" />
          {/* Usage */}
          <div>
            <label className="block text-base font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <span className="material-icons text-cyan-400"></span>What are you using this website for?
            </label>
            <div className="flex flex-wrap gap-2">
              {["Build my first resume", "Improve existing resume", "Tailor resume for job roles", "Apply for internships/jobs"].map(opt => (
                <label key={opt} className="flex items-center gap-2 text-gray-200 bg-[#232425] px-3 py-1 rounded-lg cursor-pointer hover:bg-cyan-900 transition-all">
                  <input type="checkbox" checked={form.usage.includes(opt)} onChange={() => handleCheckbox("usage", opt)} className="accent-cyan-400" />
                  <span>{opt}</span>
                </label>
              ))}
              <label className="flex items-center gap-2 text-gray-200 bg-[#232425] px-3 py-1 rounded-lg cursor-pointer hover:bg-cyan-900 transition-all">
                <input type="checkbox" checked={!!form.usageOther} onChange={e => setForm(f => ({...f, usageOther: e.target.checked ? "" : ""}))} className="accent-cyan-400" />
                <span>Other</span>
                <input type="text" value={form.usageOther} onChange={e => setForm(f => ({...f, usageOther: e.target.value}))} className="ml-2 px-2 py-1 rounded bg-[#101113] text-white border border-gray-700 focus:border-cyan-400" placeholder="Specify" />
              </label>
            </div>
          </div>
          <hr className="border-gray-800" />
          {/* Target Job Roles */}
          <div>
            <label className="block text-base font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <span className="material-icons text-cyan-400"></span>Target Job Role(s)
            </label>
            <input type="text" name="targetRoles" value={form.targetRoles} onChange={e => setForm(f => ({...f, targetRoles: e.target.value}))} className="w-full px-4 py-2 rounded-lg bg-[#101113] text-white border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none transition-all" placeholder="e.g. Software Developer, Data Analyst" />
          </div>
          <hr className="border-gray-800" />
          {/* Preferred Industry */}
          <div>
            <label className="block text-base font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <span className="material-icons text-cyan-400"></span>Preferred Industry
            </label>
            <input type="text" name="industry" value={form.industry} onChange={e => setForm(f => ({...f, industry: e.target.value}))} className="w-full px-4 py-2 rounded-lg bg-[#101113] text-white border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none transition-all" placeholder="e.g. IT, Finance, Marketing" />
          </div>
          <hr className="border-gray-800" />
          {/* Looking For */}
          <div>
            <label className="block text-base font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <span className="material-icons text-cyan-400"></span>Looking for
            </label>
            <div className="flex flex-wrap gap-2">
              {["Internships", "Full-Time Jobs", "Freelancing", "Higher Studies"].map(opt => (
                <label key={opt} className="flex items-center gap-2 text-gray-200 bg-[#232425] px-3 py-1 rounded-lg cursor-pointer hover:bg-cyan-900 transition-all">
                  <input type="checkbox" checked={form.lookingFor.includes(opt)} onChange={() => handleCheckbox("lookingFor", opt)} className="accent-cyan-400" />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
          <hr className="border-gray-800" />
          {/* Top Skills */}
          <div>
            <label className="block text-base font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <span className="material-icons text-cyan-400"></span>Top Skills (comma separated)
            </label>
            <input type="text" name="skills" value={form.skills.join(", ")} onChange={e => setForm(f => ({...f, skills: e.target.value.split(",").map(s => s.trim())}))} className="w-full px-4 py-2 rounded-lg bg-[#101113] text-white border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none transition-all" placeholder="e.g. Python, React, SQL" />
          </div>
          <hr className="border-gray-800" />
          {/* Technical Interests */}
          <div>
            <label className="block text-base font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <span className="material-icons text-cyan-400"></span>Technical Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {["Web Development", "Data Science", "Machine Learning", "UI/UX Design", "Cybersecurity", "App Development"].map(opt => (
                <label key={opt} className="flex items-center gap-2 text-gray-200 bg-[#232425] px-3 py-1 rounded-lg cursor-pointer hover:bg-cyan-900 transition-all">
                  <input type="checkbox" checked={form.technicalInterests.includes(opt)} onChange={() => handleCheckbox("technicalInterests", opt)} className="accent-cyan-400" />
                  <span>{opt}</span>
                </label>
              ))}
              <label className="flex items-center gap-2 text-gray-200 bg-[#232425] px-3 py-1 rounded-lg cursor-pointer hover:bg-cyan-900 transition-all">
                <input type="checkbox" checked={!!form.technicalOther} onChange={e => setForm(f => ({...f, technicalOther: e.target.checked ? "" : ""}))} className="accent-cyan-400" />
                <span>Other</span>
                <input type="text" value={form.technicalOther} onChange={e => setForm(f => ({...f, technicalOther: e.target.value}))} className="ml-2 px-2 py-1 rounded bg-[#101113] text-white border border-gray-700 focus:border-cyan-400" placeholder="Specify" />
              </label>
            </div>
          </div>
          <hr className="border-gray-800" />
          {/* Resume Style */}
          <div>
            <label className="block text-base font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <span className="material-icons text-cyan-400"></span>Choose Resume Style
            </label>
            <select name="resumeStyle" value={form.resumeStyle} onChange={e => setForm(f => ({...f, resumeStyle: e.target.value}))} className="w-full px-4 py-2 rounded-lg bg-[#101113] text-white border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none transition-all">
              <option value="">Select</option>
              <option>Modern</option>
              <option>Professional</option>
              <option>Minimalistic</option>
              <option>Creative</option>
            </select>
          </div>
          <hr className="border-gray-800" />
          {/* Want to add */}
          <div>
            <label className="block text-base font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <span className="material-icons text-cyan-400"></span>Want to add
            </label>
            <div className="flex flex-wrap gap-2">
              {["Projects", "Certifications", "Achievements", "Hobbies", "Social Links (GitHub, LinkedIn)"].map(opt => (
                <label key={opt} className="flex items-center gap-2 text-gray-200 bg-[#232425] px-3 py-1 rounded-lg cursor-pointer hover:bg-cyan-900 transition-all">
                  <input type="checkbox" checked={form.addSections.includes(opt)} onChange={() => handleCheckbox("addSections", opt)} className="accent-cyan-400" />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
          <hr className="border-gray-800" />
          {/* Social Links */}
          <div>
            <label className="block text-base font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <span className="material-icons text-cyan-400"></span>Social Links
            </label>
            <input type="text" name="socialLinks" value={form.socialLinks} onChange={e => setForm(f => ({...f, socialLinks: e.target.value}))} className="w-full px-4 py-2 rounded-lg bg-[#101113] text-white border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none transition-all" placeholder="GitHub, LinkedIn URLs" />
          </div>
          <button type="submit" className="w-full bg-cyan-400 text-black py-3 px-4 rounded-lg font-semibold hover:bg-cyan-300 transition-all duration-200 mt-4 shadow-lg">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
  
}