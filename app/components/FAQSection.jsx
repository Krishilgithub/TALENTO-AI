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
			className="w-full bg-white dark:bg-[#0f0f0f] py-24 px-4 text-center"
		>
			<div className="max-w-4xl mx-auto">
				<h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
				<p className="text-gray-600 dark:text-gray-400 mb-16 text-lg max-w-2xl mx-auto">
					Get answers to common questions about TalentoAI
				</p>
				<div className="space-y-6 text-left">
					{faqs.map((faq, idx) => (
						<motion.div
							key={idx}
							className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg p-8 hover:bg-gray-50 dark:hover:bg-[#232425] dark:hover:border-gray-700 transition cursor-pointer"
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 1, delay: idx * 0.15, type: "spring", bounce: 0.2 }}
							onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
						>
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-bold mb-2 select-none text-gray-900 dark:text-white">{faq.question}</h3>
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
								<p className="text-gray-600 dark:text-gray-400 text-base mt-4 leading-relaxed">{faq.answer}</p>
							)}
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
