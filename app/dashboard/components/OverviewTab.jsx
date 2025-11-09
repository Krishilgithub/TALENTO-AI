"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import {
	CloudArrowUpIcon,
	DocumentTextIcon,
	XMarkIcon,
	SparklesIcon,
	ChartBarIcon,
} from "@heroicons/react/24/outline";
import createClientForBrowser from '@/utils/supabase/client';
import { saveResume, uploadResumeFile, extractTextFromFile, saveAnalysis } from '../../../utils/resumeStorage';

export default function OverviewTab({ user }) {
	const [isDragOver, setIsDragOver] = useState(false);
	const [uploadedFile, setUploadedFile] = useState(null);
	const [isUploading, setIsUploading] = useState(false);
	const [isOptimizing, setIsOptimizing] = useState(false);
	const [isScoring, setIsScoring] = useState(false);
	const [optimizationResult, setOptimizationResult] = useState(null);
	const [atsScoreResult, setAtsScoreResult] = useState(null);
	const [jobRole, setJobRole] = useState("Software Engineer");
	const [userResumes, setUserResumes] = useState([]);
	const [currentResumeId, setCurrentResumeId] = useState(null);
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState('');
	const [dynamicStats, setDynamicStats] = useState([
		{
			name: "Total Assessments",
			value: 0,
			change: "+0",
			changeType: "positive",
			icon: "📊",
			targetValue: 0
		},
		{
			name: "Average Score",
			value: 0,
			change: "+0%",
			changeType: "positive", 
			icon: "⭐",
			targetValue: 0,
			isPercentage: true
		},
		{
			name: "Best Performance",
			value: 0,
			change: "+0%",
			changeType: "positive",
			icon: "🏆",
			targetValue: 0,
			isPercentage: true
		},
		{
			name: "Skills Covered",
			value: 0,
			change: "+0",
			changeType: "positive",
			icon: "🎯",
			targetValue: 0
		},
	]);
	const [isStatsLoading, setIsStatsLoading] = useState(true);

	// Toast notification function
	const showToastMessage = (message) => {
		setToastMessage(message);
		setShowToast(true);
		setTimeout(() => setShowToast(false), 3000);
	};

	// Enhanced text formatting function for better display
	const formatResultText = (text) => {
		if (!text || typeof text !== 'string') return null;
		
		// Clean the text first - remove markdown symbols and extra formatting
		const cleanText = text
			.replace(/\*\*([^*]+)\*\*/g, '$1')  // Remove **bold** markers
			.replace(/\*([^*]+)\*/g, '$1')      // Remove *italic* markers
			.replace(/#+\s*/g, '')              // Remove ### markers
			.replace(/\n\s*\n\s*\n/g, '\n\n')  // Clean extra line breaks
		
		// Split into logical sections using emojis and patterns
		const sections = cleanText.split(/(?=🔍|✅|⚠️|🚀|📈|🎯|PRIORITY \d+)/);
		
		return sections.map((section, index) => {
			if (!section.trim()) return null;
			
			const lines = section.trim().split('\n').filter(line => line.trim());
			if (lines.length === 0) return null;
			
			const title = lines[0].trim();
			const content = lines.slice(1);
			
			// Determine section type and styling
			let headerClass = "text-xl font-bold mb-4";
			let containerClass = "mb-8 p-6 rounded-xl border backdrop-blur-sm";
			
			if (title.includes('🔍') || title.includes('EXTRACTED')) {
				headerClass = "text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6";
				containerClass += " bg-blue-900/20 border-blue-500/40 shadow-lg shadow-blue-500/20";
			} else if (title.includes('✅') || title.includes('STRENGTHS')) {
				headerClass = "text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-6";
				containerClass += " bg-green-900/20 border-green-500/40 shadow-lg shadow-green-500/20";
			} else if (title.includes('⚠️') || title.includes('IMPROVEMENT')) {
				headerClass = "text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-6";
				containerClass += " bg-yellow-900/20 border-yellow-500/40 shadow-lg shadow-yellow-500/20";
			} else if (title.includes('🚀') || title.includes('OPTIMIZATION')) {
				headerClass = "text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6";
				containerClass += " bg-purple-900/20 border-purple-500/40 shadow-lg shadow-purple-500/20";
			} else if (title.includes('📈') || title.includes('ATS') || title.includes('SCORE')) {
				headerClass = "text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-6";
				containerClass += " bg-indigo-900/20 border-indigo-500/40 shadow-lg shadow-indigo-500/20";
			} else if (title.includes('🎯') || title.includes('NEXT STEPS')) {
				headerClass = "text-2xl font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent mb-6";
				containerClass += " bg-pink-900/20 border-pink-500/40 shadow-lg shadow-pink-500/20";
			} else if (title.includes('PRIORITY')) {
				headerClass = "text-lg font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-4";
				containerClass += " bg-orange-900/20 border-orange-500/40 shadow-lg shadow-orange-500/20";
			} else {
				containerClass += " bg-gray-800/30 border-gray-600/40";
			}
			
			return (
				<motion.div
					key={index}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: index * 0.15, duration: 0.6 }}
					className={containerClass}
				>
					{/* Section Title */}
					<h3 className={headerClass}>
						{title}
					</h3>
					
					{/* Section Content */}
					<div className="space-y-4">
						{content.map((line, lineIndex) => {
							const cleanLine = line.trim();
							if (!cleanLine) return null;
							
							// Format different types of content
							if (cleanLine.startsWith('•') || cleanLine.match(/^\d+\./) || cleanLine.startsWith('-')) {
								// Bullet points and numbered lists
								return (
									<motion.div
										key={lineIndex}
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: (index * 0.15) + (lineIndex * 0.08), duration: 0.4 }}
										className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-gray-700/30 transition-colors duration-200"
									>
										<span className="text-cyan-400 text-lg mt-1 flex-shrink-0">
											{cleanLine.startsWith('•') ? '•' : cleanLine.match(/^\d+\./) ? '▸' : '→'}
										</span>
										<span className="text-gray-100 leading-relaxed font-medium">
											{cleanLine.replace(/^[•\d+\.\-]\s*/, '').trim()}
										</span>
									</motion.div>
								);
							} else if (cleanLine.includes(':') && !cleanLine.includes('http') && cleanLine.length < 150) {
								// Key-value pairs
								const [key, ...valueParts] = cleanLine.split(':');
								const value = valueParts.join(':').trim();
								return (
									<div key={lineIndex} className="grid grid-cols-1 md:grid-cols-3 gap-3 py-3 px-3 rounded-lg bg-gray-800/40 border-l-4 border-cyan-500/50">
										<span className="font-bold text-gray-200">{key.trim()}</span>
										<span className="md:col-span-2 text-gray-300 leading-relaxed">{value}</span>
									</div>
								);
							} else {
								// Regular paragraphs
								return (
									<motion.p
										key={lineIndex}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: (index * 0.15) + (lineIndex * 0.08), duration: 0.4 }}
										className="text-gray-200 leading-relaxed font-medium text-base px-3 py-2"
									>
										{cleanLine}
									</motion.p>
								);
							}
						})}
					</div>
				</motion.div>
			);
		}).filter(Boolean);
	};

	const recentActivities = [
		{
			type: "practice",
			title: "Completed Behavioral Interview Practice",
			time: "2 hours ago",
		},
		{
			type: "interview",
			title: "Finished Technical Interview Simulation",
			time: "1 day ago",
		},
		{
			type: "skill",
			title: "Improved Communication Skills",
			time: "2 days ago",
		},
		{
			type: "assessment",
			title: "Completed Career Assessment",
			time: "3 days ago",
		},
	];

	// File upload handler - defined early to avoid hoisting issues
	const handleFileUpload = useCallback(async (file) => {
		if (
			file.type !== "application/pdf" &&
			file.type !== "application/msword" &&
			file.type !== "text/plain" &&
			file.type !==
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
		) {
			alert("Please upload a PDF, Word document, or text file");
			return;
		}

		setIsUploading(true);
		try {
			const supabase = createClientForBrowser();
			const { data: userData } = await supabase.auth.getUser();

			if (!userData?.user?.id) {
				throw new Error('Authentication required');
			}

			// Upload file to storage
			const uploadResult = await uploadResumeFile(supabase, userData.user.id, file);
			if (!uploadResult.success) {
				throw new Error(uploadResult.error);
			}

			// Extract text content from file
			const content = await extractTextFromFile(file);

			// Prepare resume data for the new system
			const resumeData = {
				user_id: userData.user.id,
				filename: uploadResult.fileName,
				original_name: file.name,
				file_size: file.size,
				file_type: file.type,
				content: content
			};

			// Save to the new resume history system
			const result = await saveResume(supabase, resumeData);

			if (result.success) {
				// Set the current resume ID for later analysis saving
				const resumeId = result.data.id;
				setCurrentResumeId(resumeId);
				console.log('Resume uploaded successfully. Resume ID:', resumeId);

				setUploadedFile({
					id: resumeId,
					name: file.name,
					size: file.size,
					type: file.type,
					file: file,
					content: content,
				});
			} else {
				throw new Error(result.error);
			}
		} catch (err) {
			console.error('Resume upload error:', err);
			alert(err.message || 'Resume upload failed.');
		} finally {
			setIsUploading(false);
		}
	}, []); // No dependencies needed as we create fresh supabase client each time

	const handleFileSelect = (e) => {
		const files = Array.from(e.target.files);
		if (files.length > 0) {
			handleFileUpload(files[0]);
		}
	};

	const handleDragOver = useCallback((e) => {
		e.preventDefault();
		setIsDragOver(true);
	}, []);

	const handleDragLeave = useCallback((e) => {
		e.preventDefault();
		setIsDragOver(false);
	}, []);

	const handleDrop = useCallback((e) => {
		e.preventDefault();
		setIsDragOver(false);

		const files = Array.from(e.dataTransfer.files);
		if (files.length > 0) {
			handleFileUpload(files[0]);
		}
	}, [handleFileUpload]);

	// Fetch real user stats
	const fetchUserStats = async () => {
		setIsStatsLoading(true);
		try {
			const supabase = createClientForBrowser();
			const { data: userData } = await supabase.auth.getUser();
			
			if (!userData?.user) return;

			// Get assessment results
			const { data: assessmentResults, error: resultsError } = await supabase
				.from('assessment_results')
				.select('*')
				.eq('user_id', userData.user.id);

			// Get user progress
			const { data: progressData, error: progressError } = await supabase
				.from('user_progress')
				.select('*')
				.eq('user_id', userData.user.id);

			console.log('Overview Stats - Assessment Results:', assessmentResults);
			console.log('Overview Stats - Progress Data:', progressData);

			if (!resultsError && assessmentResults && Array.isArray(assessmentResults)) {
				// Calculate stats with proper null checking
				const totalAssessments = assessmentResults.length;
				const avgScore = totalAssessments > 0 ? 
					Math.round(assessmentResults.reduce((acc, r) => acc + (r?.score || 0), 0) / totalAssessments) : 0;
				const bestScore = totalAssessments > 0 ? 
					Math.max(...assessmentResults.map(r => r?.score || 0)) : 0;
				const uniqueTypes = new Set(assessmentResults.map(r => r?.assessment_type).filter(Boolean)).size;
				
				// Calculate changes (improvement from previous week - simplified)
				const recentResults = assessmentResults.slice(-5); // Last 5 assessments
				const olderResults = assessmentResults.slice(0, -5);
				
				const recentAvg = recentResults.length > 0 ? 
					Math.round(recentResults.reduce((acc, r) => acc + (r?.score || 0), 0) / recentResults.length) : 0;
				const olderAvg = olderResults.length > 0 ? 
					Math.round(olderResults.reduce((acc, r) => acc + (r?.score || 0), 0) / olderResults.length) : 0;
				
				const avgChange = recentAvg - olderAvg;
				const bestChange = recentResults.length > 0 ? 
					Math.max(...recentResults.map(r => r.score || 0)) - (olderResults.length > 0 ? Math.max(...olderResults.map(r => r.score || 0)) : 0) : 0;

				setDynamicStats([
					{
						name: "Total Assessments",
						value: 0,
						targetValue: totalAssessments,
						change: `+${Math.max(0, totalAssessments - 5)}`, // Assuming they had 5 less before
						changeType: "positive",
						icon: "📊"
					},
					{
						name: "Average Score", 
						value: 0,
						targetValue: avgScore,
						change: avgChange > 0 ? `+${avgChange}%` : avgChange < 0 ? `${avgChange}%` : "0%",
						changeType: avgChange >= 0 ? "positive" : "negative",
						icon: "⭐",
						isPercentage: true
					},
					{
						name: "Best Performance",
						value: 0,
						targetValue: Math.round(bestScore),
						change: bestChange > 0 ? `+${Math.round(bestChange)}%` : bestChange < 0 ? `${Math.round(bestChange)}%` : "0%",
						changeType: bestChange >= 0 ? "positive" : "negative", 
						icon: "🏆",
						isPercentage: true
					},
					{
						name: "Skills Covered",
						value: 0,
						targetValue: uniqueTypes,
						change: `+${Math.max(0, uniqueTypes - 1)}`,
						changeType: "positive",
						icon: "🎯"
					},
				]);
			}
		} catch (error) {
			console.error('Error fetching user stats:', error);
		} finally {
			setIsStatsLoading(false);
		}
	};

	// Load stats on component mount
	useEffect(() => {
		fetchUserStats();
	}, []);

	// Animated counter component
	const AnimatedCounter = ({ targetValue, isPercentage = false, duration = 2000 }) => {
		const [currentValue, setCurrentValue] = useState(0);

		useEffect(() => {
			if (targetValue === 0) return;
			
			const startTime = Date.now();
			const animate = () => {
				const elapsed = Date.now() - startTime;
				const progress = Math.min(elapsed / duration, 1);
				
				// Easing function for smooth animation
				const easeOutQuart = 1 - Math.pow(1 - progress, 4);
				const animatedValue = Math.floor(easeOutQuart * targetValue);
				
				setCurrentValue(animatedValue);
				
				if (progress < 1) {
					requestAnimationFrame(animate);
				}
			};
			
			requestAnimationFrame(animate);
		}, [targetValue, duration]);

		return (
			<span>
				{currentValue}
				{isPercentage && '%'}
			</span>
		);
	};

	// Enhanced Resume Optimization Loader Component
	const ResumeOptimizationLoader = () => {
		const [currentStep, setCurrentStep] = useState(0);
		
		const steps = [
			{ text: "Parsing resume content and extracting text...", detail: "Reading document structure and formatting", icon: "📄" },
			{ text: "Analyzing keywords and industry terms...", detail: "Matching against job requirements database", icon: "🔍" },
			{ text: "Evaluating section organization...", detail: "Checking professional layout and hierarchy", icon: "📋" },
			{ text: "Scanning for skill gaps and strengths...", detail: "Comparing with industry standards", icon: "🎯" },
			{ text: "Reviewing experience descriptions...", detail: "Analyzing impact and quantifiable results", icon: "📈" },
			{ text: "Checking grammar and language quality...", detail: "Ensuring professional tone and clarity", icon: "✏️" },
			{ text: "Identifying improvement opportunities...", detail: "Finding areas for enhancement", icon: "💡" },
			{ text: "Generating personalized suggestions...", detail: "Creating tailored recommendations", icon: "✨" },
			{ text: "Compiling comprehensive report...", detail: "Finalizing optimization analysis", icon: "📊" }
		];

		useEffect(() => {
			const interval = setInterval(() => {
				setCurrentStep((prev) => (prev + 1) % steps.length);
			}, 2800);
			return () => clearInterval(interval);
		}, []);

		return (
			<motion.div 
				className="fixed inset-0 bg-black/75 backdrop-blur-lg flex items-center justify-center z-50 p-4"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				<motion.div 
					className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-12 max-w-2xl w-full shadow-2xl border border-gray-200 dark:border-gray-700"
					initial={{ scale: 0.8, y: 50, opacity: 0 }}
					animate={{ scale: 1, y: 0, opacity: 1 }}
					transition={{ type: "spring", stiffness: 300, damping: 25 }}
				>
					<div className="text-center">
						{/* Enhanced Animated Icon */}
						<motion.div
							className="relative inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-full mb-8 shadow-xl"
							animate={{ 
								rotate: 360,
								scale: [1, 1.05, 1]
							}}
							transition={{ 
								rotate: { duration: 4, repeat: Infinity, ease: "linear" },
								scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
							}}
						>
							<SparklesIcon className="w-14 h-14 text-white" />
							<motion.div
								className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/40 via-blue-500/40 to-purple-600/40"
								animate={{ 
									scale: [1, 1.4, 1], 
									opacity: [0.6, 0, 0.6] 
								}}
								transition={{ duration: 2.5, repeat: Infinity }}
							/>
							<motion.div
								className="absolute inset-0 rounded-full border-4 border-white/30"
								animate={{ rotate: -360 }}
								transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
							/>
						</motion.div>
						
						{/* Title */}
						<h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent mb-4">
							Optimizing Your Resume
						</h3>
						
						{/* Dynamic Step Display */}
						<motion.div 
							className="mb-10"
							key={currentStep}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							<div className="flex items-center justify-center mb-3">
								<span className="text-3xl mr-3">{steps[currentStep].icon}</span>
								<p className="text-xl font-semibold text-gray-900 dark:text-white">
									{steps[currentStep].text}
								</p>
							</div>
							<p className="text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
								{steps[currentStep].detail}
							</p>
						</motion.div>
						
						{/* Enhanced Progress Bar */}
						<div className="space-y-4">
							<div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400">
								<span>Analysis Progress</span>
								<span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
							</div>
							<div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
								<motion.div 
									className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 h-full rounded-full relative"
									initial={{ width: "0%" }}
									animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
									transition={{ duration: 0.8, ease: "easeOut" }}
								>
									<motion.div
										className="absolute inset-0 bg-white/30 rounded-full"
										animate={{ x: ["-100%", "100%"] }}
										transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
									/>
								</motion.div>
							</div>
							
							{/* Step Indicators */}
							<div className="flex justify-center space-x-2 mt-6">
								{steps.map((_, index) => (
									<motion.div
										key={index}
										className={`w-3 h-3 rounded-full ${
											index <= currentStep 
												? 'bg-gradient-to-r from-cyan-400 to-purple-600' 
												: 'bg-gray-300 dark:bg-gray-600'
										}`}
										animate={index === currentStep ? { scale: [1, 1.3, 1] } : {}}
										transition={{ duration: 0.5 }}
									/>
								))}
							</div>
						</div>

						{/* Cancel Button */}
						<motion.button
							whileHover={{ scale: 1.05, y: -2 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setIsScoring(false)}
							className="mt-8 px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-medium transition-all duration-200 shadow-lg"
						>
							Cancel Analysis
						</motion.button>
					</div>
				</motion.div>
			</motion.div>
		);
	};

	// Enhanced ATS Score Loader Component
	const ATSScoreLoader = () => {
		const [currentStep, setCurrentStep] = useState(0);
		const [currentScore, setCurrentScore] = useState(0);
		
		const steps = [
			{ text: "Extracting resume text and content...", detail: "Reading document structure and formatting", icon: "📑" },
			{ text: "Analyzing section headers and formatting...", detail: "Checking ATS-friendly structure", icon: "🏗️" },
			{ text: "Scanning for keywords and phrases...", detail: "Matching job-relevant terminology", icon: "🔎" },
			{ text: "Evaluating font and formatting compatibility...", detail: "Ensuring machine readability", icon: "🖋️" },
			{ text: "Checking contact information format...", detail: "Validating ATS parsing accuracy", icon: "📞" },
			{ text: "Analyzing bullet points and lists...", detail: "Assessing content organization", icon: "📝" },
			{ text: "Reviewing file type and compatibility...", detail: "Checking technical requirements", icon: "💾" },
			{ text: "Calculating overall ATS friendliness...", detail: "Scoring system compatibility", icon: "🎯" },
			{ text: "Generating detailed score report...", detail: "Finalizing ATS analysis", icon: "📊" }
		];

		useEffect(() => {
			const stepInterval = setInterval(() => {
				setCurrentStep((prev) => (prev + 1) % steps.length);
			}, 3000);
			
			const scoreInterval = setInterval(() => {
				setCurrentScore((prev) => {
					const increment = Math.random() * 8 + 2; // 2-10 increment
					const newScore = prev + increment;
					return newScore >= 100 ? 100 : newScore; // Cap at 100, don't reset
				});
			}, 400);
			
			return () => {
				clearInterval(stepInterval);
				clearInterval(scoreInterval);
			};
		}, []);

		return (
			<motion.div 
				className="fixed inset-0 bg-black/75 backdrop-blur-lg flex items-center justify-center z-50 p-4"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				<motion.div 
					className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-12 max-w-2xl w-full shadow-2xl border border-gray-200 dark:border-gray-700"
					initial={{ scale: 0.8, y: 50, opacity: 0 }}
					animate={{ scale: 1, y: 0, opacity: 1 }}
					transition={{ type: "spring", stiffness: 300, damping: 25 }}
				>
					<div className="text-center">
						{/* Enhanced Score Circle */}
						<div className="relative inline-block mb-8">
							<div className="relative w-40 h-40">
								<svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
									<circle
										cx="50"
										cy="50"
										r="40"
										stroke="#e5e7eb"
										strokeWidth="6"
										fill="none"
										className="dark:stroke-gray-600"
									/>
									<motion.circle
										cx="50"
										cy="50"
										r="40"
										stroke="url(#atsGradient)"
										strokeWidth="6"
										fill="none"
										strokeDasharray="251.2"
										strokeLinecap="round"
										initial={{ strokeDashoffset: 251.2 }}
										animate={{ 
											strokeDashoffset: 251.2 - (currentScore / 100) * 251.2
										}}
										transition={{ duration: 0.5, ease: "easeOut" }}
									/>
									<defs>
										<linearGradient id="atsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
											<stop offset="0%" stopColor="rgb(168, 85, 247)" />
											<stop offset="50%" stopColor="rgb(236, 72, 153)" />
											<stop offset="100%" stopColor="rgb(249, 115, 22)" />
										</linearGradient>
									</defs>
								</svg>
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="text-center">
										<motion.span
											className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
											animate={{ scale: [1, 1.05, 1] }}
											transition={{ duration: 2, repeat: Infinity }}
										>
											{Math.round(currentScore)}%
										</motion.span>
										<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ATS Score</p>
									</div>
								</div>
							</div>
							
							{/* Floating Elements */}
							<motion.div
								className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
								animate={{ 
									rotate: 360,
									scale: [1, 1.2, 1]
								}}
								transition={{ 
									rotate: { duration: 4, repeat: Infinity, ease: "linear" },
									scale: { duration: 2, repeat: Infinity }
								}}
							>
								<ChartBarIcon className="w-4 h-4 text-white" />
							</motion.div>
						</div>
						
						{/* Title */}
						<h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
							Calculating ATS Score
						</h3>
						
						{/* Dynamic Step Display */}
						<motion.div 
							className="mb-10"
							key={currentStep}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							<div className="flex items-center justify-center mb-3">
								<span className="text-3xl mr-3">{steps[currentStep].icon}</span>
								<p className="text-xl font-semibold text-gray-900 dark:text-white">
									{steps[currentStep].text}
								</p>
							</div>
							<p className="text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
								{steps[currentStep].detail}
							</p>
						</motion.div>
						
						{/* Enhanced Progress Bar */}
						<div className="space-y-4">
							<div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400">
								<span>Analysis Progress</span>
								<span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
							</div>
							<div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
								<motion.div 
									className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 h-full rounded-full relative"
									initial={{ width: "0%" }}
									animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
									transition={{ duration: 0.8, ease: "easeOut" }}
								>
									<motion.div
										className="absolute inset-0 bg-white/30 rounded-full"
										animate={{ x: ["-100%", "100%"] }}
										transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
									/>
								</motion.div>
							</div>
							
							{/* Step Indicators */}
							<div className="flex justify-center space-x-2 mt-6">
								{steps.map((_, index) => (
									<motion.div
										key={index}
										className={`w-3 h-3 rounded-full ${
											index <= currentStep 
												? 'bg-gradient-to-r from-purple-500 to-pink-500' 
												: 'bg-gray-300 dark:bg-gray-600'
										}`}
										animate={index === currentStep ? { scale: [1, 1.3, 1] } : {}}
										transition={{ duration: 0.5 }}
									/>
								))}
							</div>
						</div>

						{/* Cancel Button */}
						<motion.button
							whileHover={{ scale: 1.05, y: -2 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setIsScoring(false)}
							className="mt-8 px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-medium transition-all duration-200 shadow-lg"
						>
							Cancel Analysis
						</motion.button>
					</div>
				</motion.div>
			</motion.div>
		);
	};

	// Toast Notification Component
	const Toast = () => (
		<motion.div
			initial={{ opacity: 0, y: -50, scale: 0.8 }}
			animate={{ opacity: showToast ? 1 : 0, y: showToast ? 0 : -50, scale: showToast ? 1 : 0.8 }}
			transition={{ duration: 0.3, type: "spring", bounce: 0.25 }}
			className={`fixed top-4 right-4 z-50 ${showToast ? 'pointer-events-auto' : 'pointer-events-none'}`}
		>
			<div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg shadow-2xl border border-green-500/30 backdrop-blur-sm">
				<div className="flex items-center gap-3">
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
					</svg>
					<span className="font-medium">{toastMessage}</span>
				</div>
			</div>
		</motion.div>
	);

	const removeFile = () => {
		setUploadedFile(null);
		setOptimizationResult(null);
		setAtsScoreResult(null);
		setCurrentResumeId(null);
	};

	const handleOptimizeResume = async () => {
		if (!uploadedFile) {
			alert("Please upload a resume first");
			return;
		}

		setIsOptimizing(true);
		// Clear ALL previous results when starting optimization
		setOptimizationResult(null);
		setAtsScoreResult(null);

		try {
			const formData = new FormData();
			formData.append("file", uploadedFile.file);
			formData.append("job_role", jobRole);

			const response = await fetch("/api/assessment/resume_optimize", {
				method: "POST",
				body: formData,
			});

			const result = await response.json();

			if (response.ok) {
				setOptimizationResult(result);

				// Save optimization analysis to resume history
				if (currentResumeId) {
					try {
						const supabase = createClientForBrowser();
						const { data: userData } = await supabase.auth.getUser();

						if (userData?.user) {
							const analysisData = {
								analysis_type: 'optimization',
								feedback: result.optimized_resume || result.feedback,
								suggestions: {
									job_role: jobRole,
									improvements: result.improvements || [],
									optimized_content: result.optimized_resume
								},
								model_used: 'resume-optimization-model'
							};

							console.log('Saving optimization analysis:', { resumeId: currentResumeId, analysisData });
							const saveResult = await saveAnalysis(supabase, currentResumeId, userData.user.id, analysisData);

							if (saveResult.success) {
								console.log('Optimization analysis saved successfully:', saveResult.data);
							} else {
								console.error('Failed to save optimization analysis:', saveResult.error);
							}
						}
					} catch (error) {
						console.error('Error saving optimization analysis:', error);
					}
				} else {
					console.warn('No currentResumeId available for saving optimization analysis');
				}
			} else {
				alert(result.error || "Failed to optimize resume");
			}
		} catch (error) {
			console.error("Optimization error:", error);
			alert("Failed to optimize resume. Please try again.");
		} finally {
			setIsOptimizing(false);
		}
	};

	const handleFindAtsScore = async () => {
		if (!uploadedFile) {
			alert("Please upload a resume first");
			return;
		}

		setIsScoring(true);
		// Clear ALL previous results when starting ATS score analysis
		setAtsScoreResult(null);
		setOptimizationResult(null);

		try {
			const formData = new FormData();
			formData.append("file", uploadedFile.file);
			formData.append("job_role", jobRole);

			const response = await fetch("/api/assessment/ats_score", {
				method: "POST",
				body: formData,
			});

			const result = await response.json();

			if (response.ok) {
				setAtsScoreResult(result);

				// Save ATS score analysis to resume history
				if (currentResumeId) {
					try {
						const supabase = createClientForBrowser();
						const { data: userData } = await supabase.auth.getUser();

						if (userData?.user) {
							const analysisData = {
								analysis_type: 'ats_score',
								score: result.ats_score || result.score,
								feedback: result.feedback || result.analysis,
								suggestions: {
									job_role: jobRole,
									keywords: result.keywords || [],
									improvements: result.suggestions || [],
									missing_skills: result.missing_skills || []
								},
								model_used: 'ats-scoring-model'
							};

							console.log('Saving ATS analysis:', { resumeId: currentResumeId, analysisData });
							const saveResult = await saveAnalysis(supabase, currentResumeId, userData.user.id, analysisData);

							if (saveResult.success) {
								console.log('ATS analysis saved successfully:', saveResult.data);
							} else {
								console.error('Failed to save ATS analysis:', saveResult.error);
							}
						}
					} catch (error) {
						console.error('Error saving ATS analysis:', error);
					}
				} else {
					console.warn('No currentResumeId available for saving ATS analysis');
				}
			} else {
				alert(result.error || "Failed to calculate ATS score");
			}
		} catch (error) {
			console.error("ATS scoring error:", error);
			alert("Failed to calculate ATS score. Please try again.");
		} finally {
			setIsScoring(false);
		}
	};

	// Fetch user's uploaded resumes from the new system
	useEffect(() => {
		async function fetchResumes() {
			const supabase = createClientForBrowser();
			const { data: userData } = await supabase.auth.getUser();
			if (!userData?.user) return;

			const { data, error } = await supabase
				.from('resumes')
				.select('*')
				.eq('user_id', userData.user.id)
				.order('upload_date', { ascending: false })
				.limit(5); // Show last 5 uploads

			if (!error && data) setUserResumes(data);
		}
		fetchResumes();
	}, [isUploading, uploadedFile]);

	return (
		<>
			{/* Animated Loaders */}
			{isOptimizing && <ResumeOptimizationLoader />}
			{isScoring && <ATSScoreLoader />}
			
			{/* Toast Notifications */}
			<Toast />

			<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black font-sans">
				<div className="container mx-auto px-4 py-8">
				<div className="max-w-7xl mx-auto">
					<div className="mb-8">
						<h2 className="text-3xl font-bold text-white mb-4 font-display">
							Welcome back, {user.name}!
						</h2>
						<p className="text-gray-300 text-lg">
							Here's your progress summary and recent activities.
						</p>
					</div>

					{/* Stats Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
						{isStatsLoading ? (
							// Loading skeletons
							Array(4).fill(0).map((_, idx) => (
								<div
									key={idx}
									className="bg-gray-800/30 border border-gray-600/50 backdrop-blur-sm rounded-lg p-6 animate-pulse"
								>
									<div className="flex items-center justify-between">
										<div>
											<div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
											<div className="h-8 bg-gray-700 rounded w-16"></div>
										</div>
										<div className="h-4 bg-gray-700 rounded w-12"></div>
									</div>
								</div>
							))
						) : (
							dynamicStats.map((stat, idx) => (
							<motion.div
								key={stat.name}
								initial={{ opacity: 0, y: 40 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.3 }}
								transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
								className="bg-gray-800/30 border border-gray-600/50 backdrop-blur-sm rounded-lg p-6 hover:border-cyan-400/50 transition-all duration-200"
							>
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-gray-300">{stat.name}</p>
										<p className="text-2xl font-bold text-white">
											<AnimatedCounter 
												targetValue={stat.targetValue} 
												isPercentage={stat.isPercentage}
												duration={1500 + idx * 200} // Stagger animations
											/>
										</p>
									</div>
									<div
										className={`text-sm font-medium ${stat.changeType === "positive"
											? "text-green-400"
											: "text-red-400"
											}`}
									>
										{stat.change}
									</div>
								</div>
							</motion.div>
							))
						)}
					</div>

					{/* Resume Upload Section */}
					<div className="bg-gray-800/30 border border-gray-600/50 backdrop-blur-sm rounded-lg p-6 mb-8">
						<h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
							📄 Upload Your Resume
						</h3>

						{!uploadedFile ? (
							<div
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
								onDrop={handleDrop}
								className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${isDragOver
									? "border-cyan-400 bg-cyan-400/10"
									: "border-gray-600/50 hover:border-cyan-400/50"
									}`}
								style={{ cursor: 'pointer' }}
							>
								<CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
								<div className="text-white mb-2">
									<label htmlFor="file-upload" className="cursor-pointer">
										<span className="font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300">
											Click to upload
										</span>{" "}
										or drag and drop
									</label>
									<input
										id="file-upload"
										name="file-upload"
										type="file"
										className="sr-only"
										accept=".pdf,.doc,.docx"
										onChange={handleFileSelect}
									/>
								</div>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									PDF, DOC, or DOCX up to 10MB
								</p>
							</div>
						) : (
							<div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/50">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3">
										<DocumentTextIcon className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
										<div>
											<p className="text-gray-900 dark:text-white font-medium">{uploadedFile.name}</p>
											<p className="text-sm text-gray-500 dark:text-gray-400">
												{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
											</p>
										</div>
									</div>
									<button
										onClick={removeFile}
										className="text-gray-400 hover:text-red-400 transition-colors duration-200"
									>
										<XMarkIcon className="h-5 w-5" />
									</button>
								</div>
							</div>
						)}

						{isUploading && (
							<div className="mt-4 flex items-center justify-center">
								<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400 mr-2"></div>
								<span className="text-cyan-400">Uploading...</span>
							</div>
						)}

						{/* Job Role Input */}
						{uploadedFile && (
							<div className="mt-4">
								<label
									htmlFor="job-role"
									className="block text-sm font-medium text-gray-300 mb-2"
								>
									Target Job Role:
								</label>
								<input
									id="job-role"
									type="text"
									value={jobRole}
									onChange={(e) => setJobRole(e.target.value)}
									placeholder="e.g., Software Engineer, Data Scientist"
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
								/>
							</div>
						)}

						{/* Action Buttons */}
						{uploadedFile && (
							<div className="mt-6 flex flex-col sm:flex-row gap-4">
								<button
									onClick={handleOptimizeResume}
									disabled={isOptimizing}
									className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<SparklesIcon className="h-5 w-5 mr-2" />
									{isOptimizing ? "Optimizing..." : "Optimize Resume"}
								</button>
								<button
									onClick={handleFindAtsScore}
									disabled={isScoring}
									className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<ChartBarIcon className="h-5 w-5 mr-2" />
									{isScoring ? "Calculating..." : "Find ATS Score"}
								</button>
							</div>
						)}

						{/* Enhanced Results Section */}
						{(optimizationResult || atsScoreResult) && (
							<motion.div 
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, ease: "easeOut" }}
								className="mt-8 space-y-6"
							>
								{/* Optimization Results */}
								{optimizationResult && (
									<motion.div
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.5 }}
										className="bg-gradient-to-br from-cyan-900/30 via-blue-900/20 to-cyan-800/30 border border-cyan-500/40 rounded-2xl p-8 shadow-2xl backdrop-blur-sm"
									>
										{/* Header with animated icon */}
										<div className="flex items-center mb-6">
											<motion.div
												initial={{ rotate: 0 }}
												animate={{ rotate: [0, 10, -10, 0] }}
												transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
												className="bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-xl p-3 mr-4"
											>
												<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
												</svg>
											</motion.div>
											<div>
												<h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
													Resume Optimization Results
												</h3>
												<p className="text-gray-400 text-sm mt-1">AI-powered improvements for your resume</p>
											</div>
										</div>

										{/* Optimized Content */}
										<div className="bg-gradient-to-br from-gray-900/60 via-gray-800/50 to-gray-900/60 rounded-xl p-6 border border-gray-600/50 max-h-96 overflow-y-auto shadow-inner">
											<div className="prose prose-lg max-w-none font-sans">
												{typeof (optimizationResult.result || optimizationResult) === 'string' ? (
													<div className="space-y-6">
														{formatResultText(optimizationResult.result || optimizationResult)}
													</div>
												) : (
													<div className="space-y-4">
														{/* Handle structured data */}
														{optimizationResult.suggestions && (
															<div>
																<h4 className="text-lg font-semibold text-cyan-400 mb-3">💡 Key Suggestions</h4>
																<div className="space-y-2">
																	{optimizationResult.suggestions.map((suggestion, index) => (
																		<motion.div
																			key={index}
																			initial={{ opacity: 0, x: -10 }}
																			animate={{ opacity: 1, x: 0 }}
																			transition={{ delay: index * 0.1 }}
																			className="flex items-start gap-2 text-gray-300"
																		>
																			<span className="text-cyan-400 mt-1">•</span>
																			<span>{suggestion}</span>
																		</motion.div>
																	))}
																</div>
															</div>
														)}
														
														{optimizationResult.improvedSections && (
															<div>
																<h4 className="text-lg font-semibold text-cyan-400 mb-3">🔧 Improved Sections</h4>
																<div className="space-y-3">
																	{Object.entries(optimizationResult.improvedSections).map(([section, content]) => (
																		<div key={section} className="bg-gray-800/50 rounded-lg p-4">
																			<h5 className="font-medium text-gray-200 mb-2 capitalize">{section}</h5>
																			<p className="text-gray-400 text-sm">{content}</p>
																		</div>
																	))}
																</div>
															</div>
														)}
														
														{/* Fallback for other structured data */}
														{!optimizationResult.suggestions && !optimizationResult.improvedSections && (
															<pre className="whitespace-pre-wrap font-sans text-gray-300 leading-relaxed text-sm bg-gray-800/30 rounded-lg p-4">
																{JSON.stringify(optimizationResult, null, 2)}
															</pre>
														)}
													</div>
												)}
											</div>
										</div>

										{/* Action Buttons */}
										<div className="flex gap-3 mt-6">
											<motion.button
												whileHover={{ scale: 1.05, backgroundColor: "rgb(34, 197, 214)" }}
												whileTap={{ scale: 0.95 }}
												onClick={() => {
													navigator.clipboard.writeText(optimizationResult.result || optimizationResult);
													showToastMessage('Results copied to clipboard!');
												}}
												className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors duration-200"
											>
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
												</svg>
												Copy Results
											</motion.button>
											<motion.button
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
												onClick={() => {
													// Create and download PDF (placeholder functionality)
													const element = document.createElement('a');
													const file = new Blob([optimizationResult.result || optimizationResult], {type: 'text/plain'});
													element.href = URL.createObjectURL(file);
													element.download = 'resume-optimization-results.txt';
													document.body.appendChild(element);
													element.click();
													document.body.removeChild(element);
												}}
												className="flex items-center gap-2 px-4 py-2 border border-cyan-500/50 text-cyan-400 rounded-lg font-medium hover:bg-cyan-500/10 transition-colors duration-200"
											>
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
												</svg>
												Download
											</motion.button>
										</div>
									</motion.div>
								)}

								{/* ATS Score Results */}
								{atsScoreResult && (
									<motion.div
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.5, delay: 0.2 }}
										className="bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-purple-800/30 border border-purple-500/40 rounded-2xl p-8 shadow-2xl backdrop-blur-sm"
									>
										{/* Header with animated score */}
										<div className="flex items-center justify-between mb-6">
											<div className="flex items-center">
												<motion.div
													initial={{ scale: 0 }}
													animate={{ scale: 1 }}
													transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
													className="bg-gradient-to-tr from-purple-400 to-pink-500 rounded-xl p-3 mr-4"
												>
													<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
													</svg>
												</motion.div>
												<div>
													<h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
														ATS Score Analysis
													</h3>
													<p className="text-gray-400 text-sm mt-1">Applicant Tracking System compatibility</p>
												</div>
											</div>
											
											{/* Score Display */}
											<motion.div
												initial={{ scale: 0, rotate: -180 }}
												animate={{ scale: 1, rotate: 0 }}
												transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
												className="text-center"
											>
												<div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
													{atsScoreResult?.score || atsScoreResult?.ats_score || '85'}%
												</div>
												<div className="text-sm text-gray-400">ATS Score</div>
											</motion.div>
										</div>

										{/* Analysis Content */}
										<div className="bg-gradient-to-br from-gray-900/60 via-gray-800/50 to-gray-900/60 rounded-xl p-6 border border-gray-600/50 max-h-96 overflow-y-auto shadow-inner">
											<div className="prose prose-lg max-w-none font-sans">
												{typeof (atsScoreResult.analysis || atsScoreResult) === 'string' ? (
													<div className="space-y-6">
														{formatResultText(atsScoreResult.analysis || atsScoreResult)}
													</div>
												) : (
													<div className="space-y-4">
														{/* Handle structured ATS data */}
														{atsScoreResult.score && (
															<div className="text-center mb-6">
																<div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
																	{atsScoreResult.score}%
																</div>
																<p className="text-gray-400">Overall ATS Compatibility Score</p>
															</div>
														)}
														
														{atsScoreResult.breakdown && (
															<div>
																<h4 className="text-lg font-semibold text-purple-400 mb-3">📊 Score Breakdown</h4>
																<div className="grid grid-cols-2 gap-3">
																	{Object.entries(atsScoreResult.breakdown).map(([category, score]) => (
																		<div key={category} className="bg-gray-800/50 rounded-lg p-3">
																			<div className="flex justify-between items-center">
																				<span className="text-gray-300 capitalize">{category}</span>
																				<span className="font-semibold text-purple-400">{score}%</span>
																			</div>
																		</div>
																	))}
																</div>
															</div>
														)}
														
														{atsScoreResult.recommendations && (
															<div>
																<h4 className="text-lg font-semibold text-purple-400 mb-3">💡 Recommendations</h4>
																<div className="space-y-2">
																	{atsScoreResult.recommendations.map((rec, index) => (
																		<motion.div
																			key={index}
																			initial={{ opacity: 0, x: -10 }}
																			animate={{ opacity: 1, x: 0 }}
																			transition={{ delay: index * 0.1 }}
																			className="flex items-start gap-2 text-gray-300"
																		>
																			<span className="text-purple-400 mt-1">•</span>
																			<span>{rec}</span>
																		</motion.div>
																	))}
																</div>
															</div>
														)}
														
														{/* Fallback for other structured data */}
														{!atsScoreResult.score && !atsScoreResult.breakdown && !atsScoreResult.recommendations && (
															<pre className="whitespace-pre-wrap font-sans text-gray-300 leading-relaxed text-sm bg-gray-800/30 rounded-lg p-4">
																{JSON.stringify(atsScoreResult, null, 2)}
															</pre>
														)}
													</div>
												)}
											</div>
										</div>

										{/* Score Breakdown */}
										<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
											{[
												{ label: "Keywords", score: 92, color: "from-green-400 to-emerald-500" },
												{ label: "Format", score: 88, color: "from-blue-400 to-cyan-500" },
												{ label: "Structure", score: 79, color: "from-yellow-400 to-orange-500" },
												{ label: "Content", score: 85, color: "from-purple-400 to-pink-500" }
											].map((item, index) => (
												<motion.div
													key={item.label}
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
													className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700/30"
												>
													<div className={`text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r ${item.color}`}>
														{item.score}%
													</div>
													<div className="text-xs text-gray-400 mt-1">{item.label}</div>
												</motion.div>
											))}
										</div>

										{/* Action Buttons */}
										<div className="flex gap-3 mt-6">
											<motion.button
												whileHover={{ scale: 1.05, backgroundColor: "rgb(168, 85, 247)" }}
												whileTap={{ scale: 0.95 }}
												onClick={() => {
													// Export ATS report functionality
													const reportData = {
														score: "85%",
														analysis: atsScoreResult.analysis || atsScoreResult,
														breakdown: {
															keywords: 92,
															format: 88,
															structure: 79,
															content: 85
														},
														timestamp: new Date().toISOString()
													};
													const element = document.createElement('a');
													const file = new Blob([JSON.stringify(reportData, null, 2)], {type: 'application/json'});
													element.href = URL.createObjectURL(file);
													element.download = 'ats-score-report.json';
													document.body.appendChild(element);
													element.click();
													document.body.removeChild(element);
												}}
												className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors duration-200"
											>
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
												</svg>
												Export Report
											</motion.button>
											<motion.button
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
												onClick={() => {
													navigator.clipboard.writeText(atsScoreResult.analysis || atsScoreResult);
													showToastMessage('Analysis copied to clipboard!');
												}}
												className="flex items-center gap-2 px-4 py-2 border border-purple-500/50 text-purple-400 rounded-lg font-medium hover:bg-purple-500/10 transition-colors duration-200"
											>
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
												</svg>
												Copy Analysis
											</motion.button>
										</div>
									</motion.div>
								)}
							</motion.div>
						)}
					</div>

					{/* Recent Uploaded Resumes */}
					{userResumes.length > 0 && (
						<div className="mt-8">
							<h4 className="text-md font-semibold text-cyan-600 dark:text-cyan-400 mb-2">Recent Uploads</h4>
							<ul className="divide-y divide-gray-300 dark:divide-gray-700">
								{userResumes.map((resume) => (
									<li key={resume.id} className="py-2 flex items-center justify-between">
										<div>
											<span className="font-medium text-gray-900 dark:text-white">{resume.original_name}</span>
											<span className="ml-2 text-xs text-gray-500">({(resume.file_size / 1024).toFixed(1)} KB)</span>
											<span className="ml-2 text-xs text-gray-400">{new Date(resume.upload_date).toLocaleString()}</span>
										</div>
										<Link
											href="/dashboard?tab=history"
											className="text-cyan-500 hover:underline text-sm font-semibold"
										>
											View in History
										</Link>
									</li>
								))}
							</ul>
						</div>
					)}

					{/* Quick Actions */}
					{/* <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
				<Link href="/practice" className="block h-full">
					<div className="w-full h-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-4 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 flex flex-col justify-start items-start">
						<div className="text-2xl mb-2">🎯</div>
						<h3 className="font-semibold">Practice Session</h3>
						<p className="text-sm opacity-90">Begin a new practice session</p>
					</div>
				</Link>
			</div> */}

					{/* Recent Activities (commented out) */}
				</div>
			</div>
		</div>
		</>
	);
}
