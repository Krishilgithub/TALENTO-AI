import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function FAQSection() {
	const faqs = [
		{
			question: "How does the AI Copilot work?",
			answer:
				"Our AI Copilot uses advanced language models to simulate real interview scenarios and provide instant feedback. Talento AI adapts to your needs and helps you improve with every session.",
		},
		{
			question: "Can I use the platform for free?",
			answer:
				"Yes, you can start with a 7-day free trial and upgrade to Pro anytime. Talento AI is committed to making career growth accessible to everyone.",
		},
		{
			question: "Is my data secure?",
			answer:
				"Absolutely. We use industry-standard encryption and never share your data with third parties. Your privacy and security are our top priorities.",
		},
		{
			question: "Can I get a demo for my team or company?",
			answer:
				"Yes! Our Enterprise plan includes custom demos, onboarding, and team management features. Contact us for more details.",
		},
		{
			question: "What payment methods do you accept?",
			answer:
				"We accept all major credit/debit cards, PayPal, and bank transfers for Enterprise clients.",
		},
	];
	const [openIndex, setOpenIndex] = useState(null);

	return (
		<section
			id="faq"
			className="w-full max-w-4xl mx-auto py-20 px-4 text-center reveal"
		>
			<h2 className="text-3xl sm:text-4xl font-bold mb-8">FAQ</h2>
			<div className="space-y-6 text-left">
				{faqs.map((faq, idx) => (
					<motion.div
						key={idx}
						className="bg-[#18191b] rounded-xl shadow p-6 hover:bg-[#232425] transition cursor-pointer"
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 1, delay: idx * 0.15, type: "spring", bounce: 0.2 }}
						onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
					>
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-bold mb-2 select-none">{faq.question}</h3>
							<svg
								className={`w-5 h-5 ml-2 transition-transform duration-200 ${openIndex === idx ? "rotate-90" : "rotate-0"}`}
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								viewBox="0 0 24 24"
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
							</svg>
						</div>
						{openIndex === idx && (
							<p className="text-gray-400 text-sm mt-2">{faq.answer}</p>
						)}
					</motion.div>
				))}
			</div>
		</section>
	);
}
