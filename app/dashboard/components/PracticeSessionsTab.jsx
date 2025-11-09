"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const PRACTICE_CATEGORIES = [
	{
		key: "aptitude",
		name: "Aptitude",
		description:
			"Sharpen your logical reasoning, quantitative, and verbal skills with practice questions.",
	},
	{
		key: "coding",
		name: "Coding",
		description:
			"Practice coding problems in various languages and improve your problem-solving skills.",
	},
	{
		key: "communication",
		name: "Communication",
		description:
			"Enhance your written and verbal communication through scenario-based exercises.",
	},
	{
		key: "domain",
		name: "Domain Knowledge",
		description:
			"Test your knowledge in your chosen field or industry with relevant questions.",
	},
];

export default function PracticeSessionsTab() {
	const [isRecording, setIsRecording] = useState(false);
	const [sessionType, setSessionType] = useState("behavioral");

	const startSession = () => {
		setIsRecording(true);
		// Simulate session start
		setTimeout(() => {
			setIsRecording(false);
		}, 5000);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-7xl mx-auto">
					<div className="mb-8">
						<h2 className="text-3xl font-bold text-white mb-4">
							Practice Sessions
						</h2>
						<p className="text-gray-300 font-sans">
							Welcome! Choose a category below to begin practicing and improving your skills. Each session is tailored to help you grow and track your progress.
						</p>
					</div>

					{/* Practice Categories */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{PRACTICE_CATEGORIES.map((cat) => (
							<motion.div
								key={cat.key}
								initial={{ opacity: 0, y: 40 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.3 }}
								transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
								className="bg-gray-800/30 border border-gray-600/50 backdrop-blur-sm rounded-lg p-6 flex flex-col items-start hover:border-cyan-400/50 transition-all duration-200"
							>
								<h3 className="text-xl font-semibold mb-2 text-cyan-400">
									{cat.name}
								</h3>
								<p className="text-gray-400 mb-4">{cat.description}</p>
								<button
									className="mt-auto bg-cyan-400 text-black px-4 py-2 rounded hover:bg-cyan-300 transition-colors duration-200"
									disabled
								>
									Start Practice
								</button>
							</motion.div>
						))}
					</div>

					{/* Coming Soon Notice */}
					{/* <div className="mt-8 text-center">
				<div className="bg-[#232323] rounded-lg p-6 border border-gray-700">
					<p className="text-gray-500 text-sm">
						(Practice session functionality coming soon!)
					</p>
				</div>
			</div> */}

					{/* Recent Sessions */}
					{/* <div>
				<h3 className="text-lg font-semibold text-white mb-4 font-sans">
					Recent Sessions
				</h3>
				<div className="space-y-3">
					{[
						{
							type: "Behavioral",
							date: "Today",
							score: "85%",
							duration: "25 min",
						},
						{
							type: "Technical",
							date: "Yesterday",
							score: "78%",
							duration: "45 min",
						},
						{
							type: "Case Study",
							date: "2 days ago",
							score: "92%",
							duration: "35 min",
						},
					].map((session, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
							className="flex items-center justify-between p-4 bg-[#232323] rounded-lg"
						>
							<div className="flex items-center space-x-4">
								<div className="text-2xl">💬</div>
								<div>
									<p className="font-medium text-white font-sans">
										{session.type} Interview
									</p>
									<p className="text-sm text-gray-400 font-sans">
										{session.date} • {session.duration}
									</p>
								</div>
							</div>
							<div className="text-right">
								<p className="font-semibold text-cyan-400 font-sans">
									{session.score}
								</p>
								<p className="text-sm text-gray-400 font-sans">Score</p>
							</div>
						</motion.div>
					))}
				</div>
			</div> */}
				</div>
			</div>
		</div>
	);
} 