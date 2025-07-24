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
			className="w-full max-w-4xl mx-auto py-20 px-4 text-center reveal"
		>
			<h2 className="text-3xl sm:text-4xl font-bold mb-8">Testimonials</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
				{testimonials.map((t, idx) => (
					<motion.div
						key={t.name + t.avatar}
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 1, delay: t.delay * 0.15, type: "spring", bounce: 0.2 }}
					>
						<div className="bg-[#18191b] rounded-xl shadow p-6 text-left hover:bg-[#232425] transition cursor-pointer flex items-center justify-between">
							<div className="flex-1">
								<p className="text-lg font-semibold mb-2">
									{`“${t.text}”`}
								</p>
								<span className="block text-gray-400 text-sm">
									{`— ${t.name}`}
								</span>
							</div>
							<Image src={t.avatar} alt={t.name} width={56} height={56} className="rounded-full ml-4" />
						</div>
					</motion.div>
				))}
			</div>
		</section>
	);
}
