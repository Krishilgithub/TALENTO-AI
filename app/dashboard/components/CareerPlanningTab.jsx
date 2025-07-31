"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const CAREER_STEPS = [
	{
		step: 1,
		title: "Self-Assessment",
		description: "Understand your strengths, interests, and skills. Take our assessments to get started.",
		icon: "🎯",
		color: "from-cyan-900 to-blue-900",
		borderColor: "border-cyan-700"
	},
	{
		step: 2,
		title: "Explore Career Paths",
		description: "Browse popular roles and industries that match your profile.",
		icon: "🗺️",
		color: "from-green-900 to-emerald-900",
		borderColor: "border-green-700"
	},
	{
		step: 3,
		title: "Set Goals",
		description: "Define your short-term and long-term career goals.",
		icon: "🎯",
		color: "from-purple-900 to-pink-900",
		borderColor: "border-purple-700"
	},
	{
		step: 4,
		title: "Track Progress",
		description: "Monitor your journey and update your progress regularly.",
		icon: "📊",
		color: "from-orange-900 to-yellow-900",
		borderColor: "border-orange-700"
	},
];

const CAREER_PATHS = [
	"Software Engineer",
	"Data Scientist",
	"Product Manager",
	"Digital Marketer",
	"Financial Analyst",
	"UX/UI Designer",
	"Mechanical Engineer",
	"Entrepreneur",
];

export default function CareerPlanningTab() {
	const [activeStep, setActiveStep] = useState(1);

	return (
		<div className="w-full">
			<div className="text-center mb-8">
				<h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Career Planning</h2>
				<p className="text-gray-300 text-lg">
					Plan your career with confidence! Follow the steps below to discover
					your strengths, explore opportunities, set goals, and track your
					progress.
				</p>
			</div>

			{/* Career Steps */}
			{/* <div className="max-w-4xl mx-auto mb-12">
				{CAREER_STEPS.map((step, index) => (
					<motion.div
						key={step.step}
						initial={{ opacity: 0, x: -40 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.6, delay: index * 0.1, type: "spring", bounce: 0.2 }}
					>
						<div className={`bg-gradient-to-br ${step.color} rounded-xl shadow-lg border ${step.borderColor} p-6 mb-6 flex flex-col md:flex-row items-start md:items-center hover:scale-105 transition-all duration-300 cursor-pointer`}
							onClick={() => setActiveStep(step.step)}
						>
							<div className="flex items-center mb-4 md:mb-0 md:mr-6">
								<div className="text-3xl mr-3">{step.icon}</div>
								<div className="flex-shrink-0 w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-lg font-bold text-white mr-4">
									{step.step}
								</div>
							</div>
							<div className="flex-1">
								<h3 className="text-xl font-semibold text-white mb-2">
									{step.title}
								</h3>
								<p className="text-gray-200 mb-3">{step.description}</p>
								<button className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200">
									Get Started
								</button>
							</div>
						</div>
					</motion.div>
				))}
			</div> */}

			{/* Popular Career Paths */}
			<div className="max-w-4xl mx-auto mb-12">
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.6, type: 'spring', bounce: 0.2 }}
				>
					<h3 className="text-2xl font-semibold text-cyan-400 mb-6 text-center">
						Popular Career Paths
					</h3>
					<div className="bg-[#18191b] rounded-xl p-6 border border-gray-700">
						<div className="flex flex-wrap gap-3 justify-center">
							{CAREER_PATHS.map((path, index) => (
								<motion.span
									key={path}
									initial={{ opacity: 0, scale: 0.8 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true, amount: 0.3 }}
									transition={{ duration: 0.6, type: 'spring', bounce: 0.2 }}
									className="bg-gradient-to-r from-cyan-900 to-blue-900 text-cyan-200 px-4 py-2 rounded-full text-sm font-medium border border-cyan-700 hover:scale-105 transition-all duration-200 cursor-pointer"
								>
									{path}
								</motion.span>
							))}
						</div>
					</div>
				</motion.div>
			</div>

			{/* Resources & Next Steps */}
			<div className="max-w-4xl mx-auto mb-12">
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.6, type: 'spring', bounce: 0.2 }}
					className="bg-[#18191b] rounded-xl p-6 border border-gray-700"
				>
					<h3 className="text-xl font-semibold text-cyan-400 mb-4">
						Resources & Next Steps
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<h4 className="text-lg font-semibold text-white mb-3">Getting Started</h4>
							<ul className="space-y-2 text-gray-300">
								<li className="flex items-start">
									<span className="text-cyan-400 mr-2 mt-1">✓</span>
									Take relevant assessments to identify your strengths
								</li>
								<li className="flex items-start">
									<span className="text-cyan-400 mr-2 mt-1">✓</span>
									Research roles and industries that interest you
								</li>
								<li className="flex items-start">
									<span className="text-cyan-400 mr-2 mt-1">✓</span>
									Set clear, achievable career goals
								</li>
							</ul>
						</div>
						<div>
							<h4 className="text-lg font-semibold text-white mb-3">Ongoing Development</h4>
							<ul className="space-y-2 text-gray-300">
								<li className="flex items-start">
									<span className="text-cyan-400 mr-2 mt-1">✓</span>
									Track your progress and celebrate milestones
								</li>
								<li className="flex items-start">
									<span className="text-cyan-400 mr-2 mt-1">✓</span>
									Update your goals regularly
								</li>
								<li className="flex items-start">
									<span className="text-cyan-400 mr-2 mt-1">✓</span>
									Seek mentorship and networking opportunities
								</li>
							</ul>
						</div>
					</div>
				</motion.div>
			</div>

			{/* Career Tools Section */}
			{/* <div className="max-w-4xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.8, delay: 0.8, type: "spring", bounce: 0.2 }}
					className="bg-[#18191b] rounded-xl p-6 border border-gray-700"
				>
					<h3 className="text-xl font-semibold text-cyan-400 mb-4">
						Career Tools
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="bg-gradient-to-br from-cyan-900 to-blue-900 rounded-lg p-4 border border-cyan-700">
							<h4 className="text-lg font-semibold text-white mb-2">Resume Builder</h4>
							<p className="text-gray-200 text-sm mb-3">Create professional resumes tailored to your target roles</p>
							<button className="bg-cyan-400 text-black px-3 py-1 rounded text-sm font-medium hover:bg-cyan-300 transition">
								Get Started
							</button>
						</div>
						<div className="bg-gradient-to-br from-green-900 to-emerald-900 rounded-lg p-4 border border-green-700">
							<h4 className="text-lg font-semibold text-white mb-2">Interview Prep</h4>
							<p className="text-gray-200 text-sm mb-3">Practice with AI-powered mock interviews</p>
							<button className="bg-green-400 text-black px-3 py-1 rounded text-sm font-medium hover:bg-green-300 transition">
								Practice Now
							</button>
						</div>
						<div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg p-4 border border-purple-700">
							<h4 className="text-lg font-semibold text-white mb-2">Skills Assessment</h4>
							<p className="text-gray-200 text-sm mb-3">Evaluate your technical and soft skills</p>
							<button className="bg-purple-400 text-black px-3 py-1 rounded text-sm font-medium hover:bg-purple-300 transition">
								Take Test
							</button>
						</div>
						<div className="bg-gradient-to-br from-orange-900 to-yellow-900 rounded-lg p-4 border border-orange-700">
							<h4 className="text-lg font-semibold text-white mb-2">Career Advisor</h4>
							<p className="text-gray-200 text-sm mb-3">Get personalized career guidance from AI</p>
							<button className="bg-orange-400 text-black px-3 py-1 rounded text-sm font-medium hover:bg-orange-300 transition">
								Ask AI
							</button>
						</div>
					</div>
				</motion.div>
			</div> */}
		</div>
	);
} 