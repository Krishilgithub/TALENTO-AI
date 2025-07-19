"use client";

import React, { useState } from "react";

export default function AptitudeAssessmentPage() {
	const [jobRole, setJobRole] = useState("Software Engineer");
	const [questions, setQuestions] = useState([]);
	const [userAnswers, setUserAnswers] = useState([]);
	const [submitted, setSubmitted] = useState(false);
	const [score, setScore] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleStart = async () => {
		setLoading(true);
		setError("");
		setQuestions([]);
		setUserAnswers([]);
		setSubmitted(false);
		setScore(0);
		try {
			const formData = new FormData();
			formData.append("job_role", jobRole);
			const res = await fetch("/api/assessment/general_aptitude/", {
				method: "POST",
				body: formData,
			});
			if (!res.ok) throw new Error("Failed to generate aptitude questions");
			const data = await res.json();
			let questionsArr = [];
			if (Array.isArray(data)) {
				questionsArr = data;
			} else if (Array.isArray(data.questions)) {
				questionsArr = data.questions;
			}
			if (questionsArr.length > 0) {
				setQuestions(questionsArr);
				setUserAnswers(Array(questionsArr.length).fill(null));
			} else {
				setError(data.error || "No questions generated.");
			}
		} catch (err) {
			setError(err.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	const handleSelect = (qIdx, oIdx) => {
		if (submitted) return;
		setUserAnswers((prev) => {
			const updated = [...prev];
			updated[qIdx] = oIdx;
			return updated;
		});
	};

	const handleSubmit = () => {
		let correct = 0;
		userAnswers.forEach((selectedIdx, idx) => {
			if (
				selectedIdx !== null &&
				questions[idx] &&
				questions[idx].options &&
				questions[idx].correct_answer &&
				questions[idx].options[selectedIdx].toString().trim().toLowerCase() ===
					questions[idx].correct_answer.toString().trim().toLowerCase()
			) {
				correct++;
			}
		});
		setScore(correct);
		setSubmitted(true);
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[#101113] py-12 px-4">
			<h1 className="text-3xl font-bold mb-2 text-white">
				General Aptitude Test
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
									{q.options &&
										q.options.map((opt, oidx) => (
											<label
												key={oidx}
												className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded transition-colors duration-150 ${
													userAnswers[idx] === oidx
														? "bg-green-900/40 border border-green-400"
														: "hover:bg-green-900/20"
												}`}
											>
												<input
													type="radio"
													name={`q${idx}`}
													value={oidx}
													checked={userAnswers[idx] === oidx}
													onChange={() => handleSelect(idx, oidx)}
													disabled={submitted}
													className="accent-green-400"
												/>
												<span>
													{String.fromCharCode(65 + oidx)}. {opt}
												</span>
											</label>
										))}
								</div>
								{submitted && (
									<div className="mt-2 text-green-400 text-sm">
										Correct Answer: {q.correct_answer}
									</div>
								)}
							</li>
						))}
					</ol>
					{!submitted ? (
						<button
							type="submit"
							className="mt-8 bg-green-400 text-black px-8 py-2 rounded hover:bg-green-300 transition-colors duration-200 w-full font-semibold"
							disabled={userAnswers.some((ans) => ans === null)}
						>
							Submit Answers
						</button>
					) : (
						<div className="mt-8 text-xl font-bold text-green-300 text-center">
							Your Score: {score} / {questions.length}
						</div>
					)}
				</form>
			)}
		</div>
	);
}
