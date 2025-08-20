"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
	GiftIcon,
	UserGroupIcon,
	ShareIcon,
	ClipboardDocumentIcon,
	CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function ReferralTab() {
	const [copied, setCopied] = useState(false);
	const [referralCode] = useState("TALENTO2024");

	const handleCopyCode = () => {
		navigator.clipboard.writeText(referralCode);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const referralBenefits = [
		{
			title: "Free Premium Access",
			description: "Get 30 days of premium features for each successful referral",
			icon: GiftIcon,
			color: "text-cyan-400",
		},
		{
			title: "Extended Practice Sessions",
			description: "Unlock unlimited practice sessions for both you and your friend",
			icon: UserGroupIcon,
			color: "text-green-400",
		},
		{
			title: "Priority Support",
			description: "Get priority customer support for you and your referrals",
			icon: ShareIcon,
			color: "text-purple-400",
		},
	];

	const referralSteps = [
		{
			step: "1",
			title: "Share Your Code",
			description: "Copy and share your unique referral code with friends and colleagues",
		},
		{
			step: "2",
			title: "They Sign Up",
			description: "Your friends use your code when creating their account",
		},
		{
			step: "3",
			title: "Both Get Rewards",
			description: "You both receive premium benefits and extended access",
		},
	];

	return (
		<div className="w-full space-y-8">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="text-center"
			>
				<h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
					Refer & Earn
				</h2>
				<p className="text-gray-300 text-lg max-w-2xl mx-auto">
					Share Talento AI with your network and unlock premium benefits for both you and your friends
				</p>
			</motion.div>

			{/* Referral Code Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="bg-gradient-to-r from-cyan-900 to-blue-900 rounded-2xl p-8 border border-cyan-700"
			>
				<div className="text-center">
					<h3 className="text-2xl font-bold text-white mb-4">Your Referral Code</h3>
					<div className="flex items-center justify-center space-x-4 mb-6">
						<div className="bg-[#18191b] px-6 py-4 rounded-lg border border-cyan-500">
							<span className="text-2xl font-bold text-cyan-400 tracking-wider">
								{referralCode}
							</span>
						</div>
						<button
							onClick={handleCopyCode}
							className="flex items-center space-x-2 px-4 py-4 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-all duration-200 hover:scale-105"
						>
							{copied ? (
								<CheckCircleIcon className="w-5 h-5" />
							) : (
								<ClipboardDocumentIcon className="w-5 h-5" />
							)}
							<span>{copied ? "Copied!" : "Copy"}</span>
						</button>
					</div>
					<p className="text-gray-300">
						Share this code with friends and colleagues to unlock rewards
					</p>
				</div>
			</motion.div>

			{/* Benefits Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="grid grid-cols-1 md:grid-cols-3 gap-6"
			>
				{referralBenefits.map((benefit, index) => (
					<motion.div
						key={benefit.title}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 + index * 0.1 }}
						className="bg-[#18191b] rounded-xl p-6 border border-gray-700 hover:border-cyan-500 transition-all duration-300 hover:scale-105"
					>
						<div className="flex items-center space-x-4 mb-4">
							<div className="p-3 bg-cyan-900 rounded-lg">
								<benefit.icon className={`w-6 h-6 ${benefit.color}`} />
							</div>
							<h3 className="text-lg font-semibold text-white">{benefit.title}</h3>
						</div>
						<p className="text-gray-300">{benefit.description}</p>
					</motion.div>
				))}
			</motion.div>

			{/* How It Works */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="bg-[#18191b] rounded-2xl p-8 border border-gray-700"
			>
				<h3 className="text-2xl font-bold text-white mb-6 text-center">
					How It Works
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{referralSteps.map((step, index) => (
						<motion.div
							key={step.step}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 + index * 0.1 }}
							className="text-center"
						>
							<div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-white font-bold text-lg">{step.step}</span>
							</div>
							<h4 className="text-lg font-semibold text-white mb-2">
								{step.title}
							</h4>
							<p className="text-gray-300">{step.description}</p>
						</motion.div>
					))}
				</div>
			</motion.div>

			{/* Stats Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6 }}
				className="grid grid-cols-1 md:grid-cols-3 gap-6"
			>
				<div className="bg-gradient-to-r from-cyan-900 to-blue-900 rounded-xl p-6 text-center border border-cyan-700">
					<div className="text-3xl font-bold text-cyan-400 mb-2">0</div>
					<div className="text-gray-300">Successful Referrals</div>
				</div>
				<div className="bg-gradient-to-r from-green-900 to-emerald-900 rounded-xl p-6 text-center border border-green-700">
					<div className="text-3xl font-bold text-green-400 mb-2">0</div>
					<div className="text-gray-300">Days Premium Access</div>
				</div>
				<div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl p-6 text-center border border-purple-700">
					<div className="text-3xl font-bold text-purple-400 mb-2">₹0</div>
					<div className="text-gray-300">Total Rewards Earned</div>
				</div>
			</motion.div>

			{/* Terms and Conditions */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.7 }}
				className="bg-[#18191b] rounded-xl p-6 border border-gray-700"
			>
				<h3 className="text-lg font-semibold text-white mb-4">Terms & Conditions</h3>
				<ul className="text-gray-300 space-y-2 text-sm">
					<li>• Referral rewards are valid for 30 days after successful signup</li>
					<li>• Both referrer and referee must have active accounts</li>
					<li>• Premium access includes all Pro features</li>
					<li>• Rewards are non-transferable and non-refundable</li>
					<li>• Talento AI reserves the right to modify terms at any time</li>
				</ul>
			</motion.div>
		</div>
	);
} 