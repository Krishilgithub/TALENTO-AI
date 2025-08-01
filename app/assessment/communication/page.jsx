"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
	ChatBubbleLeftRightIcon,
	CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function CommunicationAssessmentPage() {
	const [jobRole, setJobRole] = useState("Software Engineer");
	const [numQuestions, setNumQuestions] = useState(10);
	const [questions, setQuestions] = useState([]);
	const [userAnswers, setUserAnswers] = useState([]);
	const [submitted, setSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [currentQuestion, setCurrentQuestion] = useState(0);

	const handleStart = async () => {
		setLoading(true);
		setError("");
		setQuestions([]);
		setUserAnswers([]);
		setSubmitted(false);
		setCurrentQuestion(0);
		try {
			console.log("Starting communication assessment...");
			const formData = new FormData();
			formData.append("job_role", jobRole);
			formData.append("num_questions", numQuestions);

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
		<div className="min-h-screen bg-[#101113] py-12 px-4">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-8"
				>
					<div className="flex items-center justify-center mb-4">
						<ChatBubbleLeftRightIcon className="h-8 w-8 text-green-400 mr-3" />
						<h1 className="text-3xl font-bold text-white">
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
									max="15"
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
							<div className="mb-4">
								<span className="inline-block bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
									{questions[currentQuestion]?.skill || "Communication Skill"}
								</span>
							</div>
							<h3 className="text-xl font-semibold text-white mb-6">
								{questions[currentQuestion]?.question || "Loading question..."}
							</h3>
							<div className="space-y-4">
								<textarea
									className="w-full px-4 py-3 rounded-lg bg-[#232425] text-white border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
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
									className="px-6 py-2 bg-green-400 text-black rounded hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Next
								</button>
							) : (
								<button
									onClick={handleSubmit}
									disabled={userAnswers.some((ans) => !ans?.trim())}
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
								Test Completed!
							</h2>
							<div className="text-lg text-gray-300 mb-6">
								Great job! You've completed the communication skills assessment.
								Review your responses below.
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
								<div className="bg-green-900/20 p-4 rounded">
									<h3 className="text-green-400 font-semibold mb-2">
										Questions Answered
									</h3>
									<div className="text-2xl font-bold text-green-400">
										{questions.length}
									</div>
								</div>
								<div className="bg-blue-900/20 p-4 rounded">
									<h3 className="text-blue-400 font-semibold mb-2">
										Total Responses
									</h3>
									<div className="text-2xl font-bold text-blue-400">
										{userAnswers.filter((ans) => ans?.trim()).length}
									</div>
								</div>
							</div>
						</div>

						{/* Review Answers */}
						<div className="mt-8">
							<h3 className="text-xl font-semibold text-white mb-4">
								Your Responses
							</h3>
							<div className="space-y-6">
								{questions.map((q, idx) => (
									<motion.div
										key={idx}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: idx * 0.1 }}
										className="bg-[#232425] rounded-lg p-4"
									>
										<div className="flex items-center mb-2">
											<span className="inline-block bg-green-900/30 text-green-400 px-2 py-1 rounded text-xs font-medium mr-3">
												{q.skill || "Communication"}
											</span>
											<span className="text-gray-400 text-sm">
												Question {idx + 1}
											</span>
										</div>
										<h4 className="text-white font-medium mb-3">
											{q.question}
										</h4>
										<div className="bg-[#1a1b1c] rounded p-3">
											<p className="text-gray-300 text-sm">
												{userAnswers[idx] || "No response provided"}
											</p>
										</div>
									</motion.div>
								))}
							</div>
						</div>
					</motion.div>
				)}
			</div>
		</div>
	);
}
