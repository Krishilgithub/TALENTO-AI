import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const scenarios = [
	{
		img: "/scenario1.jpg",
		title: "System Design Interviews",
		desc: "Need an unfair advantage in system design interviews? Talento AI Coding Copilot delivers real-time solutions on architecture, scalability, and best practices. Practice with real scenarios and get instant feedback on your designs.",
	},
	{
		img: "/scenario2.jpg",
		title: "Software Engineering Interviews",
		desc: "Lock in your dream job offer with Talento AI's real-time coding solutions. Practice DSA, system design, and get code reviews from AI and industry experts.",
	},
	{
		img: "/scenario3.jpg",
		title: "Project Management",
		desc: "Need to elevate your PMO interview game? Unlock your potential with Talento AI's real-time insights, scenario-based questions, and leadership coaching.",
	},
	{
		img: "/scenario4.jpg",
		title: "Financial Interviews",
		desc: "Ace your financial interviews with real-time analytics, case studies, and market analysis tools. Get feedback on your answers and improve your financial acumen.",
	},
	{
		img: "/scenario5.jpg",
		title: "Market Sizing Interviews",
		desc: "Master market sizing with AI-driven data, frameworks, and scenario analysis. Practice with real business cases and get detailed breakdowns of your approach.",
	},
	{
		img: "/scenario6.jpg",
		title: "Case Study Interviews",
		desc: "Crack case studies with instant feedback, structured solutions, and industry benchmarks. Learn how to approach, analyze, and present your findings effectively.",
	},
];

export default function ScenariosSection() {
	return (
		<section
			id="scenarios"
			className="w-full max-w-7xl mx-auto py-20 px-4 reveal"
		>
			<h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
				Support All Scenarios
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{scenarios.map((s, i) => (
					<motion.div
						key={i}
						className="bg-[#18191b] rounded-xl overflow-hidden shadow hover:shadow-lg transition group cursor-pointer"
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 1, delay: i * 0.15, type: "spring", bounce: 0.2 }}
					>
						<div className="h-48 w-full relative">
							<Image src={s.img} alt={s.title} fill className="object-cover" />
						</div>
						<div className="p-6">
							<h3 className="text-lg font-bold mb-2">{s.title}</h3>
							<p className="text-gray-400 text-sm">{s.desc}</p>
						</div>
					</motion.div>
				))}
			</div>
		</section>
	);
}
