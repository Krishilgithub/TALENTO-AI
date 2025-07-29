"use client";

import { useState } from "react";

export default function CareerToolsTab() {
	const [resumeFile, setResumeFile] = useState(null);
	const [atsScore, setAtsScore] = useState(null);
	const [atsFeedback, setAtsFeedback] = useState(null); // will be object
	const [isAnalyzing, setIsAnalyzing] = useState(false);

	const tools = [
		{
			name: "Resume Builder",
			description: "Create professional resumes with AI suggestions",
			icon: "📄",
			status: "Available",
		},
		{
			name: "Cover Letter Generator",
			description: "Generate personalized cover letters",
			icon: "✉️",
			status: "Available",
		},
		{
			name: "Career Assessment",
			description: "Discover your strengths and career path",
			icon: "🔍",
			status: "Available",
		},
		{
			name: "Salary Negotiation",
			description: "Learn negotiation strategies and tactics",
			icon: "💰",
			status: "Coming Soon",
		},
		{
			name: "Networking Guide",
			description: "Build professional relationships",
			icon: "🤝",
			status: "Coming Soon",
		},
		{
			name: "Industry Insights",
			description: "Stay updated with industry trends",
			icon: "📊",
			status: "Coming Soon",
		},
	];

	async function handleResumeUpload(e) {
		const file = e.target.files[0];
		if (!file) return;
		setResumeFile(file);
		setAtsScore(null);
		setAtsFeedback(null);
		setIsAnalyzing(true);

		const formData = new FormData();
		formData.append("file", file);
		formData.append("job_role", "Software Engineer"); // or allow user to select

		try {
			const res = await fetch("/api/assessment/ats_score/", {
				method: "POST",
				body: formData,
			});
			const data = await res.json();
			if (!res.ok || data.error) {
				setAtsScore(null);
				setAtsFeedback({ error: data.error || "Failed to analyze resume." });
			} else {
				setAtsScore(data.score);
				setAtsFeedback(data.feedback);
			}
		} catch (err) {
			setAtsScore(null);
			setAtsFeedback({ error: "Failed to connect to server." });
		} finally {
			setIsAnalyzing(false);
		}
	}

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-xl font-semibold text-white mb-2 font-sans">
					Career Tools
				</h2>
				<p className="text-gray-300 font-sans">
					Access powerful tools to accelerate your career growth.
				</p>
			</div>

			{/* Resume Upload & ATS Score */}
			<div className="bg-[#18191b] border border-cyan-900 rounded-xl p-6 mb-6 shadow-sm">
				<h3 className="text-lg font-bold text-cyan-400 mb-2 flex items-center gap-2 font-sans">
					Resume Optimizer & ATS Score
				</h3>
				<p className="text-gray-400 mb-4 font-sans">
					Upload your resume (PDF or DOCX) to see how it performs with Applicant
					Tracking Systems and get optimization tips.
				</p>
				<input
					type="file"
					accept=".pdf,.docx"
					onChange={handleResumeUpload}
					className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-900 file:text-cyan-300 hover:file:bg-cyan-800 mb-4 font-sans"
				/>
				{isAnalyzing && (
					<div className="flex items-center gap-2 text-cyan-400 font-medium font-sans">
						<svg
							className="animate-spin h-6 w-6 text-cyan-400"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
							></path>
						</svg>
						Analyzing your resume...
					</div>
				)}
				{atsScore !== null && atsFeedback && !atsFeedback.error && (
					<div className="mt-4 p-4 rounded-lg bg-[#232323] border border-cyan-900 shadow">
						<div className="text-lg font-bold text-cyan-400 mb-2 font-sans">
							ATS Score: {atsScore}
						</div>
						{/* Strengths */}
						<div className="mb-2">
							<span className="font-semibold text-cyan-300">Strengths:</span>
							<ul className="list-disc list-inside ml-4 text-gray-200">
								{atsFeedback.strengths && atsFeedback.strengths.length > 0 ? (
									atsFeedback.strengths.map((s, i) => <li key={i}>{s}</li>)
								) : (
									<li className="text-gray-400">None</li>
								)}
							</ul>
						</div>
						{/* Weaknesses */}
						<div className="mb-2">
							<span className="font-semibold text-cyan-300">Weaknesses:</span>
							<ul className="list-disc list-inside ml-4 text-gray-200">
								{atsFeedback.weaknesses && atsFeedback.weaknesses.length > 0 ? (
									atsFeedback.weaknesses.map((w, i) => <li key={i}>{w}</li>)
								) : (
									<li className="text-gray-400">None</li>
								)}
							</ul>
						</div>
						{/* Tips */}
						<div className="mb-2">
							<span className="font-semibold text-cyan-300">Tips:</span>
							<ul className="list-disc list-inside ml-4 text-gray-200">
								{atsFeedback.tips && atsFeedback.tips.length > 0 ? (
									atsFeedback.tips.map((t, i) => <li key={i}>{t}</li>)
								) : (
									<li className="text-gray-400">None</li>
								)}
							</ul>
						</div>
						{/* Improvement Plan */}
						<div className="mb-2">
							<span className="font-semibold text-cyan-300">
								Improvement Plan:
							</span>
							<ul className="list-disc list-inside ml-4 text-gray-200">
								{atsFeedback.improvement_plan &&
								atsFeedback.improvement_plan.length > 0 ? (
									atsFeedback.improvement_plan.map((imp, i) => (
										<li key={i}>{imp}</li>
									))
								) : (
									<li className="text-gray-400">None</li>
								)}
							</ul>
						</div>
					</div>
				)}
				{atsFeedback && atsFeedback.error && (
					<div className="mt-4 p-4 rounded-lg bg-red-900/30 border border-red-700 text-red-300 font-sans">
						{atsFeedback.error}
					</div>
				)}
			</div>

			{/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{tools.map((tool) => (
					<div
						key={tool.name}
						className="bg-[#18191b] border border-cyan-900 rounded-lg p-6 flex items-center gap-4"
					>
						<div className="text-3xl">{tool.icon}</div>
						<div className="flex-1">
							<h4 className="text-lg font-semibold text-white mb-1 font-sans">
								{tool.name}
							</h4>
							<p className="text-gray-400 text-sm font-sans">
								{tool.description}
							</p>
						</div>
						{tool.status === "Coming Soon" && (
							<span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full font-sans bg-cyan-400 text-black">
								Coming Soon
							</span>
						)}
					</div>
				))}
			</div> */}
		</div>
	);
} 