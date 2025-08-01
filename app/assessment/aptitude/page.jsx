"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
	CpuChipIcon,
	CheckCircleIcon,
	XCircleIcon,
} from "@heroicons/react/24/outline";

export default function AptitudeAssessmentPage() {
	const [jobRole, setJobRole] = useState("Software Engineer");
	const [numQuestions, setNumQuestions] = useState(10);
	const [questions, setQuestions] = useState([]);
	const [userAnswers, setUserAnswers] = useState([]);
	const [submitted, setSubmitted] = useState(false);
	const [score, setScore] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [currentQuestion, setCurrentQuestion] = useState(0);

	const handleStart = async () => {
		setLoading(true);
		setError("");
		setQuestions([]);
		setUserAnswers([]);
		setSubmitted(false);
		setScore(0);
		setCurrentQuestion(0);
		try {
			console.log("Starting aptitude assessment...");
			const formData = new FormData();
			formData.append("job_role", jobRole);
			formData.append("num_questions", numQuestions);

			console.log("Making API call to:", "/api/assessment/general_aptitude/");
			const res = await fetch("/api/assessment/general_aptitude/", {
				method: "POST",
				body: formData,
			});

			console.log("Response status:", res.status);
			if (!res.ok) {
				const errorText = await res.text();
				console.error("API Error:", errorText);
				throw new Error(
					`Failed to generate aptitude questions: ${res.status} ${errorText}`
				);
			}

			const data = await res.json();
			console.log("API Response:", data);

			// Handle different response formats
			let questionsArr = [];
			if (data.questions && Array.isArray(data.questions)) {
				// If questions is already an array of objects
				console.log("Using structured questions array:", data.questions);
				questionsArr = validateQuestionStructure(data.questions);
			} else if (data.questions && typeof data.questions === "string") {
				// If questions is a string (AI response), parse it
				console.log(
					"Parsing string response from data.questions:",
					data.questions
				);
				questionsArr = parseQuestionsFromString(data.questions);
			} else if (Array.isArray(data)) {
				// If the entire response is an array
				console.log("Using response as questions array:", data);
				questionsArr = validateQuestionStructure(data);
			} else if (typeof data === "string") {
				// If the entire response is a string
				console.log("Parsing string response:", data);
				questionsArr = parseQuestionsFromString(data);
			} else {
				// Fallback to sample questions
				console.log("Using fallback questions");
				questionsArr = [
					{
						question:
							"If a train travels 120 km in 2 hours, what is its speed in km/h?",
						options: ["40", "60", "80", "100"],
						correct_answer: "60",
						explanation: "Speed = Distance/Time = 120/2 = 60 km/h",
					},
					{
						question: "Which number comes next: 2, 4, 8, 16, __?",
						options: ["24", "32", "30", "28"],
						correct_answer: "32",
						explanation:
							"Each number is multiplied by 2: 2×2=4, 4×2=8, 8×2=16, 16×2=32",
					},
				];
			}

			console.log("Processed questions:", questionsArr);

			if (questionsArr.length > 0) {
				setQuestions(questionsArr);
				setUserAnswers(Array(questionsArr.length).fill(null));
			} else {
				setError(data.error || "No questions generated.");
			}
		} catch (err) {
			console.error("Assessment error:", err);
			setError(err.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	// Function to parse questions from AI-generated string
	const parseQuestionsFromString = (text) => {
		try {
			console.log("Parsing text:", text);
			const questions = [];
			const lines = text.split("\n");
			let currentQuestion = null;
			let questionNumber = 1;

			for (let i = 0; i < lines.length; i++) {
				const line = lines[i].trim();

				// Look for question patterns like "Q1.", "Q2.", etc.
				if (line.match(/^Q\d+\./)) {
					if (currentQuestion) {
						questions.push(currentQuestion);
					}
					// Extract the question text after "Q1." or "Q1. (Category)"
					const questionText = line.replace(/^Q\d+\.\s*(\([^)]+\))?\s*/, "");
					currentQuestion = {
						question: questionText,
						options: [],
						correct_answer: "",
						explanation: "",
					};
				}
				// Look for option patterns like "A)", "B)", etc.
				else if (line.match(/^[A-D]\)/)) {
					if (currentQuestion) {
						const option = line.replace(/^[A-D]\)\s*/, "");
						currentQuestion.options.push(option);
					}
				}
				// Look for correct answer
				else if (line.toLowerCase().includes("correct answer:")) {
					if (currentQuestion) {
						const answer = line.replace(/.*correct answer:\s*/i, "").trim();
						currentQuestion.correct_answer = answer;
					}
				}
				// Look for explanation
				else if (line.toLowerCase().includes("explanation:")) {
					if (currentQuestion) {
						const explanation = line.replace(/.*explanation:\s*/i, "").trim();
						currentQuestion.explanation = explanation;
					}
				}
				// If we have a current question and this line doesn't match any pattern,
				// it might be part of the question text (multi-line questions)
				else if (
					currentQuestion &&
					line &&
					!line.match(/^[A-D]\)/) &&
					!line.toLowerCase().includes("correct answer:") &&
					!line.toLowerCase().includes("explanation:")
				) {
					// Append to the current question if it's not empty
					if (currentQuestion.question && currentQuestion.question !== line) {
						currentQuestion.question += " " + line;
					}
				}
			}

			// Add the last question
			if (currentQuestion) {
				questions.push(currentQuestion);
			}

			console.log("Parsed questions:", questions);

			// If parsing failed, return fallback questions
			if (questions.length === 0) {
				return [
					{
						question:
							"If a train travels 120 km in 2 hours, what is its speed in km/h?",
						options: ["40", "60", "80", "100"],
						correct_answer: "60",
						explanation: "Speed = Distance/Time = 120/2 = 60 km/h",
					},
					{
						question: "Which number comes next: 2, 4, 8, 16, __?",
						options: ["24", "32", "30", "28"],
						correct_answer: "32",
						explanation:
							"Each number is multiplied by 2: 2×2=4, 4×2=8, 8×2=16, 16×2=32",
					},
				];
			}

			return questions;
		} catch (error) {
			console.error("Error parsing questions:", error);
			return [
				{
					question:
						"If a train travels 120 km in 2 hours, what is its speed in km/h?",
					options: ["40", "60", "80", "100"],
					correct_answer: "60",
					explanation: "Speed = Distance/Time = 120/2 = 60 km/h",
				},
			];
		}
	};

	// Function to validate and fix question structure
	const validateQuestionStructure = (questions) => {
		return questions.map((q) => {
			// Ensure all required fields exist
			if (!q.question) {
				q.question = "Sample question";
			}
			if (!q.options || !Array.isArray(q.options)) {
				q.options = ["Option A", "Option B", "Option C", "Option D"];
			}
			if (!q.correct_answer) {
				q.correct_answer = q.options[0] || "Option A";
			}
			if (!q.explanation) {
				q.explanation = "Explanation not provided";
			}
			return q;
		});
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

	const getScoreColor = () => {
		const percentage = (score / questions.length) * 100;
		if (percentage >= 80) return "text-green-400";
		if (percentage >= 60) return "text-yellow-400";
		return "text-red-400";
	};

	const getScoreMessage = () => {
		const percentage = (score / questions.length) * 100;
		if (percentage >= 80) return "Excellent! You have strong aptitude skills.";
		if (percentage >= 60) return "Good! You have solid aptitude skills.";
		return "Keep practicing! Focus on improving your logical reasoning.";
	};

	return (
		<div className="min-h-screen bg-[#101113] py-12 px-4">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-8"
				>
					<div className="flex items-center justify-center mb-4">
						<CpuChipIcon className="h-8 w-8 text-green-400 mr-3" />
						<h1 className="text-3xl font-bold text-white">
							General Aptitude Test
						</h1>
					</div>
					<p className="text-lg text-gray-300 max-w-2xl mx-auto">
						Evaluate your logical, quantitative, and verbal reasoning skills
						with our comprehensive aptitude assessment.
					</p>
				</motion.div>

				{/* Setup Section */}
				{questions.length === 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-[#18191b] rounded-xl shadow-md border border-green-900 p-8 mb-8"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-green-400 font-semibold mb-2">
									Job Role
								</label>
								<input
									type="text"
									value={jobRole}
									onChange={(e) => setJobRole(e.target.value)}
									className="w-full px-3 py-2 rounded bg-[#232425] text-white border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
									placeholder="e.g., Software Engineer"
								/>
							</div>
							<div>
								<label className="block text-green-400 font-semibold mb-2">
									Number of Questions
								</label>
								<input
									type="number"
									min="5"
									max="20"
									value={numQuestions}
									onChange={(e) => setNumQuestions(Number(e.target.value))}
									className="w-full px-3 py-2 rounded bg-[#232425] text-white border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
								/>
							</div>
						</div>
						<button
							onClick={handleStart}
							className="mt-6 bg-green-400 text-black px-8 py-3 rounded-lg hover:bg-green-300 transition-colors duration-200 w-full font-semibold text-lg"
							disabled={loading}
						>
							{loading ? (
								<div className="flex items-center justify-center">
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
									Generating Questions...
								</div>
							) : (
								"Start Aptitude Test"
							)}
						</button>
						{error && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="mt-4 text-red-400 bg-red-900/20 p-3 rounded"
							>
								{error}
							</motion.div>
						)}
					</motion.div>
				)}

				{/* Questions Section */}
				{questions.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-[#18191b] rounded-xl shadow-md border border-green-900 p-8"
					>
						{/* Progress Bar */}
						<div className="mb-6">
							<div className="flex justify-between items-center mb-2">
								<span className="text-green-400 font-semibold">
									Question {currentQuestion + 1} of {questions.length}
								</span>
								<span className="text-gray-400">
									{Math.round(((currentQuestion + 1) / questions.length) * 100)}
									%
								</span>
							</div>
							<div className="w-full bg-gray-700 rounded-full h-2">
								<div
									className="bg-green-400 h-2 rounded-full transition-all duration-300"
									style={{
										width: `${
											((currentQuestion + 1) / questions.length) * 100
										}%`,
									}}
								></div>
							</div>
						</div>

						{/* Question */}
						<div className="mb-8">
							<h3 className="text-xl font-semibold text-white mb-6">
								{questions[currentQuestion]?.question || "Loading question..."}
							</h3>
							<div className="space-y-3">
								{questions[currentQuestion]?.options?.map((option, idx) => (
									<motion.button
										key={idx}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: idx * 0.1 }}
										onClick={() => handleSelect(currentQuestion, idx)}
										className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
											userAnswers[currentQuestion] === idx
												? "border-green-400 bg-green-900/20"
												: "border-gray-600 hover:border-green-400 hover:bg-green-900/10"
										}`}
									>
										<div className="flex items-center">
											<span className="text-green-400 font-semibold mr-3">
												{String.fromCharCode(65 + idx)}.
											</span>
											<span className="text-white">{option}</span>
										</div>
									</motion.button>
								))}
							</div>
						</div>

						{/* Navigation */}
						<div className="flex justify-between">
							<button
								onClick={() =>
									setCurrentQuestion(Math.max(0, currentQuestion - 1))
								}
								disabled={currentQuestion === 0}
								className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Previous
							</button>
							{currentQuestion < questions.length - 1 ? (
								<button
									onClick={() => setCurrentQuestion(currentQuestion + 1)}
									disabled={userAnswers[currentQuestion] === null}
									className="px-6 py-2 bg-green-400 text-black rounded hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Next
								</button>
							) : (
								<button
									onClick={handleSubmit}
									disabled={userAnswers.some((ans) => ans === null)}
									className="px-6 py-2 bg-green-400 text-black rounded hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Submit Test
								</button>
							)}
						</div>
					</motion.div>
				)}

				{/* Results Section */}
				{submitted && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-[#18191b] rounded-xl shadow-md border border-green-900 p-8 mt-8"
					>
						<div className="text-center">
							<h2 className="text-2xl font-bold text-white mb-4">
								Test Results
							</h2>
							<div className={`text-4xl font-bold mb-2 ${getScoreColor()}`}>
								{score} / {questions.length}
							</div>
							<div className="text-lg text-gray-300 mb-6">
								{getScoreMessage()}
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="bg-green-900/20 p-4 rounded">
									<h3 className="text-green-400 font-semibold mb-2">
										Correct Answers
									</h3>
									<div className="text-2xl font-bold text-green-400">
										{score}
									</div>
								</div>
								<div className="bg-red-900/20 p-4 rounded">
									<h3 className="text-red-400 font-semibold mb-2">
										Incorrect Answers
									</h3>
									<div className="text-2xl font-bold text-red-400">
										{questions.length - score}
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</div>
		</div>
	);
}
