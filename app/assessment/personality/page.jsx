"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
	UserIcon,
	SparklesIcon,
	CheckCircleIcon,
	ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function PersonalityAssessmentPage() {
	const router = useRouter();
	const [jobRole, setJobRole] = useState("Software Engineer");
	const [assessmentFocus, setAssessmentFocus] = useState("Work Style");
	const [numQuestions, setNumQuestions] = useState(10);
	const [questions, setQuestions] = useState([]);
	const [userAnswers, setUserAnswers] = useState([]);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [personalityTraits, setPersonalityTraits] = useState({});

	const assessmentFocuses = [
		"Work Style",
		"Leadership Style",
		"Communication Style",
	];

	const handleStart = async () => {
		setLoading(true);
		setError("");
		setQuestions([]);
		setUserAnswers([]);
		setSubmitted(false);
		setCurrentQuestion(0);
		setPersonalityTraits({});

		try {
			console.log("Starting personality assessment...");
			const formData = new FormData();
			formData.append("job_role", jobRole);
			formData.append("assessment_focus", assessmentFocus);
			formData.append("num_questions", numQuestions);

			console.log("Making API call to:", "/api/assessment/personality_assessment/");
			const res = await fetch("/api/assessment/personality_assessment/", {
				method: "POST",
				body: formData,
			});

			console.log("Response status:", res.status);
			if (!res.ok) {
				const errorText = await res.text();
				console.error("API Error:", errorText);
				throw new Error(
					`Failed to generate personality assessment: ${res.status} ${errorText}`
				);
			}

			const data = await res.json();
			console.log("API Response:", data);

			// Handle different response formats
			let questionsArr = [];
			if (data.questions && typeof data.questions === "string") {
				// If questions is a string (AI response), parse it
				console.log("Parsing string response:", data.questions);
				questionsArr = parseQuestionsFromString(data.questions);
			} else if (data.questions && Array.isArray(data.questions)) {
				// If questions is already an array of objects
				console.log("Using structured questions array:", data.questions);
				questionsArr = validateQuestionStructure(data.questions);
			} else if (Array.isArray(data)) {
				// If the entire response is an array
				console.log("Using response as questions array:", data);
				questionsArr = validateQuestionStructure(data);
			} else {
				// Fallback to sample questions
				console.log("Using fallback questions");
				questionsArr = [
					{
						question: "When working on a project, I prefer to:",
						options: [
							"Plan everything in detail before starting",
							"Start immediately and figure things out as I go",
							"Collaborate with others to brainstorm ideas",
							"Research best practices and follow established methods",
						],
						correct_answer: "",
						explanation: "",
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
						question: "When working on a project, I prefer to:",
						options: [
							"Plan everything in detail before starting",
							"Start immediately and figure things out as I go",
							"Collaborate with others to brainstorm ideas",
							"Research best practices and follow established methods",
						],
						correct_answer: "",
						explanation: "",
					},
				];
			}

			return questions;
		} catch (error) {
			console.error("Error parsing questions:", error);
			return [
				{
					question: "When working on a project, I prefer to:",
					options: [
						"Plan everything in detail before starting",
						"Start immediately and figure things out as I go",
						"Collaborate with others to brainstorm ideas",
						"Research best practices and follow established methods",
					],
					correct_answer: "",
					explanation: "",
				},
			];
		}
	};

	// Function to validate and fix question structure
	const validateQuestionStructure = (questions) => {
		return questions.map((q) => {
			// Ensure all required fields exist
			if (!q.question) {
				q.question = "Sample personality question";
			}
			if (!q.options || !Array.isArray(q.options)) {
				q.options = ["Option A", "Option B", "Option C", "Option D"];
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
		// Calculate personality traits based on answers
		const traits = calculatePersonalityTraits();
		setPersonalityTraits(traits);
		setSubmitted(true);
	};

	const calculatePersonalityTraits = () => {
		// Simple personality trait calculation based on answer patterns
		const traits = {
			"Work Style": {
				"Structured": 0,
				"Adaptive": 0,
				"Collaborative": 0,
				"Analytical": 0,
			},
			"Leadership": {
				"Directive": 0,
				"Supportive": 0,
				"Democratic": 0,
				"Inspirational": 0,
			},
			"Communication": {
				"Direct": 0,
				"Relational": 0,
				"Interactive": 0,
				"Creative": 0,
			},
		};

		userAnswers.forEach((answer, index) => {
			if (answer !== null && questions[index]) {
				// Simple scoring based on answer choice
				const answerWeight = answer + 1; // A=1, B=2, C=3, D=4
				
				if (assessmentFocus === "Work Style") {
					if (answerWeight === 1) traits["Work Style"]["Structured"] += 1;
					else if (answerWeight === 2) traits["Work Style"]["Adaptive"] += 1;
					else if (answerWeight === 3) traits["Work Style"]["Collaborative"] += 1;
					else if (answerWeight === 4) traits["Work Style"]["Analytical"] += 1;
				} else if (assessmentFocus === "Leadership Style") {
					if (answerWeight === 1) traits["Leadership"]["Directive"] += 1;
					else if (answerWeight === 2) traits["Leadership"]["Supportive"] += 1;
					else if (answerWeight === 3) traits["Leadership"]["Democratic"] += 1;
					else if (answerWeight === 4) traits["Leadership"]["Inspirational"] += 1;
				} else if (assessmentFocus === "Communication Style") {
					if (answerWeight === 1) traits["Communication"]["Direct"] += 1;
					else if (answerWeight === 2) traits["Communication"]["Relational"] += 1;
					else if (answerWeight === 3) traits["Communication"]["Interactive"] += 1;
					else if (answerWeight === 4) traits["Communication"]["Creative"] += 1;
				}
			}
		});

		return traits;
	};

	const getTraitDescription = (trait, score) => {
		const descriptions = {
			"Structured": "You prefer organized, planned approaches to work with clear processes and guidelines.",
			"Adaptive": "You thrive in flexible environments and can quickly adapt to changing circumstances.",
			"Collaborative": "You work best in team settings and value cooperation and shared decision-making.",
			"Analytical": "You approach problems systematically and rely on data and logical analysis.",
			"Directive": "You prefer to take charge and provide clear direction to achieve goals.",
			"Supportive": "You focus on building relationships and supporting others' growth and development.",
			"Democratic": "You encourage participation and seek consensus in decision-making.",
			"Inspirational": "You motivate others through vision and creative thinking.",
			"Direct": "You communicate clearly and concisely, focusing on facts and outcomes.",
			"Relational": "You build connections through personal stories and relationship-building.",
			"Interactive": "You engage others through discussion and collaborative dialogue.",
			"Creative": "You use innovative approaches and creative methods to communicate ideas.",
		};

		return descriptions[trait] || "This trait reflects your approach to work and collaboration.";
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
						<UserIcon className="h-8 w-8 text-purple-400 mr-3" />
						<h1 className="text-3xl font-bold text-white">
							Personality Assessment
						</h1>
					</div>
					<p className="text-lg text-gray-300 max-w-2xl mx-auto">
						Discover your work style, leadership approach, and communication preferences
						through our comprehensive personality assessment.
					</p>
				</motion.div>

				{/* Configuration Section */}
				{!questions.length && !loading && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-[#1a1b1c] rounded-lg p-6 mb-8"
					>
						<h2 className="text-xl font-semibold text-white mb-4">
							Assessment Configuration
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Job Role
								</label>
								<input
									type="text"
									value={jobRole}
									onChange={(e) => setJobRole(e.target.value)}
									placeholder="e.g., Software Engineer"
									className="w-full px-3 py-2 bg-[#2a2b2c] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Assessment Focus
								</label>
								<select
									value={assessmentFocus}
									onChange={(e) => setAssessmentFocus(e.target.value)}
									className="w-full px-3 py-2 bg-[#2a2b2c] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
								>
									{assessmentFocuses.map((focus) => (
										<option key={focus} value={focus}>
											{focus}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Number of Questions
								</label>
								<input
									type="number"
									value={numQuestions}
									onChange={(e) => setNumQuestions(parseInt(e.target.value))}
									min="5"
									max="20"
									className="w-full px-3 py-2 bg-[#2a2b2c] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
								/>
							</div>
						</div>
						<button
							onClick={handleStart}
							disabled={loading}
							className="mt-6 w-full md:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-medium rounded-lg flex items-center justify-center space-x-2 transition-colors"
						>
							{loading ? (
								<>
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
									<span>Generating Assessment...</span>
								</>
							) : (
								<>
									<SparklesIcon className="h-5 w-5" />
									<span>Start Assessment</span>
								</>
							)}
						</button>
					</motion.div>
				)}

				{/* Error Display */}
				{error && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6"
					>
						<p className="text-red-400">{error}</p>
					</motion.div>
				)}

				{/* Assessment Questions */}
				{questions.length > 0 && !submitted && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-[#1a1b1c] rounded-lg p-6"
					>
						{/* Progress Bar */}
						<div className="mb-6">
							<div className="flex justify-between items-center mb-2">
								<span className="text-sm text-gray-400">
									Question {currentQuestion + 1} of {questions.length}
								</span>
								<span className="text-gray-400">
									{Math.round(((currentQuestion + 1) / questions.length) * 100)}%
								</span>
							</div>
							<div className="w-full bg-gray-700 rounded-full h-2">
								<div
									className="bg-purple-400 h-2 rounded-full transition-all duration-300"
									style={{
										width: `${
											((currentQuestion + 1) / questions.length) * 100
										}%`,
									}}
								></div>
							</div>
						</div>

						{/* Current Question */}
						<div className="mb-6">
							<h3 className="text-lg font-semibold text-white mb-4">
								{questions[currentQuestion]?.question}
							</h3>
							<div className="space-y-3">
								{questions[currentQuestion]?.options.map((option, idx) => (
									<button
										key={idx}
										onClick={() => handleSelect(currentQuestion, idx)}
										className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
											userAnswers[currentQuestion] === idx
												? "bg-purple-600 border-purple-400 text-white"
												: "bg-[#2a2b2c] border-gray-600 text-gray-300 hover:bg-[#3a3b3c] hover:border-purple-500"
										}`}
									>
										<span className="font-medium mr-2">
											{String.fromCharCode(65 + idx)})
										</span>
										{option}
									</button>
								))}
							</div>
						</div>

						{/* Navigation Buttons */}
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
									onClick={() =>
										setCurrentQuestion(
											Math.min(questions.length - 1, currentQuestion + 1)
										)
									}
									disabled={userAnswers[currentQuestion] === null}
									className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Next
								</button>
							) : (
								<button
									onClick={handleSubmit}
									disabled={userAnswers.some((ans) => ans === null)}
									className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Submit Assessment
								</button>
							)}
						</div>
					</motion.div>
				)}

				{/* Results */}
				{submitted && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-[#1a1b1c] rounded-lg p-6"
					>
						<div className="text-center mb-6">
							<CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-4" />
							<h2 className="text-2xl font-bold text-white mb-2">
								Assessment Complete!
							</h2>
							<p className="text-gray-400">
								Here's your personality profile based on your responses.
							</p>
						</div>

						{/* Personality Traits */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{Object.entries(personalityTraits[assessmentFocus] || {}).map(
								([trait, score]) => (
									<div
										key={trait}
										className="bg-[#2a2b2c] rounded-lg p-4 border border-gray-600"
									>
										<div className="flex justify-between items-center mb-2">
											<h3 className="text-lg font-semibold text-white">
												{trait}
											</h3>
											<span className="text-purple-400 font-bold">
												{score}/{questions.length}
											</span>
										</div>
										<div className="w-full bg-gray-700 rounded-full h-2 mb-3">
											<div
												className="bg-purple-400 h-2 rounded-full transition-all duration-300"
												style={{
													width: `${(score / questions.length) * 100}%`,
												}}
											></div>
										</div>
										<p className="text-sm text-gray-300">
											{getTraitDescription(trait, score)}
										</p>
									</div>
								)
							)}
						</div>

						{/* Action Buttons */}
						<div className="flex justify-center space-x-4 mt-8">
							<button
								onClick={() => {
									setQuestions([]);
									setUserAnswers([]);
									setSubmitted(false);
									setCurrentQuestion(0);
									setPersonalityTraits({});
								}}
								className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
							>
								Take Assessment Again
							</button>
							<button
								onClick={() => router.push("/assessment")}
								className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
							>
								<ArrowLeftIcon className="h-4 w-4" />
								<span>Back to Assessments</span>
							</button>
						</div>
					</motion.div>
				)}
			</div>
		</div>
	);
} 