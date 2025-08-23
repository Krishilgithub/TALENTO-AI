"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SubscriptionTab() {
	return (
		<div className="w-full">
			<div className="text-center mb-8">
				<h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Choose Your Plan</h2>
				<p className="text-gray-300 text-lg">
					Unlock your full potential with our comprehensive plans
				</p>
			</div>
			
			<div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch">
				{React.Children.toArray([
					<motion.div key="pricing-1"
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
					>
						<div className="bg-[#18191b] rounded-2xl shadow-lg p-8 flex-grow-0 max-w-xs w-full hover:bg-[#232425] transition cursor-pointer border-2 border-gray-700">
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
							<button className="inline-block mt-4 px-6 py-2 rounded-full bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition">
								Start Free
							</button>
						</div>
					</motion.div>,
					<motion.div key="pricing-2"
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.6, delay: 0.1, type: "spring", bounce: 0.2 }}
					>
						<div className="bg-gradient-to-b from-cyan-900 to-[#18191b] rounded-2xl shadow-xl p-8 flex-grow-0 max-w-xs w-full hover:from-cyan-800 hover:to-[#232425] transition cursor-pointer border-4 border-cyan-400 scale-105">
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
								&#8377;1399/month
							</span>
							<Link href="/payment">
								<button className="inline-block mt-4 px-6 py-2 rounded-full bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition">
									Go Pro
								</button>
							</Link>
						</div>
					</motion.div>,
					<motion.div key="pricing-3"
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.6, delay: 0.2, type: "spring", bounce: 0.2 }}
					>
						<div className="bg-[#232425] rounded-2xl shadow-lg p-8 flex-grow-0 max-w-xs w-full hover:bg-[#18191b] transition cursor-pointer border-2 border-cyan-900">
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
							<Link href="/demo-request">
								<button className="inline-block mt-4 px-6 py-2 rounded-full bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition">
									Request Demo
								</button>
							</Link>
						</div>
					</motion.div>,
				])}
			</div>
			
			{/* Additional Features Section */}
			<div className="mt-12 text-center">
				<h3 className="text-2xl font-bold mb-6 text-white">Why Choose Talento AI?</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
					<div className="bg-[#18191b] rounded-xl p-6 border border-gray-700">
						<div className="text-cyan-400 text-3xl mb-3">🚀</div>
						<h4 className="text-lg font-semibold text-white mb-2">AI-Powered Learning</h4>
						<p className="text-gray-400">Personalized learning paths adapted to your skills and goals</p>
					</div>
					<div className="bg-[#18191b] rounded-xl p-6 border border-gray-700">
						<div className="text-cyan-400 text-3xl mb-3">📊</div>
						<h4 className="text-lg font-semibold text-white mb-2">Real-time Analytics</h4>
						<p className="text-gray-400">Track your progress with detailed insights and recommendations</p>
					</div>
					<div className="bg-[#18191b] rounded-xl p-6 border border-gray-700">
						<div className="text-cyan-400 text-3xl mb-3">🎯</div>
						<h4 className="text-lg font-semibold text-white mb-2">Industry Focused</h4>
						<p className="text-gray-400">Content tailored to current industry demands and trends</p>
					</div>
				</div>
			</div>
		</div>
	);
} 