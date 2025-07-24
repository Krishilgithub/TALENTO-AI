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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save form data to DB or Supabase
    // After onboarding, redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#18191b] to-[#101113] px-4 py-8 font-sans">
      <form onSubmit={handleSubmit} className="max-w-2xl w-full bg-[#18191b] p-8 rounded-2xl shadow-2xl space-y-6 border border-gray-800">
        <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">Welcome! Let’s personalize your experience</h2>
        
        {/* Company/Institute */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">Current Company/Institute</label>
          <input type="text" name="company" value={form.company} onChange={e => setForm(f => ({...f, company: e.target.value}))} className="w-full px-4 py-2 rounded bg-[#101113] text-white border border-gray-700 focus:border-cyan-400 outline-none" placeholder="Your company or college" />
        </div>

        {/* Years of Experience */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">Years of Experience</label>
          <input type="number" name="experience" value={form.experience} onChange={e => setForm(f => ({...f, experience: e.target.value}))} className="w-full px-4 py-2 rounded bg-[#101113] text-white border border-gray-700 focus:border-cyan-400 outline-none" min="0" placeholder="e.g. 2" />
        </div>

        {/* Career Level */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">Career Level</label>
          <select name="careerLevel" value={form.careerLevel} onChange={e => setForm(f => ({...f, careerLevel: e.target.value}))} className="w-full px-4 py-2 rounded bg-[#101113] text-white border border-gray-700 focus:border-cyan-400 outline-none">
            <option value="">Select</option>
            <option>Student</option>
            <option>Fresher</option>
            <option>Experienced</option>
            <option>Manager</option>
            <option>Other</option>
          </select>
        </div>

        {/* Usage */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">What are you using this website for?</label>
          <div className="flex flex-wrap gap-2">
            {["Build my first resume", "Improve existing resume", "Tailor resume for job roles", "Apply for internships/jobs"].map(opt => (
              <label key={opt} className="flex items-center gap-1 text-gray-200">
                <input type="checkbox" checked={form.usage.includes(opt)} onChange={() => handleCheckbox("usage", opt)} />
                <span>{opt}</span>
              </label>
            ))}
            <label className="flex items-center gap-1 text-gray-200">
              <input type="checkbox" checked={!!form.usageOther} onChange={e => setForm(f => ({...f, usageOther: e.target.checked ? "" : ""}))} />
              <span>Other</span>
              <input type="text" value={form.usageOther} onChange={e => setForm(f => ({...f, usageOther: e.target.value}))} className="ml-2 px-2 py-1 rounded bg-[#101113] text-white border border-gray-700" placeholder="Specify" />
            </label>
          </div>
        </div>

        {/* Target Job Roles */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">Target Job Role(s)</label>
          <input type="text" name="targetRoles" value={form.targetRoles} onChange={e => setForm(f => ({...f, targetRoles: e.target.value}))} className="w-full px-4 py-2 rounded bg-[#101113] text-white border border-gray-700 focus:border-cyan-400 outline-none" placeholder="e.g. Software Developer, Data Analyst" />
        </div>

        {/* Preferred Industry */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">Preferred Industry</label>
          <input type="text" name="industry" value={form.industry} onChange={e => setForm(f => ({...f, industry: e.target.value}))} className="w-full px-4 py-2 rounded bg-[#101113] text-white border border-gray-700 focus:border-cyan-400 outline-none" placeholder="e.g. IT, Finance, Marketing" />
        </div>

        {/* Looking For */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">Looking for</label>
          <div className="flex flex-wrap gap-2">
            {["Internships", "Full-Time Jobs", "Freelancing", "Higher Studies"].map(opt => (
              <label key={opt} className="flex items-center gap-1 text-gray-200">
                <input type="checkbox" checked={form.lookingFor.includes(opt)} onChange={() => handleCheckbox("lookingFor", opt)} />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Top Skills */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">Top Skills (comma separated)</label>
          <input type="text" name="skills" value={form.skills.join(", ")} onChange={e => setForm(f => ({...f, skills: e.target.value.split(",").map(s => s.trim())}))} className="w-full px-4 py-2 rounded bg-[#101113] text-white border border-gray-700 focus:border-cyan-400 outline-none" placeholder="e.g. Python, React, SQL" />
        </div>

        {/* Technical Interests */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">Technical Interests</label>
          <div className="flex flex-wrap gap-2">
            {["Web Development", "Data Science", "Machine Learning", "UI/UX Design", "Cybersecurity", "App Development"].map(opt => (
              <label key={opt} className="flex items-center gap-1 text-gray-200">
                <input type="checkbox" checked={form.technicalInterests.includes(opt)} onChange={() => handleCheckbox("technicalInterests", opt)} />
                <span>{opt}</span>
              </label>
            ))}
            <label className="flex items-center gap-1 text-gray-200">
              <input type="checkbox" checked={!!form.technicalOther} onChange={e => setForm(f => ({...f, technicalOther: e.target.checked ? "" : ""}))} />
              <span>Other</span>
              <input type="text" value={form.technicalOther} onChange={e => setForm(f => ({...f, technicalOther: e.target.value}))} className="ml-2 px-2 py-1 rounded bg-[#101113] text-white border border-gray-700" placeholder="Specify" />
            </label>
          </div>
        </div>

        {/* Resume Style */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">Choose Resume Style</label>
          <select name="resumeStyle" value={form.resumeStyle} onChange={e => setForm(f => ({...f, resumeStyle: e.target.value}))} className="w-full px-4 py-2 rounded bg-[#101113] text-white border border-gray-700 focus:border-cyan-400 outline-none">
            <option value="">Select</option>
            <option>Modern</option>
            <option>Professional</option>
            <option>Minimalistic</option>
            <option>Creative</option>
          </select>
        </div>

        {/* Want to add */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">Want to add</label>
          <div className="flex flex-wrap gap-2">
            {["Projects", "Certifications", "Achievements", "Hobbies", "Social Links (GitHub, LinkedIn)"].map(opt => (
              <label key={opt} className="flex items-center gap-1 text-gray-200">
                <input type="checkbox" checked={form.addSections.includes(opt)} onChange={() => handleCheckbox("addSections", opt)} />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">Social Links</label>
          <input type="text" name="socialLinks" value={form.socialLinks} onChange={e => setForm(f => ({...f, socialLinks: e.target.value}))} className="w-full px-4 py-2 rounded bg-[#101113] text-white border border-gray-700 focus:border-cyan-400 outline-none" placeholder="GitHub, LinkedIn URLs" />
        </div>

        <button type="submit" className="w-full bg-cyan-400 text-black py-3 px-4 rounded-lg font-semibold hover:bg-cyan-300 transition-all duration-200 mt-4">
          Continue
        </button>
      </form>
    </div>
  );
  
}