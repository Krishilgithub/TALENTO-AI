"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
	CodeBracketIcon,
	CheckCircleIcon,
	ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import createClientForBrowser from "@/utils/supabase/client";
import Link from "next/link";
import AssessmentLayout from "../../components/AssessmentLayout";
import { AssessmentDataStore } from "@/utils/assessmentDataStore";

export default function TechnicalAssessmentPage() {
	const [jobRole, setJobRole] = useState("Software Engineer");
	const [numQuestions, setNumQuestions] = useState(10);
	const [difficulty, setDifficulty] = useState("moderate");
	const [questions, setQuestions] = useState([]);
	const [userAnswers, setUserAnswers] = useState([]);
	const [submitted, setSubmitted] = useState(false);
	const [score, setScore] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [questionStartTimes, setQuestionStartTimes] = useState([]);
	const router = useRouter();
	const dataStoreRef = useRef(new AssessmentDataStore());

	const handleStart = async () => {
		setLoading(true);
		setError("");
		setQuestions([]);
		setUserAnswers([]);
		setSubmitted(false);
		setScore(0);
		setCurrentQuestion(0);
		setQuestionStartTimes([]);

		// Initialize assessment session
		await dataStoreRef.current.startSession('technical', jobRole, difficulty);

		try {
			console.log("Starting technical assessment...");
			const formData = new FormData();
			formData.append("job_role", jobRole);
			formData.append("num_questions", numQuestions);
			formData.append("difficulty", difficulty);

			console.log(
				"Making API call to:",
				"/api/assessment/technical_assessment/"
			);
			const res = await fetch("/api/assessment/technical_assessment/", {
				method: "POST",
				body: formData,
			});

			console.log("Response status:", res.status);
			if (!res.ok) {
				const errorText = await res.text();
				console.error("API Error:", errorText);
				throw new Error(
					`Failed to generate technical questions: ${res.status} ${errorText}`
				);
			}

			const data = await res.json();
			console.log("API Response:", data);

			// Handle different response formats
			let questionsArr = [];
			if (data.questions && Array.isArray(data.questions)) {
				// If questions is already an array of objects
				questionsArr = data.questions;
			} else if (data.questions && typeof data.questions === "string") {
				// If questions is a string (AI response), parse it
				console.log("Parsing string response:", data.questions);
				questionsArr = parseQuestionsFromString(data.questions);
			} else if (Array.isArray(data)) {
				questionsArr = data;
			} else if (typeof data === "string") {
				// If the entire response is a string
				console.log("Parsing string response:", data);
				questionsArr = parseQuestionsFromString(data);
			} else {
				// Fallback to sample questions
				questionsArr = [
					{
						question: "What is the time complexity of binary search?",
						options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
						correct_answer: "O(log n)",
					},
				];
			}

			console.log("Processed questions:", questionsArr);

			if (questionsArr.length > 0) {
				setQuestions(questionsArr);
				setUserAnswers(Array(questionsArr.length).fill(null));
				setQuestionStartTimes(Array(questionsArr.length).fill(Date.now()));
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
						// Handle formats like "C) 10" or just "C" or just "10"
						let letterMatch = answer.match(/^([A-D])\)/);
						if (letterMatch) {
							// Format: "C) 10"
							const letter = letterMatch[1].toUpperCase();
							const letterToIndex = { A: 0, B: 1, C: 2, D: 3 };
							currentQuestion.correct_answer_index = letterToIndex[letter];
							// Store the full text after the letter
							const fullText = answer.replace(/^[A-D]\)\s*/, "").trim();
							if (
								fullText &&
								currentQuestion.options[currentQuestion.correct_answer_index]
							) {
								currentQuestion.correct_answer =
									currentQuestion.options[currentQuestion.correct_answer_index];
							}
						} else if (answer.length === 1 && answer.match(/[A-D]/i)) {
							// Format: just "C"
							const letterToIndex = { A: 0, B: 1, C: 2, D: 3 };
							currentQuestion.correct_answer_index =
								letterToIndex[answer.toUpperCase()];
							if (
								currentQuestion.options[currentQuestion.correct_answer_index]
							) {
								currentQuestion.correct_answer =
									currentQuestion.options[currentQuestion.correct_answer_index];
							}
						} else {
							// Format: full text answer
							currentQuestion.correct_answer = answer;
							// Find the index of this answer in the options
							const index = currentQuestion.options.findIndex(
								(option) =>
									option.toLowerCase().trim() === answer.toLowerCase().trim()
							);
							if (index !== -1) {
								currentQuestion.correct_answer_index = index;
							}
						}
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
						question: "What is the time complexity of binary search?",
						options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
						correct_answer: "O(log n)",
						correct_answer_index: 1,
						explanation:
							"Binary search divides the search space in half each iteration, resulting in logarithmic time complexity.",
					},
					{
						question: "Which data structure is best for implementing a stack?",
						options: ["Array", "Linked List", "Tree", "Graph"],
						correct_answer: "Array",
						correct_answer_index: 0,
						explanation:
							"Arrays provide O(1) push and pop operations, making them ideal for stack implementation.",
					},
				];
			}

			return questions;
		} catch (error) {
			console.error("Error parsing questions:", error);
			return [
				{
					question: "What is the time complexity of binary search?",
					options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
					correct_answer: "O(log n)",
					explanation:
						"Binary search divides the search space in half each iteration.",
				},
			];
		}
	};

	const handleSelect = (qIdx, oIdx) => {
		if (submitted) return;

		// Update question start time if this is the first interaction with this question
		setQuestionStartTimes(prev => {
			const updated = [...prev];
			if (!updated[qIdx]) {
				updated[qIdx] = Date.now();
			}
			return updated;
		});

		setUserAnswers((prev) => {
			const updated = [...prev];
			updated[qIdx] = oIdx;
			return updated;
		});
	};

	const handleSubmit = async () => {
		let correct = 0;
		const now = Date.now();
		const questionDetails = [];

		// Process each question and record the response
		userAnswers.forEach((selectedIdx, idx) => {
			if (questions[idx]) {
				const question = questions[idx];
				const startTime = questionStartTimes[idx] || now;
				const timeTaken = Math.floor((now - startTime) / 1000); // in seconds

				const isCorrect =
					selectedIdx !== null &&
					// Use correct_answer_index if available (from AI parsing)
					((question.correct_answer_index !== undefined &&
						selectedIdx === question.correct_answer_index) ||
						// Fallback to text comparison (for fallback questions)
						(selectedIdx !== null &&
							question.options[selectedIdx] &&
							question.options[selectedIdx].toString().trim().toLowerCase() ===
							question.correct_answer.toString().trim().toLowerCase()));

				if (isCorrect) {
					correct++;
				}

				// Store question details for results page
				questionDetails.push({
					questionText: question.question,
					questionOptions: question.options,
					userAnswer: selectedIdx !== null ? question.options[selectedIdx] : "No answer",
					correctAnswer: question.correct_answer,
					isCorrect: isCorrect,
					timeTaken: timeTaken
				});

				// Record the response in the enhanced data store
				dataStoreRef.current.recordResponse({
					questionNumber: idx + 1,
					questionText: question.question,
					questionOptions: question.options,
					userAnswer: selectedIdx !== null ? question.options[selectedIdx] : "No answer",
					correctAnswer: question.correct_answer,
					isCorrect: isCorrect,
					timeTaken: timeTaken,
					category: 'technical'
				});
			}
		});

		setScore(correct);
		setSubmitted(true);

		try {
			const supabase = createClientForBrowser();
			const { data: userData } = await supabase.auth.getUser();
			if (userData?.user) {
				// Save using enhanced data store
				const result = await dataStoreRef.current.completeSession(userData.user.id);
				console.log('Technical assessment completed and saved:', result);
			}
		} catch (e) {
			console.error("Failed to store technical result:", e);
		}

		// Prepare results data for the results page
		const resultsData = {
			assessmentType: 'technical',
			jobRole: jobRole,
			score: correct,
			totalQuestions: questions.length,
			totalTime: questionDetails.reduce((total, q) => total + (q.timeTaken || 0), 0) + 's',
			questions: questionDetails
		};

		// Navigate to results page with data
		const resultsParam = encodeURIComponent(JSON.stringify(resultsData));
		router.push(`/assessment/results?data=${resultsParam}`);
	};

	const getScoreColor = () => {
		const percentage = (score / questions.length) * 100;
		if (percentage >= 80) return "text-green-400";
		if (percentage >= 60) return "text-yellow-400";
		return "text-red-400";
	};

	const getScoreMessage = () => {
		const percentage = (score / questions.length) * 100;
		if (percentage >= 80) return "Excellent! You have strong technical skills.";
		if (percentage >= 60) return "Good! You have solid technical knowledge.";
		return "Keep practicing! Focus on improving your technical skills.";
	};

	return (
		<AssessmentLayout>
			<div className="container mx-auto max-w-4xl">
				{/* Back Button */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-6"
				>
					<Link
						href="/dashboard?tab=assessment"
						className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-600/20 px-4 py-2 rounded-lg border border-cyan-400/50 hover:border-cyan-400"
					>
						<ArrowLeftIcon className="w-5 h-5 mr-2" />
						Back to Assessment Tab
					</Link>
				</motion.div>

				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-8"
				>
					<div className="flex items-center justify-center mb-4">
						<CodeBracketIcon className="h-8 w-8 text-cyan-400 mr-3" />
						<h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
							Technical Assessment
						</h1>
					</div>
					<p className="text-lg text-gray-300 max-w-2xl mx-auto">
						Test your technical knowledge in programming, engineering, and your
						chosen field with our comprehensive assessment.
					</p>
				</motion.div>

				{/* Setup Section */}
				{questions.length === 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-gray-800/30 border border-gray-600/50 backdrop-blur-sm rounded-lg p-8 mb-8"
					>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div>
								<label className="block text-white font-semibold mb-2">
									Job Role
								</label>
								<input
									type="text"
									value={jobRole}
									onChange={(e) => setJobRole(e.target.value)}
									className="w-full px-3 py-2 rounded bg-gray-800/50 text-white border border-gray-600/50 focus:outline-none focus:border-cyan-400 transition-colors"
									placeholder="e.g., Software Engineer"
								/>
							</div>
							<div>
								<label className="block text-white font-semibold mb-2">
									Number of Questions
								</label>
								<input
									type="number"
									min="5"
									max="20"
									value={numQuestions}
									onChange={(e) => setNumQuestions(Number(e.target.value))}
									className="w-full px-3 py-2 rounded bg-gray-800/50 text-white border border-gray-600/50 focus:outline-none focus:border-cyan-400 transition-colors"
								/>
							</div>
							<div>
								<label className="block text-white font-semibold mb-2">
									Difficulty Level
								</label>
								<select
									value={difficulty}
									onChange={(e) => setDifficulty(e.target.value)}
									className="w-full px-3 py-2 rounded bg-gray-800/50 text-white border border-gray-600/50 focus:outline-none focus:border-cyan-400 transition-colors"
								>
									<option value="easy">Easy</option>
									<option value="moderate">Moderate</option>
									<option value="hard">Hard</option>
								</select>
							</div>
						</div>
						<button
							onClick={handleStart}
							className="mt-6 bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-lg transition-colors duration-200 w-full font-semibold text-lg disabled:opacity-50"
							disabled={loading}
						>
							{loading ? (
								<div className="flex items-center justify-center">
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
									Generating Questions...
								</div>
							) : (
								"Start Technical Assessment"
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
						className="bg-gray-800/30 border border-gray-600/50 backdrop-blur-sm rounded-lg p-8"
					>
						{/* Progress Bar */}
						<div className="mb-6">
							<div className="flex justify-between items-center mb-2">
								<span className="text-cyan-400 font-semibold">
									Question {currentQuestion + 1} of {questions.length}
								</span>
								<span className="text-gray-400">
									{Math.round(((currentQuestion + 1) / questions.length) * 100)}
									%
								</span>
							</div>
							<div className="w-full bg-gray-700 rounded-full h-2">
								<div
									className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300"
									style={{
										width: `${((currentQuestion + 1) / questions.length) * 100
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
										className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${userAnswers[currentQuestion] === idx
											? "border-cyan-400 bg-cyan-900/20"
											: "border-gray-600 hover:border-cyan-400 hover:bg-cyan-900/10"
											}`}
									>
										<div className="flex items-center">
											<span className="text-cyan-400 font-semibold mr-3">
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
									className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
								>
									Next
								</button>
							) : (
								<button
									onClick={handleSubmit}
									disabled={userAnswers.some((ans) => ans === null)}
									className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
								>
									Submit Test
								</button>
							)}
						</div>
					</motion.div>
				)}


			</div>
		</AssessmentLayout>
	);
}
