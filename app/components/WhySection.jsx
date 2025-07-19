import React from "react";
import { motion } from "framer-motion";

export default function WhySection() {
	return (
		<section id="why" className="w-full max-w-7xl mx-auto py-20 px-4 reveal">
			<h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
				Why use <span className="text-cyan-400">Talento AI?</span>
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{React.Children.toArray([
					React.cloneElement(
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{
								duration: 1,
								delay: 0 * 0.15,
								type: "spring",
								bounce: 0.2,
							}}
						>
							{/* Card 1 */}
							<div className="bg-[#18191b] rounded-xl shadow p-6 flex flex-col gap-2 hover:bg-[#232425] transition cursor-pointer">
								<span className="text-xs font-semibold text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded w-fit mb-2">
									Speech Recognition
								</span>
								<h3 className="text-lg font-bold">Multilingual</h3>
								<p className="text-gray-400 text-sm">
									Experience a lightning-fast 116 ms response time for natural,
									uninterrupted interviews—converse seamlessly in 42 languages
									with regional accent and dialect support, breaking down
									language barriers with AI-powered communication. Talento AI
									ensures you can communicate confidently in any global
									interview scenario.
								</p>
							</div>
						</motion.div>,
						{ key: "why-card-1" }
					),
					React.cloneElement(
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{
								duration: 1,
								delay: 1 * 0.15,
								type: "spring",
								bounce: 0.2,
							}}
						>
							{/* Card 2 */}
							<div className="bg-[#18191b] rounded-xl shadow p-6 flex flex-col gap-2 hover:bg-[#232425] transition cursor-pointer">
								<span className="text-xs font-semibold text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded w-fit mb-2">
									Premium AI
								</span>
								<h3 className="text-lg font-bold">Advanced AI Models</h3>
								<p className="text-gray-400 text-sm">
									Powered by the latest and most capable models from Deepseek,
									Azure OpenAI, Google Gemini, Claude, and Gork — always updated
									to ensure top-tier reasoning, accuracy, and performance.
									Includes integrated WebSearch for real-time results. Far
									beyond the lightweight models used by most platforms, Talento
									AI delivers unmatched results.
								</p>
							</div>
						</motion.div>,
						{ key: "why-card-2" }
					),
					React.cloneElement(
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{
								duration: 1,
								delay: 2 * 0.15,
								type: "spring",
								bounce: 0.2,
							}}
						>
							{/* Card 3 */}
							<div className="bg-[#18191b] rounded-xl shadow p-6 flex flex-col gap-2 hover:bg-[#232425] transition cursor-pointer">
								<span className="text-xs font-semibold text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded w-fit mb-2">
									Guaranteed Results
								</span>
								<h3 className="text-lg font-bold">Proven Success Rate</h3>
								<p className="text-gray-400 text-sm">
									80% of our subscribers secure their dream jobs within 3
									months, with 40% landing $100K+ offers. Your success is our
									guarantee. Talento AI's proven track record speaks for itself,
									with thousands of satisfied users worldwide.
								</p>
							</div>
						</motion.div>,
						{ key: "why-card-3" }
					),
					React.cloneElement(
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{
								duration: 1,
								delay: 3 * 0.15,
								type: "spring",
								bounce: 0.2,
							}}
						>
							{/* Card 4 */}
							<div className="bg-[#18191b] rounded-xl shadow p-6 flex flex-col gap-2 hover:bg-[#232425] transition cursor-pointer">
								<span className="text-xs font-semibold text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded w-fit mb-2">
									Full Coverage
								</span>
								<h3 className="text-lg font-bold">Complete Career Ecosystem</h3>
								<p className="text-gray-400 text-sm">
									One platform for everything: build your resume, find and apply
									to jobs, ace your interviews, and tap into expert communities
									to excel at every stage. Talento AI is your all-in-one career
									launchpad.
								</p>
							</div>
						</motion.div>,
						{ key: "why-card-4" }
					),
					React.cloneElement(
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{
								duration: 1,
								delay: 4 * 0.15,
								type: "spring",
								bounce: 0.2,
							}}
						>
							{/* Card 5 */}
							<div className="bg-[#18191b] rounded-xl shadow p-6 flex flex-col gap-2 hover:bg-[#232425] transition cursor-pointer">
								<span className="text-xs font-semibold text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded w-fit mb-2">
									Mobile Optimized
								</span>
								<h3 className="text-lg font-bold">Practice Anywhere</h3>
								<p className="text-gray-400 text-sm">
									No app download needed - get real-time answers in your live
									interview and conduct mock interviews anywhere, anytime with
									our mobile-optimized platform. Talento AI is always with you,
									on any device.
								</p>
							</div>
						</motion.div>,
						{ key: "why-card-5" }
					),
					React.cloneElement(
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{
								duration: 1,
								delay: 5 * 0.15,
								type: "spring",
								bounce: 0.2,
							}}
						>
							{/* Card 6 */}
							<div className="bg-[#18191b] rounded-xl shadow p-6 flex flex-col gap-2 hover:bg-[#232425] transition cursor-pointer">
								<span className="text-xs font-semibold text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded w-fit mb-2">
									Cutting-Edge Technology
								</span>
								<h3 className="text-lg font-bold">Dual-Layer AI Platform</h3>
								<p className="text-gray-400 text-sm">
									The only dual-layer platform offering both an AI Copilot and
									an AI Coach running simultaneously, delivering real-time
									insights and instant corrections. Talento AI's technology
									ensures you are always interview-ready.
								</p>
							</div>
						</motion.div>,
						{ key: "why-card-6" }
					),
				])}
			</div>
		</section>
	);
}
