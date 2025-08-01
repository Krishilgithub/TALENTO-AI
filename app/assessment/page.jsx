"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
	CpuChipIcon,
	CodeBracketIcon,
	ChatBubbleLeftRightIcon,
	UserGroupIcon,
	ArrowRightIcon,
} from "@heroicons/react/24/outline";

const ASSESSMENTS = [
	{
		key: "aptitude",
		name: "General Aptitude Test",
		description:
			"Evaluate your logical, quantitative, and verbal reasoning skills with comprehensive aptitude questions.",
		icon: CpuChipIcon,
		color: "from-green-500 to-emerald-500",
		bgColor: "bg-green-900/20",
		borderColor: "border-green-500/30",
		textColor: "text-green-400",
	},
	{
		key: "technical",
		name: "Technical Assessment",
		description:
			"Test your technical knowledge in programming, engineering, and your chosen field with domain-specific questions.",
		icon: CodeBracketIcon,
		color: "from-blue-500 to-cyan-500",
		bgColor: "bg-blue-900/20",
		borderColor: "border-blue-500/30",
		textColor: "text-blue-400",
	},
	{
		key: "communication",
		name: "Communication Skills Test",
		description:
			"Assess your written and verbal communication abilities with real-world scenarios and practical exercises.",
		icon: ChatBubbleLeftRightIcon,
		color: "from-purple-500 to-pink-500",
		bgColor: "bg-purple-900/20",
		borderColor: "border-purple-500/30",
		textColor: "text-purple-400",
	},
	{
		key: "personality",
		name: "Personality Assessment",
		description:
			"Discover your strengths, work style, and ideal career environments through comprehensive personality analysis.",
		icon: UserGroupIcon,
		color: "from-orange-500 to-red-500",
		bgColor: "bg-orange-900/20",
		borderColor: "border-orange-500/30",
		textColor: "text-orange-400",
	},
];

export default function AssessmentPage() {
	const router = useRouter();

	return (
		<div className="min-h-screen bg-[#101113] py-12 px-4">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-12"
				>
					<h1 className="text-4xl font-bold mb-4 text-white">
						Take Assessment
					</h1>
					<p className="text-xl text-gray-300 max-w-3xl mx-auto">
						Ready to evaluate your skills? Choose an assessment below to get
						started. Your results will help guide your learning and career
						planning.
					</p>
				</motion.div>

				{/* Assessment Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{ASSESSMENTS.map((assessment, index) => (
						<motion.div
							key={assessment.key}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							className={`${assessment.bgColor} ${assessment.borderColor} border rounded-xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer group`}
							onClick={() => router.push(`/assessment/${assessment.key}`)}
						>
							<div className="flex items-start justify-between mb-4">
								<div
									className={`p-3 rounded-lg bg-gradient-to-r ${assessment.color}`}
								>
									<assessment.icon className="h-6 w-6 text-white" />
								</div>
								<ArrowRightIcon
									className={`h-5 w-5 ${assessment.textColor} group-hover:translate-x-1 transition-transform duration-200`}
								/>
							</div>

							<h2
								className={`text-xl font-semibold mb-3 ${assessment.textColor}`}
							>
								{assessment.name}
							</h2>

							<p className="text-gray-300 mb-6 leading-relaxed">
								{assessment.description}
							</p>

							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-400">Click to start</span>
								<div
									className={`px-4 py-2 rounded-lg bg-gradient-to-r ${assessment.color} text-white text-sm font-medium`}
								>
									Start Test
								</div>
							</div>
						</motion.div>
					))}
				</div>

				{/* Additional Info */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="mt-12 bg-[#18191b] rounded-xl border border-gray-700 p-8"
				>
					<h3 className="text-2xl font-bold text-white mb-4 text-center">
						Why Take These Assessments?
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="text-center">
							<div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
								<CpuChipIcon className="h-6 w-6 text-green-400" />
							</div>
							<h4 className="text-white font-semibold mb-2">
								Skill Evaluation
							</h4>
							<p className="text-gray-400 text-sm">
								Get a comprehensive understanding of your current skill levels
								across different domains.
							</p>
						</div>
						<div className="text-center">
							<div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
								<CodeBracketIcon className="h-6 w-6 text-blue-400" />
							</div>
							<h4 className="text-white font-semibold mb-2">Career Guidance</h4>
							<p className="text-gray-400 text-sm">
								Identify your strengths and areas for improvement to make
								informed career decisions.
							</p>
						</div>
						<div className="text-center">
							<div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
								<ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-400" />
							</div>
							<h4 className="text-white font-semibold mb-2">Personal Growth</h4>
							<p className="text-gray-400 text-sm">
								Track your progress over time and set meaningful goals for your
								professional development.
							</p>
						</div>
					</div>

					{/* Test Navigation Button */}
					<div className="mt-8 text-center">
						<button
							onClick={() => router.push("/assessment/test")}
							className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400"
						>
							Test Navigation
						</button>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
