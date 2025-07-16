"use client";

import React, { useState } from "react";

const ASSESSMENTS = [
	{
		key: "aptitude",
		name: "General Aptitude Test",
		description:
			"Evaluate your logical, quantitative, and verbal reasoning skills.",
	},
	{
		key: "technical",
		name: "Technical Assessment",
		description:
			"Test your technical knowledge in programming, engineering, or your chosen field.",
	},
	{
		key: "personality",
		name: "Personality Assessment",
		description:
			"Discover your strengths, work style, and ideal career environments.",
	},
	{
		key: "communication",
		name: "Communication Skills Test",
		description: "Assess your written and verbal communication abilities.",
	},
];

export default function AssessmentPage() {
	const [selectedFile, setSelectedFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [questions, setQuestions] = useState([]);
	const [options, setOptions] = useState([]);
	const [answers, setAnswers] = useState([]);
	const [error, setError] = useState("");

	const handleFileChange = (e) => {
		setSelectedFile(e.target.files[0]);
	};

	const handleStartAssessment = async () => {
		if (!selectedFile) return;
		setLoading(true);
		setError("");
		setQuestions([]);
		setOptions([]);
		setAnswers([]);
		try {
			const formData = new FormData();
			formData.append("file", selectedFile);
			const res = await fetch(
				"http://localhost:8000/api/assessment/upload_resume/",
				{
					method: "POST",
					body: formData,
				}
			);
			if (!res.ok) throw new Error("Failed to generate assessment");
			const data = await res.json();
			setQuestions(data.questions || []);
			setOptions(data.options || []);
			setAnswers(data.answers || []);
		} catch (err) {
			setError(err.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[#101113] py-12 px-4">
			<h1 className="text-3xl font-bold mb-2 text-white">Take Assessment</h1>
			<p className="text-lg text-gray-300 mb-8 text-center max-w-2xl">
				Ready to evaluate your skills? Choose an assessment below to get
				started. Your results will help guide your learning and career planning.
			</p>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
				{ASSESSMENTS.map((assess) => (
					<div
						key={assess.key}
						className="bg-[#18191b] rounded-xl shadow-md border border-green-900 p-6 flex flex-col items-start"
					>
						<h2 className="text-xl font-semibold mb-2 text-green-400">
							{assess.name}
						</h2>
						<p className="text-gray-400 mb-4">{assess.description}</p>
						{assess.key === "technical" ? (
							<>
								<input
									type="file"
									accept="application/pdf"
									onChange={handleFileChange}
									className="mb-2 text-sm text-gray-200"
								/>
								<button
									disabled={!selectedFile || loading}
									onClick={handleStartAssessment}
									className={`mt-auto bg-green-400 text-black px-4 py-2 rounded hover:bg-green-300 transition-colors duration-200 ${
										!selectedFile || loading
											? "opacity-50 cursor-not-allowed"
											: ""
									}`}
								>
									{loading ? "Generating..." : "Start Assessment"}
								</button>
							</>
						) : (
							<button
								className="mt-auto bg-green-400 text-black px-4 py-2 rounded hover:bg-green-300 transition-colors duration-200"
								disabled
							>
								Start Assessment
							</button>
						)}
					</div>
				))}
			</div>
			{error && <div className="mt-8 text-red-400">{error}</div>}
			{questions.length > 0 && (
				<div className="mt-12 w-full max-w-3xl bg-[#18191b] rounded-xl p-6 text-white">
					<h3 className="text-xl font-bold mb-4 text-green-300">
						Technical Assessment Questions
					</h3>
					<ol className="list-decimal list-inside space-y-6">
						{questions.map((q, idx) => (
							<li key={idx}>
								<div className="mb-2 font-semibold">{q}</div>
								<div className="ml-4">
									{options[idx] &&
										Array.isArray(options[idx]) &&
										options[idx].map((opt, oidx) => (
											<div key={oidx} className="mb-1">
												{String.fromCharCode(65 + oidx)}. {opt}
											</div>
										))}
								</div>
								<div className="mt-1 text-green-400 text-sm">
									Answer: {answers[idx]}
								</div>
							</li>
						))}
					</ol>
				</div>
			)}
			<div className="mt-12 text-gray-500 text-sm">
				(Assessment functionality coming soon!)
			</div>
		</div>
	);
}
