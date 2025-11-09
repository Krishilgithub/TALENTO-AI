"use client";

import React, { useState } from "react";

const CAREER_STEPS = [
	{
		step: 1,
		title: "Self-Assessment",
		description:
			"Understand your strengths, interests, and skills. Take our assessments to get started.",
		action: { label: "Take Assessment", href: "/assessment" },
	},
	{
		step: 2,
		title: "Explore Career Paths",
		description: "Browse popular roles and industries that match your profile.",
		action: null,
	},
	{
		step: 3,
		title: "Set Goals",
		description: "Define your short-term and long-term career goals.",
		action: null,
	},
	{
		step: 4,
		title: "Track Progress",
		description: "Monitor your journey and update your progress regularly.",
		action: null,
	},
];

const CAREER_PATHS = [
	"Software Engineer",
	"Data Scientist",
	"Product Manager",
	"Digital Marketer",
	"Financial Analyst",
	"UX/UI Designer",
	"Mechanical Engineer",
	"Entrepreneur",
];

export default function CareerPage() {
	// --- State for Career Tools ---
	const [activeTool, setActiveTool] = useState("ats");
	const [file, setFile] = useState(null);
	const [jobRole, setJobRole] = useState("Software Engineer");
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState(null);
	const [error, setError] = useState("");

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
		setResult(null);
		setError("");
	};

	const handleJobRoleChange = (e) => {
		setJobRole(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!file) {
			setError("Please upload a resume file (PDF or DOCX).");
			return;
		}
		setLoading(true);
		setResult(null);
		setError("");
		const formData = new FormData();
		formData.append("file", file);
		formData.append("job_role", jobRole);
		let endpoint = "";
		if (activeTool === "ats") {
			endpoint = "/api/assessment/ats_score/";
		} else {
			endpoint = "/api/assessment/resume_optimize/";
		}
		try {
			const res = await fetch(endpoint, {
				method: "POST",
				body: formData,
			});
			const data = await res.json();
			if (!res.ok) {
				setError(data.error || "Something went wrong.");
			} else {
				setResult(data.result || data); // resume_optimize returns {result: ...}, ats_score returns JSON directly
			}
		} catch (err) {
			setError("Failed to connect to server.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4">
			{/* Loading Spinner Overlay */}
			{loading && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
					<div className="flex flex-col items-center">
						<svg
							className="animate-spin h-12 w-12 text-cyan-400 mb-4"
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
						<div className="text-cyan-200 font-semibold text-lg">
							Analyzing Resume...
						</div>
					</div>
				</div>
			)}
			<h1 className="text-3xl font-bold mb-2 text-white">Career Planning</h1>
			<p className="text-lg text-gray-300 mb-8 text-center max-w-2xl">
				Plan your career with confidence! Follow the steps below to discover
				your strengths, explore opportunities, set goals, and track your
				progress.
			</p>
			<div className="w-full max-w-3xl mb-12">
				{CAREER_STEPS.map((step) => (
					<div
						key={step.step}
						className="bg-gray-800/30 border border-gray-600/50 backdrop-blur-sm rounded-xl shadow-md p-6 mb-6 flex flex-col md:flex-row items-start md:items-center"
					>
						<div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-900 flex items-center justify-center text-lg font-bold text-cyan-300 mr-4 mb-2 md:mb-0">
							{step.step}
						</div>
						<div className="flex-1">
							<h2 className="text-xl font-semibold text-cyan-400 mb-1">
								{step.title}
							</h2>
							<p className="text-gray-400 mb-2">{step.description}</p>
							{step.action && (
								<a
									href={step.action.href}
									className="inline-block bg-cyan-400 text-black px-4 py-2 rounded hover:bg-cyan-300 transition-colors duration-200"
								>
									{step.action.label}
								</a>
							)}
						</div>
					</div>
				))}
			</div>
			<div className="w-full max-w-3xl mb-12">
				<h3 className="text-lg font-semibold text-yellow-400 mb-2">
					Popular Career Paths
				</h3>
				<div className="flex flex-wrap gap-3">
					{CAREER_PATHS.map((path) => (
						<span
							key={path}
							className="bg-yellow-900 text-yellow-200 px-3 py-1 rounded-full text-sm font-medium"
						>
							{path}
						</span>
					))}
				</div>
			</div>
			<div className="w-full max-w-3xl">
				<h3 className="text-lg font-semibold text-gray-200 mb-2">
					Resources & Next Steps
				</h3>
				<ul className="list-disc list-inside text-gray-400">
					<li>
						Take relevant assessments to identify your strengths and areas for
						growth.
					</li>
					<li>Research roles and industries that interest you.</li>
					<li>Set clear, achievable career goals and review them regularly.</li>
					<li>Track your progress and celebrate milestones along the way!</li>
				</ul>
			</div>
			<div className="w-full max-w-3xl mt-12">
				<h3 className="text-lg font-semibold text-cyan-300 mb-4">
					Career Tools
				</h3>
				<div className="flex gap-4 mb-6">
					<button
						onClick={() => setActiveTool("ats")}
						className={`px-4 py-2 rounded font-semibold transition-colors duration-200 ${activeTool === "ats"
								? "bg-cyan-400 text-black"
								: "bg-gray-800/30 border border-gray-600/50 backdrop-blur-sm text-cyan-300 hover:border-cyan-400/50"
							}`}
					>
						ATS Score
					</button>
					<button
						onClick={() => setActiveTool("optimizer")}
						className={`px-4 py-2 rounded font-semibold transition-colors duration-200 ${activeTool === "optimizer"
								? "bg-cyan-400 text-black"
								: "bg-gray-800/30 border border-gray-600/50 backdrop-blur-sm text-cyan-300 hover:border-cyan-400/50"
							}`}
					>
						Resume Optimizer
					</button>
				</div>
				<form
					onSubmit={handleSubmit}
					className="bg-gray-800/30 border border-gray-600/50 backdrop-blur-sm rounded-xl p-6 flex flex-col gap-4"
				>
					<label className="text-gray-300 font-medium">
						Upload Resume (PDF or DOCX):
						<input
							type="file"
							accept=".pdf,.docx"
							onChange={handleFileChange}
							className="block mt-2 text-gray-200"
						/>
					</label>
					<label className="text-gray-300 font-medium">
						Job Role:
						<input
							type="text"
							value={jobRole}
							onChange={handleJobRoleChange}
							className="ml-2 px-2 py-1 rounded bg-gray-800/30 border border-gray-600/50 backdrop-blur-sm text-white"
						/>
					</label>
					<button
						type="submit"
						className="bg-cyan-400 text-black px-4 py-2 rounded font-semibold hover:bg-cyan-300 transition-colors duration-200"
						disabled={loading}
					>
						{loading
							? "Processing..."
							: activeTool === "ats"
								? "Get ATS Score"
								: "Optimize Resume"}
					</button>
					{error && (
						<div className="text-red-400 font-medium mt-2">{error}</div>
					)}
				</form>
				{result && (
					<div className="mt-6 bg-[#232428] rounded-xl p-6 border border-cyan-800 text-gray-200">
						{activeTool === "ats" && result.score !== undefined ? (
							<div>
								<div className="text-2xl font-bold text-cyan-300 mb-2">
									ATS Score: {result.score}/100
								</div>
								{result.feedback && (
									<div className="mt-4">
										<h4 className="text-lg font-semibold text-cyan-200 mb-2">
											Detailed Feedback
										</h4>
										<div className="mb-3">
											<span className="font-semibold text-cyan-300">
												Strengths:
											</span>
											<ul className="list-disc list-inside ml-4">
												{result.feedback.strengths &&
													result.feedback.strengths.length > 0 ? (
													result.feedback.strengths.map((s, i) => (
														<li key={i}>{s}</li>
													))
												) : (
													<li className="text-gray-400">None</li>
												)}
											</ul>
										</div>
										<div className="mb-3">
											<span className="font-semibold text-cyan-300">
												Weaknesses:
											</span>
											<ul className="list-disc list-inside ml-4">
												{result.feedback.weaknesses &&
													result.feedback.weaknesses.length > 0 ? (
													result.feedback.weaknesses.map((w, i) => (
														<li key={i}>{w}</li>
													))
												) : (
													<li className="text-gray-400">None</li>
												)}
											</ul>
										</div>
										<div className="mb-3">
											<span className="font-semibold text-cyan-300">Tips:</span>
											<ul className="list-disc list-inside ml-4">
												{result.feedback.tips &&
													result.feedback.tips.length > 0 ? (
													result.feedback.tips.map((t, i) => (
														<li key={i}>{t}</li>
													))
												) : (
													<li className="text-gray-400">None</li>
												)}
											</ul>
										</div>
									</div>
								)}
							</div>
						) : (
							// Resume Optimizer output (plain text or markdown)
							<div>
								<div className="text-xl font-bold text-cyan-300 mb-2">
									Resume Optimization Suggestions
								</div>
								<pre className="whitespace-pre-wrap text-gray-200">
									{result}
								</pre>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
