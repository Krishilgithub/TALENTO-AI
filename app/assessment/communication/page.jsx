"use client";

import React, { useState } from "react";

export default function CommunicationAssessmentPage() {
	const [jobRole, setJobRole] = useState("Software Engineer");
	const [questions, setQuestions] = useState([]);
	const [userAnswers, setUserAnswers] = useState([]);
	const [submitted, setSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleStart = async () => {
		setLoading(true);
		setError("");
		setQuestions([]);
		setUserAnswers([]);
		setSubmitted(false);
		try {
			const formData = new FormData();
			formData.append("job_role", jobRole);
			const res = await fetch("/api/assessment/communication_test/", {
				method: "POST",
				body: formData,
			});
			if (!res.ok)
				throw new Error("Failed to generate communication questions");
			const data = await res.json();
			let questionsArr = [];
			if (Array.isArray(data)) {
				questionsArr = data;
			} else if (Array.isArray(data.questions)) {
				questionsArr = data.questions;
			}
			if (questionsArr.length > 0) {
				setQuestions(questionsArr);
				setUserAnswers(Array(questionsArr.length).fill(""));
			} else {
				setError(data.error || "No questions generated.");
			}
		} catch (err) {
			setError(err.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (idx, value) => {
		if (submitted) return;
		setUserAnswers((prev) => {
			const updated = [...prev];
			updated[idx] = value;
			return updated;
		});
	};

	const handleSubmit = () => {
		setSubmitted(true);
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[#101113] py-12 px-4">
			<h1 className="text-3xl font-bold mb-2 text-white">
				Communication Skills Test
			</h1>
			<div className="mb-6 w-full max-w-xl">
				<label className="block text-green-400 font-semibold mb-2">
					Job Role
				</label>
				<input
					type="text"
					value={jobRole}
					onChange={(e) => setJobRole(e.target.value)}
					className="w-full px-3 py-2 rounded bg-[#18191b] text-white border border-green-400 mb-4"
				/>
				<button
					onClick={handleStart}
					className="bg-green-400 text-black px-6 py-2 rounded hover:bg-green-300 transition-colors duration-200 w-full font-semibold"
					disabled={loading}
				>
					{loading ? "Generating..." : "Start Test"}
				</button>
				{error && <div className="mt-4 text-red-400">{error}</div>}
			</div>
			{questions.length > 0 && (
				<form
					className="w-full max-w-3xl bg-[#18191b] rounded-xl p-6 text-white"
					onSubmit={(e) => {
						e.preventDefault();
						handleSubmit();
					}}
				>
					<ol className="list-decimal list-inside space-y-8">
						{questions.map((q, idx) => (
							<li key={idx} className="mb-4">
								<div className="mb-2 font-semibold">{q.question}</div>
								<div className="ml-4 flex flex-col gap-2">
									<textarea
										className="w-full px-3 py-2 rounded bg-[#232425] text-white border border-green-400"
										rows={2}
										value={userAnswers[idx]}
										onChange={(e) => handleChange(idx, e.target.value)}
										disabled={submitted}
										placeholder="Type your answer..."
									/>
								</div>
								{submitted && (
									<div className="mt-2 text-green-400 text-sm">
										Skill: {q.skill}
									</div>
								)}
							</li>
						))}
					</ol>
					{!submitted ? (
						<button
							type="submit"
							className="mt-8 bg-green-400 text-black px-8 py-2 rounded hover:bg-green-300 transition-colors duration-200 w-full font-semibold"
							disabled={userAnswers.some((ans) => !ans)}
						>
							Submit Answers
						</button>
					) : (
						<div className="mt-8 text-xl font-bold text-green-300 text-center">
							Test Submitted! Review your answers above.
						</div>
					)}
				</form>
			)}
		</div>
	);
}
