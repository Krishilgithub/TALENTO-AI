"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import createClientForBrowser from '@/utils/supabase/client';

export default function TechnicalAttemptPage() {
	const [questions, setQuestions] = useState([]);
	const [options, setOptions] = useState([]);
	const [answers, setAnswers] = useState([]);
	const [userAnswers, setUserAnswers] = useState([]);
	const [submitted, setSubmitted] = useState(false);
	const [score, setScore] = useState(0);
	const router = useRouter();

	useEffect(() => {
		const fetchAssessment = async () => {
			const supabase = createClientForBrowser();
			const { data: userData } = await supabase.auth.getUser();
			if (!userData?.user) {
				router.replace("/assessment/technical");
				return;
			}
			// Fetch the latest technical assessment for this user
			const { data: assessments, error } = await supabase
				.from('assessment_history')
				.select('*')
				.eq('user_id', userData.user.id)
				.eq('type', 'technical')
				.order('created_at', { ascending: false })
				.limit(1);
			if (error || !assessments || assessments.length === 0) {
				router.replace("/assessment/technical");
				return;
			}
			const assessment = assessments[0];
			setQuestions(assessment.questions || []);
			setOptions(assessment.options || []);
			setAnswers(assessment.answers || []);
			setUserAnswers(Array((assessment.questions || []).length).fill(null));
		};
		fetchAssessment();
	}, [router]);

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
				options[idx] &&
				answers[idx] &&
				options[idx][selectedIdx] &&
				options[idx][selectedIdx].toString().trim().toLowerCase() ===
					answers[idx].toString().trim().toLowerCase()
			) {
				correct++;
			}
		});
		setScore(correct);
		setSubmitted(true);
	};

	if (!questions.length) return null;

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[#101113] py-12 px-4">
			<h1 className="text-3xl font-bold mb-8 text-white">
				Technical Assessment
			</h1>
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
							<div className="mb-2 font-semibold">{q}</div>
							<div className="ml-4 flex flex-col gap-2">
								{options[idx] &&
									Array.isArray(options[idx]) &&
									options[idx].map((opt, oidx) => (
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
									Correct Answer: {answers[idx]}
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
		</div>
	);
}
