import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const features = [
	{
		icon: "/AI.png",
		title: "AI Copilot for Job Interviews",
		desc: "Real-time answers, live coaching, and interview simulations for job seekers. Get instant feedback, personalized coaching, and actionable tips to ace every interview round, from HR to technical panels.",
	},
	{
		icon: "/Resume.png",
		title: "Resume Builder",
		desc: "Create and optimize resumes with AI assistance. Receive tailored suggestions, keyword optimization, and formatting tips to ensure your resume stands out to recruiters and ATS systems.",
	},
	// {
	// 	icon: "/globe.svg",
	// 	title: "Coding Assistance",
	// 	desc: "Support for technical interviews, including coding questions and solutions. Practice with real-world problems, get code reviews, and improve your problem-solving skills with AI guidance.",
	// },
	{
		icon: "/Internet.png",
		title: "Online Assessment Support",
		desc: "Practice and guidance for online job assessments. Access mock tests, detailed analytics, and targeted practice to boost your scores and confidence.",
	},
	{
		icon: "/technical.png",
		title: "Techical Question Prep",
		desc: "Real-time feedback for both behavioral and technical interview questions. Learn how to structure your answers, highlight your strengths, and avoid common pitfalls.",
	},
	// {
	// 	icon: "/file.svg",
	// 	title: "Live Coaching",
	// 	desc: "Interactive, real-time coaching sessions and video interviewing. Schedule sessions with experts, get personalized advice, and simulate real interview environments.",
	// },
];

export default function FeaturesSection() {
	return (
		<section
			id="features"
			className="w-full bg-white dark:bg-[#0f0f0f] py-24 px-4"
		>
			<div className="max-w-6xl mx-auto">
				<h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
					Features & Services
				</h2>
				<p className="text-gray-600 dark:text-gray-400 text-center mb-16 text-lg max-w-2xl mx-auto">
					Comprehensive AI-powered tools to accelerate your career journey
				</p>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
					{features.map((f, i) => (
						<motion.div
							key={i}
							className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg p-8 flex flex-col items-center text-center transition transform hover:-translate-y-2 hover:scale-105 hover:shadow-xl hover:bg-gray-50 dark:hover:bg-[#232425] dark:hover:border-gray-700 cursor-pointer group min-h-[280px]"
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 1, delay: i * 0.18, type: "spring", bounce: 0.2 }}
						>
							<Image
								src={f.icon}
								alt={f.title}
								width={56}
								height={56}
								className="mb-6 group-hover:scale-110 transition filter dark:brightness-90"
							/>
							<h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{f.title}</h3>
							<p className="text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
