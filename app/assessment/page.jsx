"use client";

import React from "react";
import { motion } from "framer-motion";
import {
	CpuChipIcon,
	ChatBubbleLeftRightIcon,
	CodeBracketIcon,
	UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import AssessmentLayout from "../components/AssessmentLayout";

export default function AssessmentPage() {
	const assessments = [
		{
			title: "General Aptitude",
			description:
				"Test your logical reasoning, problem-solving, and analytical skills",
			icon: CpuChipIcon,
			href: "/assessment/aptitude",
			color: "text-blue-400",
			bgColor: "bg-blue-500/10",
			borderColor: "border-blue-500/20",
		},
		{
			title: "Communication Test",
			description: "Assess your written and verbal communication abilities",
			icon: ChatBubbleLeftRightIcon,
			href: "/assessment/communication",
			color: "text-green-400",
			bgColor: "bg-green-500/10",
			borderColor: "border-green-500/20",
		},
		{
			title: "Technical Assessment",
			description: "Evaluate your technical knowledge and programming skills",
			icon: CodeBracketIcon,
			href: "/assessment/technical",
			color: "text-purple-400",
			bgColor: "bg-purple-500/10",
			borderColor: "border-purple-500/20",
		},
		{
			title: "Personality Assessment",
			description:
				"Discover your work style, leadership approach, and communication preferences",
			icon: UserIcon,
			href: "/assessment/personality",
			color: "text-orange-400",
			bgColor: "bg-orange-500/10",
			borderColor: "border-orange-500/20",
		},
	];

	return (
		<AssessmentLayout>
			<div className="container mx-auto max-w-6xl">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-12"
				>
					<h1 className="text-4xl font-bold text-white mb-4">
						Assessment Center
					</h1>
					<p className="text-xl text-gray-300 max-w-3xl mx-auto">
						Choose from our comprehensive range of assessments to evaluate your
						skills, knowledge, and personality traits.
					</p>
				</motion.div>

				{/* Assessment Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
					{assessments.map((assessment, index) => (
						<motion.div
							key={assessment.title}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
						>
							<Link href={assessment.href}>
								<div
									className="bg-gray-800/30 border border-gray-600/50 backdrop-blur-sm rounded-lg p-6 hover:border-cyan-400/50 hover:scale-105 transition-all duration-300 cursor-pointer"
								>
									<div className="flex items-start space-x-4">
										<div
											className={`p-3 rounded-lg bg-opacity-20 ${assessment.bgColor}`}
										>
											<assessment.icon
												className={`h-8 w-8 ${assessment.color}`}
											/>
										</div>
										<div className="flex-1">
											<h3 className="text-xl font-semibold text-white mb-2">
												{assessment.title}
											</h3>
											<p className="text-gray-300 leading-relaxed">
												{assessment.description}
											</p>
										</div>
									</div>
								</div>
							</Link>
						</motion.div>
					))}
				</div>

				{/* Additional Information */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="mt-12 bg-[#1a1b1c] rounded-lg p-6"
				>
					<h2 className="text-2xl font-bold text-white mb-4">
						Why Take These Assessments?
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
						<div>
							<h3 className="text-lg font-semibold text-white mb-2">
								Skill Development
							</h3>
							<p>
								Identify your strengths and areas for improvement to focus your
								learning efforts effectively.
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold text-white mb-2">
								Career Planning
							</h3>
							<p>
								Understand your personality traits and work preferences to make
								informed career decisions.
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold text-white mb-2">
								Interview Preparation
							</h3>
							<p>
								Practice common assessment types you might encounter during job
								interviews and applications.
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold text-white mb-2">
								Self-Awareness
							</h3>
							<p>
								Gain insights into your communication style, problem-solving
								approach, and leadership potential.
							</p>
						</div>
					</div>
				</motion.div>
			</div>
		</AssessmentLayout>
	);
}
