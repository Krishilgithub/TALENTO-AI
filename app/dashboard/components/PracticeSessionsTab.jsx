"use client";

import { useState } from "react";
import { motion } from "framer-motion";

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
		<div className="space-y-6">
			<div>
				<h2 className="text-xl font-semibold text-white mb-2 font-sans">
					Practice Sessions
				</h2>
				<p className="text-gray-300 font-sans">
					Start a new practice session with AI-powered feedback and analysis.
				</p>
			</div>

			{/* Session Setup */}
			<div className="bg-[#18191b] rounded-lg p-6">
				<h3 className="text-lg font-semibold text-cyan-400 mb-4 font-sans">
					Start New Session
				</h3>

				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-black mb-2 font-sans">
							Session Type
						</label>
						<select
							value={sessionType}
							onChange={(e) => setSessionType(e.target.value)}
							className="w-full px-3 py-2 border border-cyan-900 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-cyan-100 text-black font-sans"
						>
							<option value="behavioral">Behavioral Interview</option>
							<option value="technical">Technical Interview</option>
							<option value="case">Case Study</option>
							<option value="system">System Design</option>
						</select>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label className="block text-sm font-medium text-black mb-2 font-sans">
								Duration
							</label>
							<select className="w-full px-3 py-2 border border-cyan-900 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-cyan-100 text-black font-sans">
								<option>15 minutes</option>
								<option>30 minutes</option>
								<option>45 minutes</option>
								<option>60 minutes</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-black mb-2 font-sans">
								Difficulty
							</label>
							<select className="w-full px-3 py-2 border border-cyan-900 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-cyan-100 text-black font-sans">
								<option>Beginner</option>
								<option>Intermediate</option>
								<option>Advanced</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-black mb-2 font-sans">
								Questions Count
							</label>
							<select className="w-full px-3 py-2 border border-cyan-900 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-cyan-100 text-black font-sans">
								<option>5 questions</option>
								<option>10 questions</option>
								<option>15 questions</option>
								<option>20 questions</option>
							</select>
						</div>
					</div>

					<button
						onClick={startSession}
						disabled={isRecording}
						className="w-full bg-cyan-400 text-black py-3 px-4 rounded-lg font-medium hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-sans"
					>
						{isRecording ? (
							<div className="flex items-center justify-center">
								<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
								Starting Session...
							</div>
						) : (
							"Start Practice Session"
						)}
					</button>
				</div>
			</div>

			{/* Recent Sessions */}
			<div>
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
			</div>
		</div>
	);
} 