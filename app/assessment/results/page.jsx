"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
	CheckCircleIcon,
	XCircleIcon,
	ArrowLeftIcon,
	ClockIcon,
	TrophyIcon,
	AcademicCapIcon,
	ChartBarIcon,
	UserIcon,
	CpuChipIcon,
	CodeBracketIcon,
	ChatBubbleLeftRightIcon,
	BriefcaseIcon,
	PlayCircleIcon,
	ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../dashboard/components/Sidebar";

export default function AssessmentResultsPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { user: authUser, loading: authLoading, signOut, supabase } = useAuth();
	const [results, setResults] = useState(null);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [activeTab, setActiveTab] = useState("assessment");

	useEffect(() => {
		// Parse results from URL params
		const resultsParam = searchParams.get('data');
		if (resultsParam) {
			try {
				const parsedResults = JSON.parse(decodeURIComponent(resultsParam));
				setResults(parsedResults);
			} catch (error) {
				console.error('Failed to parse results:', error);
				router.push('/dashboard?tab=assessment');
			}
		} else {
			router.push('/dashboard?tab=assessment');
		}
		setLoading(false);
	}, [searchParams, router]);

	useEffect(() => {
		if (authLoading) return; // Wait for auth to load

		if (!authUser) {
			router.push("/login");
			return;
		}

		const userObj = {
			name:
				authUser.user_metadata?.name ||
				authUser.user_metadata?.firstName ||
				authUser.email.split("@")[0],
			email: authUser.email,
			role: authUser.user_metadata?.role || "user",
			avatar: authUser.user_metadata?.avatar_url || "/avatar1.jpg",
		};

		setUser(userObj);
	}, [authUser, authLoading, router]);

	const handleLogout = async () => {
		await signOut();
		router.push("/");
	};

	const handleProfileClick = () => {
		router.push("/dashboard?tab=profile");
	};

	const handleTabChange = (tabId) => {
		setActiveTab(tabId);
		router.push(`/dashboard?tab=${tabId}`);
	};

	const getScoreColor = (percentage) => {
		if (percentage >= 80) return "text-green-400";
		if (percentage >= 60) return "text-yellow-400";
		return "text-red-400";
	};

	const getScoreGradient = (percentage) => {
		if (percentage >= 80) return "from-green-500 to-emerald-600";
		if (percentage >= 60) return "from-yellow-500 to-amber-600";
		return "from-red-500 to-rose-600";
	};

	const getPerformanceLevel = (percentage) => {
		if (percentage >= 90) return { level: "Excellent", emoji: "🏆" };
		if (percentage >= 80) return { level: "Very Good", emoji: "⭐" };
		if (percentage >= 70) return { level: "Good", emoji: "👍" };
		if (percentage >= 60) return { level: "Average", emoji: "📈" };
		return { level: "Needs Improvement", emoji: "💪" };
	};

	const getAssessmentIcon = (type) => {
		switch (type) {
			case 'aptitude':
				return CpuChipIcon;
			case 'technical':
				return CodeBracketIcon;
			case 'communication':
				return ChatBubbleLeftRightIcon;
			case 'personality':
				return UserIcon;
			default:
				return TrophyIcon;
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-400"></div>
			</div>
		);
	}

	if (!results) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
				<div className="text-center">
					<p className="text-white text-xl mb-4">No results found</p>
					<Link
						href="/dashboard?tab=assessment"
						className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 inline-flex items-center gap-2"
					>
						<ArrowLeftIcon className="h-5 w-5" />
						Go to Assessment Tab
					</Link>
				</div>
			</div>
		);
	}

	const percentage = Math.round((results.score / results.totalQuestions) * 100);
	const performance = getPerformanceLevel(percentage);

	if (!user) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#232425] transition-colors duration-300">
			{/* Sidebar */}
			<Sidebar
				user={user}
				sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}
				activeTab={activeTab}
				setActiveTab={handleTabChange}
				ChartBarIcon={ChartBarIcon}
				ChatBubbleLeftRightIcon={ChatBubbleLeftRightIcon}
				PlayCircleIcon={PlayCircleIcon}
				BriefcaseIcon={BriefcaseIcon}
				ArrowTrendingUpIcon={ArrowTrendingUpIcon}
				onProfileClick={handleProfileClick}
				onLogout={handleLogout}
			/>

			{/* Main Content Area */}
			<div
				className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${sidebarOpen ? "ml-72" : "ml-16"
					}`}
			>
				{/* Main Content */}
				<div className="flex-1 flex flex-col items-center justify-start py-10 px-4 bg-[#0f0f0f] w-full transition-colors duration-300">
					<div
						className={`w-full max-w-5xl bg-[#1a1a1a] border border-gray-800 rounded-2xl shadow-lg p-8 transition-all duration-300 ${sidebarOpen ? "ml-0" : "mx-auto max-w-4xl"
							}`}
					>
				{/* Header with Back Button */}
				<div className="flex items-center mb-8">
					<button
						onClick={() => router.push('/dashboard?tab=assessment')}
						className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors duration-200 group"
					>
						<ArrowLeftIcon className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" />
						Go to Assessment Tab
					</button>
				</div>

				{/* Main Results Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 mb-8"
				>
					{/* Header */}
					<div className="text-center mb-8">
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
							className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center"
						>
							{React.createElement(getAssessmentIcon(results.assessmentType), { 
								className: "w-12 h-12 text-white" 
							})}
						</motion.div>
						<h1 className="text-4xl font-bold text-white mb-2">
							Assessment Complete! {performance.emoji}
						</h1>
						<p className="text-gray-300 text-lg capitalize">
							{results.assessmentType} Assessment • {results.jobRole}
						</p>
					</div>

					{/* Score Overview */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						{/* Score */}
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.4 }}
							className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-2xl p-6 text-center"
						>
							<div className={`text-5xl font-bold ${getScoreColor(percentage)} mb-2`}>
								{percentage}%
							</div>
							<p className="text-gray-300 text-sm">Overall Score</p>
							<p className={`text-lg font-semibold ${getScoreColor(percentage)} mt-1`}>
								{performance.level}
							</p>
						</motion.div>

						{/* Correct Answers */}
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.5 }}
							className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-2xl p-6 text-center"
						>
							<div className="flex items-center justify-center mb-2">
								<CheckCircleIcon className="w-8 h-8 text-green-400 mr-2" />
								<span className="text-3xl font-bold text-white">
									{results.score}/{results.totalQuestions}
								</span>
							</div>
							<p className="text-gray-300 text-sm">Correct Answers</p>
						</motion.div>

						{/* Time Taken */}
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.6 }}
							className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-2xl p-6 text-center"
						>
							<div className="flex items-center justify-center mb-2">
								<ClockIcon className="w-8 h-8 text-blue-400 mr-2" />
								<span className="text-3xl font-bold text-white">
									{results.totalTime || 'N/A'}
								</span>
							</div>
							<p className="text-gray-300 text-sm">Total Time</p>
						</motion.div>
					</div>

					{/* Progress Bar */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.7 }}
						className="mb-8"
					>
						<div className="bg-gray-700 rounded-full h-4 mb-2">
							<motion.div
								initial={{ width: 0 }}
								animate={{ width: `${percentage}%` }}
								transition={{ delay: 0.8, duration: 1 }}
								className={`h-4 rounded-full bg-gradient-to-r ${getScoreGradient(percentage)}`}
							/>
						</div>
						<div className="flex justify-between text-sm text-gray-400">
							<span>0%</span>
							<span>100%</span>
						</div>
					</motion.div>
				</motion.div>

				{/* Personality Traits Display */}
				{results.personalityTraits && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8, duration: 0.6 }}
						className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 mb-8"
					>
						<div className="flex items-center mb-6">
							<UserIcon className="w-8 h-8 text-purple-400 mr-3" />
							<h2 className="text-2xl font-bold text-white">Personality Analysis</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{Object.entries(results.personalityTraits).map(([category, traits]) => (
								<div key={category} className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-2xl p-6">
									<h3 className="text-xl font-semibold text-white mb-4">{category}</h3>
									<div className="space-y-3">
										{Object.entries(traits).map(([trait, value]) => {
											const percentage = Math.round(value);
											return (
												<div key={trait}>
													<div className="flex justify-between mb-1">
														<span className="text-gray-300 text-sm">{trait}</span>
														<span className="text-purple-400 text-sm font-medium">{percentage}%</span>
													</div>
													<div className="bg-gray-600 rounded-full h-2">
														<motion.div
															initial={{ width: 0 }}
															animate={{ width: `${percentage}%` }}
															transition={{ delay: 1, duration: 0.8 }}
															className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
														/>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							))}
						</div>
					</motion.div>
				)}

				{/* Detailed Results */}
				{results.questions && results.questions.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.9, duration: 0.6 }}
						className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8"
					>
						<div className="flex items-center mb-6">
							<ChartBarIcon className="w-8 h-8 text-cyan-400 mr-3" />
							<h2 className="text-2xl font-bold text-white">
								{results.assessmentType === 'communication' ? 'Response Analysis' : 'Question Analysis'}
							</h2>
						</div>

						<div className="space-y-6">
							{results.questions.map((item, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 1 + index * 0.1 }}
									className={`border rounded-xl p-6 transition-all duration-200 ${
										item.isCorrect
											? 'border-green-500/30 bg-green-900/20'
											: 'border-red-500/30 bg-red-900/20'
									}`}
								>
									<div className="flex items-start justify-between mb-4">
										<div className="flex items-center">
											<div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
												item.isCorrect ? 'bg-green-500' : 'bg-red-500'
											}`}>
												{item.isCorrect ? (
													<CheckCircleIcon className="w-5 h-5 text-white" />
												) : (
													<XCircleIcon className="w-5 h-5 text-white" />
												)}
											</div>
											<span className="text-white font-semibold">
												Question {index + 1}
											</span>
										</div>
										{item.timeTaken && (
											<div className="flex items-center text-gray-400 text-sm">
												<ClockIcon className="w-4 h-4 mr-1" />
												{item.timeTaken}s
											</div>
										)}
									</div>

									<div className="mb-4">
										<p className="text-gray-100 text-lg mb-3 leading-relaxed">
											{item.questionText}
										</p>
										
										{item.questionOptions && item.questionOptions.length > 0 ? (
											<div className="grid gap-2 mb-4">
												{item.questionOptions.map((option, optIndex) => {
													const isUserAnswer = item.userAnswer === option;
													const isCorrectAnswer = item.correctAnswer === option;
													
													return (
														<div
															key={optIndex}
															className={`p-3 rounded-lg border text-sm transition-all ${
																isCorrectAnswer
																	? 'border-green-400 bg-green-900/30 text-green-100'
																	: isUserAnswer && !item.isCorrect
																	? 'border-red-400 bg-red-900/30 text-red-100'
																	: 'border-gray-600 bg-gray-800/30 text-gray-300'
															}`}
														>
															<div className="flex items-center justify-between">
																<span>{option}</span>
																<div className="flex items-center">
																	{isCorrectAnswer && (
																		<span className="text-green-400 text-xs ml-2">
																			✓ Correct
																		</span>
																	)}
																	{isUserAnswer && !isCorrectAnswer && (
																		<span className="text-red-400 text-xs ml-2">
																			Your answer
																		</span>
																	)}
																</div>
															</div>
														</div>
													);
												})}
											</div>
										) : (
											/* Open-ended question display for communication assessment */
											<div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-lg p-4 mb-4">
												<h4 className="text-blue-400 text-sm font-medium mb-2">Your Response:</h4>
												<p className="text-gray-200 leading-relaxed">
													{item.userAnswer || "No response provided"}
												</p>
											</div>
										)}
									</div>

									{item.correctAnswer !== "N/A" && (
										<div className="flex justify-between items-center text-sm">
											<div className="text-gray-400">
												<span className="font-medium">Your Answer: </span>
												<span className={item.isCorrect ? 'text-green-400' : 'text-red-400'}>
													{item.userAnswer || 'No answer'}
												</span>
											</div>
											<div className="text-gray-400">
												<span className="font-medium">Correct Answer: </span>
												<span className="text-green-400">{item.correctAnswer}</span>
											</div>
										</div>
									)}
								</motion.div>
							))}
						</div>
					</motion.div>
				)}

				{/* Enhanced Action Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.5, duration: 0.6 }}
					className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 mt-8"
				>
					<h3 className="text-2xl font-bold text-white text-center mb-6">What's Next?</h3>
					<div className="flex flex-col sm:flex-row gap-6 justify-center">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => router.push('/dashboard?tab=assessment')}
							className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-4 rounded-2xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-cyan-500/25"
						>
							<AcademicCapIcon className="w-6 h-6 mr-3" />
							<div className="text-left">
								<div className="font-bold">Go to Assessment Tab</div>
								<div className="text-sm opacity-80">Take more assessments</div>
							</div>
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => router.push('/dashboard?tab=progress')}
							className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-10 py-4 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-purple-500/25"
						>
							<ChartBarIcon className="w-6 h-6 mr-3" />
							<div className="text-left">
								<div className="font-bold">View Progress</div>
								<div className="text-sm opacity-80">Track your improvement</div>
							</div>
						</motion.button>
					</div>
				</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
}