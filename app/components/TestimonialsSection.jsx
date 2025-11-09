import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function TestimonialsSection() {
	const testimonials = [
		{
			text: "Talento AI helped me land my dream job in just 2 months! The personalized coaching and instant feedback made all the difference.",
			name: "Priya Patel, Data Analyst",
			avatar: "/avatar1.jpg",
			delay: 0,
		},
		{
			text: "The real-time coaching and feedback is a game changer. I felt confident and prepared for every interview.",
			name: "Leena Rodrigues, Product Manager",
			avatar: "/avatar2.jpg",
			delay: 1,
		},
		{
			text: "I loved the resume builder and mock assessments. It made my job search so much easier and less stressful!",
			name: "Jane Doe, Software Engineer",
			avatar: "/avatar3.jpg",
			delay: 2,
		},
		{
			text: "The technical question prep was spot on. I felt ready for every round, thanks to Talento AI!",
			name: "Alex Lee, Frontend Developer",
			avatar: "/avatar4.jpg",
			delay: 3,
		},
	];
	return (
		<section
			id="testimonials"
			className="w-full bg-white dark:bg-[#0f0f0f] py-24 px-4 text-center"
		>
			<div className="max-w-6xl mx-auto">
				<h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">What Our Users Say</h2>
				<p className="text-gray-600 dark:text-gray-400 mb-16 text-lg max-w-2xl mx-auto">
					Join thousands of professionals who have transformed their careers with TalentoAI
				</p>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
					{testimonials.map((t, idx) => (
						<motion.div
							key={t.name + t.avatar}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 1, delay: t.delay * 0.15, type: "spring", bounce: 0.2 }}
						>
							<div className="bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-lg p-8 text-left hover:bg-[#232425] hover:border-gray-700 transition-all duration-300 cursor-pointer flex items-start justify-between h-full">
								<div className="flex-1 pr-4">
									<p className="text-lg font-medium mb-4 text-white leading-relaxed">
										{`"${t.text}"`}
									</p>
									<span className="block text-cyan-400 text-sm font-medium">
										{`— ${t.name}`}
									</span>
								</div>
								<Image
									src={t.avatar}
									alt={t.name}
									width={64}
									height={64}
									className="rounded-full flex-shrink-0 border-2 border-gray-700"
								/>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
