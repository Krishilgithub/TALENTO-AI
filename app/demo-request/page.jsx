"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
	ArrowLeftIcon,
	BuildingOfficeIcon,
	UserGroupIcon,
	ChartBarIcon,
	PhoneIcon,
	EnvelopeIcon,
	CalendarIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function DemoRequestPage() {
	const [formData, setFormData] = useState({
		companyName: "",
		contactName: "",
		email: "",
		phone: "",
		companySize: "",
		useCase: "",
		preferredDate: "",
		message: ""
	});

	const handleInputChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle form submission here
		console.log("Demo request submitted:", formData);
		// You can add API call here later
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#101113] via-[#18191b] to-[#23272f] py-12 px-4">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-12"
				>
					<Link
						href="/dashboard"
						className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-6"
					>
						<ArrowLeftIcon className="w-4 h-4 mr-2" />
						Back to Dashboard
					</Link>
					<h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
						Request Enterprise Demo
					</h1>
					<p className="text-gray-300 text-xl max-w-3xl mx-auto">
						Discover how Talento AI can transform your organization's talent development and career growth initiatives
					</p>
				</motion.div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Demo Request Form */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className="bg-[#18191b] rounded-2xl p-8 border border-gray-700"
					>
						<h2 className="text-2xl font-bold text-white mb-6">Schedule Your Demo</h2>
						
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										Company Name *
									</label>
									<input
										type="text"
										name="companyName"
										value={formData.companyName}
										onChange={handleInputChange}
										required
										className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-[#23272f] text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
										placeholder="Your Company"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										Contact Name *
									</label>
									<input
										type="text"
										name="contactName"
										value={formData.contactName}
										onChange={handleInputChange}
										required
										className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-[#23272f] text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
										placeholder="Your Name"
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										Email *
									</label>
									<input
										type="email"
										name="email"
										value={formData.email}
										onChange={handleInputChange}
										required
										className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-[#23272f] text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
										placeholder="your@email.com"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										Phone
									</label>
									<input
										type="tel"
										name="phone"
										value={formData.phone}
										onChange={handleInputChange}
										className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-[#23272f] text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
										placeholder="+1 (555) 123-4567"
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										Company Size *
									</label>
									<select
										name="companySize"
										value={formData.companySize}
										onChange={handleInputChange}
										required
										className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-[#23272f] text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
									>
										<option value="">Select size</option>
										<option value="1-50">1-50 employees</option>
										<option value="51-200">51-200 employees</option>
										<option value="201-500">201-500 employees</option>
										<option value="501-1000">501-1000 employees</option>
										<option value="1000+">1000+ employees</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										Preferred Date *
									</label>
									<input
										type="date"
										name="preferredDate"
										value={formData.preferredDate}
										onChange={handleInputChange}
										required
										className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-[#23272f] text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Primary Use Case *
								</label>
								<select
									name="useCase"
									value={formData.useCase}
									onChange={handleInputChange}
									required
									className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-[#23272f] text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
								>
									<option value="">Select use case</option>
									<option value="corporate-training">Corporate Training</option>
									<option value="university-education">University Education</option>
									<option value="recruitment">Recruitment & Hiring</option>
									<option value="career-development">Career Development</option>
									<option value="skill-assessment">Skill Assessment</option>
									<option value="other">Other</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Additional Message
								</label>
								<textarea
									name="message"
									value={formData.message}
									onChange={handleInputChange}
									rows="4"
									className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-[#23272f] text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
									placeholder="Tell us more about your specific needs and requirements..."
								/>
							</div>

							<button
								type="submit"
								className="w-full py-4 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-500 transition-colors flex items-center justify-center"
							>
								<CalendarIcon className="w-5 h-5 mr-2" />
								Schedule Demo
							</button>
						</form>
					</motion.div>

					{/* Enterprise Features & Benefits */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						className="space-y-6"
					>
						<div className="bg-[#18191b] rounded-2xl p-8 border border-gray-700">
							<h3 className="text-2xl font-bold text-white mb-6">Enterprise Features</h3>
							
							<div className="space-y-4">
								<div className="flex items-start space-x-3">
									<UserGroupIcon className="w-6 h-6 text-cyan-400 mt-1" />
									<div>
										<h4 className="text-white font-semibold">Team Management Dashboard</h4>
										<p className="text-gray-400 text-sm">Centralized control over user access, permissions, and progress tracking</p>
									</div>
								</div>
								
								<div className="flex items-start space-x-3">
									<ChartBarIcon className="w-6 h-6 text-cyan-400 mt-1" />
									<div>
										<h4 className="text-white font-semibold">Custom AI Training & Analytics</h4>
										<p className="text-gray-400 text-sm">Tailored AI models and comprehensive reporting for your organization</p>
									</div>
								</div>
								
								<div className="flex items-start space-x-3">
									<BuildingOfficeIcon className="w-6 h-6 text-cyan-400 mt-1" />
									<div>
										<h4 className="text-white font-semibold">Dedicated Onboarding & Support</h4>
										<p className="text-gray-400 text-sm">Personalized setup assistance and priority customer support</p>
									</div>
								</div>
							</div>
						</div>

						<div className="bg-[#18191b] rounded-2xl p-8 border border-gray-700">
							<h3 className="text-2xl font-bold text-white mb-6">What to Expect</h3>
							
							<div className="space-y-4">
								<div className="flex items-center space-x-3">
									<div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
									<span className="text-gray-300">30-minute personalized demo of Talento AI Enterprise</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
									<span className="text-gray-300">Discussion of your specific use cases and requirements</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
									<span className="text-gray-300">Custom pricing and implementation timeline</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
									<span className="text-gray-300">Q&A session with our enterprise team</span>
								</div>
							</div>
						</div>

						<div className="bg-[#18191b] rounded-2xl p-6 border border-gray-700">
							<div className="flex items-center space-x-3 mb-4">
								<EnvelopeIcon className="w-6 h-6 text-cyan-400" />
								<h4 className="text-white font-semibold">Contact Information</h4>
							</div>
							<p className="text-gray-300 text-sm mb-3">
								Can't wait for the demo? Reach out to us directly:
							</p>
							<div className="space-y-2 text-sm">
								<p className="text-gray-300">
									<EnvelopeIcon className="w-4 h-4 inline mr-2 text-cyan-400" />
									enterprise@talentoai.com
								</p>
								<p className="text-gray-300">
									<PhoneIcon className="w-4 h-4 inline mr-2 text-cyan-400" />
									+1 (555) 123-4567
								</p>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
