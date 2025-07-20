import React from "react";
import { motion } from "framer-motion";

export default function PricingSection() {
	return (
		<section
			id="pricing"
			className="w-full max-w-4xl mx-auto py-20 px-4 text-center reveal"
		>
			<h2 className="text-3xl sm:text-4xl font-bold mb-8">Pricing</h2>
			<div className="flex flex-col sm:flex-row gap-8 justify-center">
				{React.Children.toArray([
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 1, delay: 0 * 0.15, type: "spring", bounce: 0.2 }}
					>{/* Card 1 */}
						<div className="bg-[#18191b] rounded-2xl shadow-lg p-8 flex-1 hover:bg-[#232425] transition cursor-pointer border-2 border-gray-700 min-w-[320px]">
							<h3 className="text-xl font-bold mb-2 text-cyan-400">Free Trial</h3>
							<p className="text-gray-400 mb-4">
								Try all features for 7 days. No credit card required. Experience the
								full power of Talento AI risk-free and see the results for yourself.
							</p>
							<ul className="text-left text-gray-300 mb-4 space-y-1 text-sm">
								<li>✔️ Access to all interview prep tools</li>
								<li>✔️ 1 AI Copilot session per day</li>
								<li>✔️ Basic resume builder</li>
								<li>✔️ Community support</li>
							</ul>
							<span className="block text-3xl font-bold text-cyan-400 mb-2">
								&#8377;0
							</span>
							<a
								href="#signup"
								className="inline-block mt-4 px-6 py-2 rounded-full bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition"
							>
								Start Free
							</a>
						</div>
					</motion.div>,
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 1, delay: 1 * 0.15, type: "spring", bounce: 0.2 }}
					>{/* Card 2 */}
						<div className="bg-gradient-to-b from-cyan-900 to-[#18191b] rounded-2xl shadow-xl p-8 flex-1 hover:from-cyan-800 hover:to-[#232425] transition cursor-pointer border-4 border-cyan-400 scale-105 min-w-[320px]">
							<h3 className="text-xl font-bold mb-2 text-cyan-300">Pro</h3>
							<p className="text-gray-200 mb-4">
								Unlock unlimited access to all features, priority support, and more.
								Join thousands of successful candidates who trust Talento AI for
								their career growth.
							</p>
							<ul className="text-left text-gray-100 mb-4 space-y-1 text-sm">
								<li>✔️ Unlimited AI Copilot sessions</li>
								<li>✔️ Advanced resume builder & optimization</li>
								<li>✔️ Coding & system design practice</li>
								<li>✔️ Priority email support</li>
								<li>✔️ Access to premium content</li>
							</ul>
							<span className="block text-3xl font-bold text-cyan-300 mb-2">
								&#8377;29/mo
							</span>
							<a
								href="#signup"
								className="inline-block mt-4 px-6 py-2 rounded-full bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition"
							>
								Go Pro
							</a>
						</div>
					</motion.div>,
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 1, delay: 2 * 0.15, type: "spring", bounce: 0.2 }}
					>{/* Card 3 */}
						<div className="bg-[#232425] rounded-2xl shadow-lg p-8 flex-1 hover:bg-[#18191b] transition cursor-pointer border-2 border-cyan-900 min-w-[340px]">
							<h3 className="text-xl font-bold mb-2 text-cyan-500">Enterprise</h3>
							<p className="text-gray-300 mb-4">
								For teams, universities, and organizations. Get custom solutions,
								analytics, and dedicated onboarding.
							</p>
							<ul className="text-left text-gray-200 mb-4 space-y-1 text-sm">
								<li>✔️ All Pro features</li>
								<li>✔️ Team management dashboard</li>
								<li>✔️ Custom AI training & analytics</li>
								<li>✔️ Dedicated onboarding & support</li>
								<li>✔️ Volume discounts</li>
							</ul>
							<span className="block text-3xl font-bold text-cyan-500 mb-2">
								Contact Us
							</span>
							<a
								href="#contact"
								className="inline-block mt-4 px-6 py-2 rounded-full bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition"
							>
								Request Demo
							</a>
						</div>
					</motion.div>,
				])}
			</div>
		</section>
	);
}
