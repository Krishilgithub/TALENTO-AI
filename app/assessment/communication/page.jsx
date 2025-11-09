"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
	ChatBubbleLeftRightIcon,
	CheckCircleIcon,
	ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import createClientForBrowser from "@/utils/supabase/client";
import AssessmentLayout from "../../components/AssessmentLayout";
import { AssessmentDataStore } from "@/utils/assessmentDataStore";

export default function CommunicationAssessmentPage() {
	const router = useRouter();
	const [numQuestions, setNumQuestions] = useState(10);
	const [difficulty, setDifficulty] = useState("moderate");
	const [questions, setQuestions] = useState([]);
	const [userAnswers, setUserAnswers] = useState([]);
	const [submitted, setSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [questionStartTimes, setQuestionStartTimes] = useState([]);
	const dataStoreRef = useRef(new AssessmentDataStore());

	const handleStart = async () => {
		setLoading(true);
		setError("");
		setQuestions([]);
		setUserAnswers([]);
		setSubmitted(false);
		setCurrentQuestion(0);
		setQuestionStartTimes([]);
		
		// Initialize assessment session
		await dataStoreRef.current.startSession('communication', null, difficulty);
		try {
			console.log("Starting communication assessment...");
			const formData = new FormData();
			formData.append("num_questions", numQuestions);
			formData.append("difficulty", difficulty);

			console.log("Making API call to:", "/api/assessment/communication_test/");
			const res = await fetch("/api/assessment/communication_test/", {
				method: "POST",
				body: formData,
			});

			console.log("Response status:", res.status);
			if (!res.ok) {
				const errorText = await res.text();
				console.error("API Error:", errorText);
				throw new Error(
					`Failed to generate communication questions: ${res.status} ${errorText}`
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
						question:
							"Describe a situation where you had to communicate a complex technical concept to a non-technical audience.",
						skill: "Technical Communication",
					},
				];
			}

			console.log("Processed questions:", questionsArr);

			if (questionsArr.length > 0) {
				setQuestions(questionsArr);
				setUserAnswers(Array(questionsArr.length).fill(""));
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

	// Function to parse communication questions from AI-generated string
	const parseQuestionsFromString = (text) => {
		try {
			console.log("Parsing communication text:", text);
			const questions = [];
			const lines = text.split("\n");
			let currentQuestion = null;

			for (let i = 0; i < lines.length; i++) {
				const line = lines[i].trim();

				// Look for scenario patterns like "Scenario 1:", "Scenario 2:", etc.
				if (line.match(/^Scenario \d+:/)) {
					if (currentQuestion) {
						questions.push(currentQuestion);
					}
					currentQuestion = {
						question: line.replace(/^Scenario \d+:\s*/, ""),
						skill: "",
						explanation: "",
					};
				}
				// Look for skill patterns
				else if (line.toLowerCase().includes("skill:")) {
					if (currentQuestion) {
						const skill = line.replace(/.*skill:\s*/i, "").trim();
						currentQuestion.skill = skill;
					}
				}
				// Look for question patterns
				else if (line.toLowerCase().includes("question:")) {
					if (currentQuestion) {
						const question = line.replace(/.*question:\s*/i, "").trim();
						currentQuestion.question = question;
					}
				}
			}

			// Add the last question
			if (currentQuestion) {
				questions.push(currentQuestion);
			}

			console.log("Parsed communication questions:", questions);

			// If parsing failed, return fallback questions
			if (questions.length === 0) {
				return [
					{
						question:
							"You need to explain a complex technical concept to a non-technical client. How would you approach this communication?",
						skill: "Technical Communication",
					},
					{
						question:
							"A team member disagrees with your approach to a project. How would you handle this conflict professionally?",
						skill: "Conflict Resolution",
					},
				];
			}

			return questions;
		} catch (error) {
			console.error("Error parsing communication questions:", error);
			return [
				{
					question:
						"You need to explain a complex technical concept to a non-technical client. How would you approach this communication?",
					skill: "Technical Communication",
				},
			];
		}
	};

	const handleChange = (idx, value) => {
		if (submitted) return;
		
		// Update question start time if this is the first interaction with this question
		setQuestionStartTimes(prev => {
			const updated = [...prev];
			if (!updated[idx]) {
				updated[idx] = Date.now();
			}
			return updated;
		});
		
		setUserAnswers((prev) => {
			const updated = [...prev];
			updated[idx] = value;
			return updated;
		});
	};

	const handleSubmit = async () => {
		setSubmitted(true);
		const now = Date.now();
		const questionDetails = [];

		// Process each question and record the response
		userAnswers.forEach((userAnswer, idx) => {
			if (questions[idx]) {
				const question = questions[idx];
				const startTime = questionStartTimes[idx] || now;
				const timeTaken = Math.floor((now - startTime) / 1000); // in seconds
				
				// Store question details for results page
				questionDetails.push({
					questionText: question.question,
					questionOptions: [],
					userAnswer: userAnswer || "No response",
					correctAnswer: "N/A", // No correct answer for open-ended questions
					isCorrect: true, // All responses considered correct for completion
					timeTaken: timeTaken
				});
				
				// Record the response in the enhanced data store
				dataStoreRef.current.recordResponse({
					questionNumber: idx + 1,
					questionText: question.question,
					questionOptions: [],
					userAnswer: userAnswer || "No response",
					correctAnswer: "N/A", // No correct answer for open-ended questions
					isCorrect: true, // All responses considered correct for completion
					timeTaken: timeTaken,
					category: 'communication'
				});
			}
		});

		try {
			const supabase = createClientForBrowser();
			const { data: userData } = await supabase.auth.getUser();
			if (userData?.user) {
				// Save using enhanced data store
				const result = await dataStoreRef.current.completeSession(userData.user.id);
				console.log('Communication assessment completed and saved:', result);
			}
		} catch (e) {
			console.error("Failed to store communication result:", e);
		}

		// Prepare results data for the results page
		const resultsData = {
			assessmentType: 'communication',
			jobRole: 'General', // Communication doesn't have job role selection
			score: questionDetails.length, // All responses count as correct
			totalQuestions: questions.length,
			totalTime: questionDetails.reduce((total, q) => total + (q.timeTaken || 0), 0) + 's',
			questions: questionDetails
		};

		// Navigate to results page with data
		const resultsParam = encodeURIComponent(JSON.stringify(resultsData));
		router.push(`/assessment/results?data=${resultsParam}`);
	};

	return (
		<AssessmentLayout>
			<div className="container mx-auto max-w-4xl">
				{/* Back Button */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
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
						<ChatBubbleLeftRightIcon className="h-8 w-8 text-cyan-400 mr-3" />
						<h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
							Communication Skills Test
						</h1>
					</div>
					<p className="text-lg text-gray-300 max-w-2xl mx-auto">
						Assess your written and verbal communication abilities with
						real-world scenarios and practical exercises.
					</p>
				</motion.div>

				{/* Setup Section */}
				{questions.length === 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-gray-800/30 border border-gray-600/50 backdrop-blur-sm rounded-lg p-8 mb-8"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-white font-semibold mb-2">
									Number of Questions
								</label>
								<input
									type="number"
									min="5"
									max="15"
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
								"Start Communication Test"
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
							<div className="mb-4">
								<span className="inline-block bg-cyan-900/30 text-cyan-400 px-3 py-1 rounded-full text-sm font-medium">
									{questions[currentQuestion]?.skill || "Communication Skill"}
								</span>
							</div>
							<h3 className="text-xl font-semibold text-white mb-6">
								{questions[currentQuestion]?.question || "Loading question..."}
							</h3>
							<div className="space-y-4">
								<textarea
									className="w-full px-4 py-3 rounded-lg bg-gray-800/50 text-white border border-gray-600/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 resize-none transition-colors"
									rows={6}
									value={userAnswers[currentQuestion]}
									onChange={(e) =>
										handleChange(currentQuestion, e.target.value)
									}
									disabled={submitted}
									placeholder="Type your response here..."
								/>
								<div className="text-sm text-gray-400">
									{userAnswers[currentQuestion]?.length || 0} characters
								</div>
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
									disabled={!userAnswers[currentQuestion]?.trim()}
									className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
								>
									Next
								</button>
							) : (
								<button
									onClick={handleSubmit}
									disabled={userAnswers.some((ans) => !ans?.trim())}
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
