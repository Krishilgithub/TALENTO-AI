"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const ASSESSMENTS = [
	{
		key: "aptitude",
		name: "General Aptitude Test",
		description: "Evaluate your logical, quantitative, and verbal reasoning skills.",
		icon: "🧠"
	},
	{
		key: "technical",
		name: "Technical Assessment",
		description: "Test your technical knowledge in programming, engineering, or your chosen field.",
		icon: "💻"
	},
	{
		key: "personality",
		name: "Personality Assessment",
		description: "Discover your strengths, work style, and ideal career environments.",
		icon: "🎭"
	},
	{
		key: "communication",
		name: "Communication Skills Test",
		description: "Assess your written and verbal communication abilities.",
		icon: "💬"
	},
];

export default function AssessmentTab() {
	const [selectedAssessment, setSelectedAssessment] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleAssessmentSelect = (assessment) => {
		setSelectedAssessment(assessment);
		// Here you can add logic to start the assessment
		console.log(`Starting ${assessment.name}`);
	};

	return (
		<div className="w-full">
			<div className="text-center mb-8">
				<h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Take Assessment</h2>
				<p className="text-gray-300 text-lg">
					Ready to evaluate your skills? Choose an assessment below to get started. 
					Your results will help guide your learning and career planning.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
				{ASSESSMENTS.map((assessment, index) => (
					<motion.div
						key={assessment.key}
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
					>
						<div 
							className="bg-gradient-to-br from-cyan-900 to-[#18191b] rounded-xl shadow-lg border border-cyan-700 p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
							onClick={() => handleAssessmentSelect(assessment)}
						>
							<div className="flex items-center mb-4">
								<div className="text-3xl mr-3 text-cyan-300">{assessment.icon}</div>
								<h3 className="text-xl font-semibold text-cyan-300">
									{assessment.name}
								</h3>
							</div>
							<p className="text-cyan-200 mb-4">{assessment.description}</p>
							<button className="bg-cyan-400 border border-cyan-700 text-black px-4 py-2 rounded-lg font-medium hover:scale-105 transition-all duration-200">
								Start Assessment
							</button>
						</div>
					</motion.div>
				))}
			</div>

			{/* Assessment Tips Section */}
			<div className="mt-12 max-w-4xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
					className="bg-[#18191b] rounded-xl p-6 border border-gray-700"
				>
					<h3 className="text-xl font-semibold text-cyan-400 mb-4">Assessment Tips</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<div className="flex items-center text-gray-300">
								<span className="text-cyan-400 mr-2">✓</span>
								Take your time and read questions carefully
							</div>
							<div className="flex items-center text-gray-300">
								<span className="text-cyan-400 mr-2">✓</span>
								Answer honestly - there are no wrong answers
							</div>
							<div className="flex items-center text-gray-300">
								<span className="text-cyan-400 mr-2">✓</span>
								Find a quiet environment to focus
							</div>
						</div>
						<div className="space-y-2">
							<div className="flex items-center text-gray-300">
								<span className="text-cyan-400 mr-2">✓</span>
								Use your results to guide your learning
							</div>
							<div className="flex items-center text-gray-300">
								<span className="text-cyan-400 mr-2">✓</span>
								Retake assessments to track progress
							</div>
							<div className="flex items-center text-gray-300">
								<span className="text-cyan-400 mr-2">✓</span>
								Share results with mentors for guidance
							</div>
						</div>
					</div>
				</motion.div>
			</div>

			{/* Recent Results Section */}
			<div className="mt-8 max-w-4xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
					className="bg-[#18191b] rounded-xl p-6 border border-gray-700"
				>
					<h3 className="text-xl font-semibold text-cyan-400 mb-4">Recent Results</h3>
					<div className="text-center text-gray-400 py-8">
						<p>No assessments completed yet.</p>
						<p className="text-sm mt-2">Complete your first assessment to see your results here!</p>
					</div>
				</motion.div>
			</div>
		</div>
	);
} 