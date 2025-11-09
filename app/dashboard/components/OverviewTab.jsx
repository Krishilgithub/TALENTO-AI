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
	const handleFileUpload = async (file) => {
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
			const uploadResult = await uploadResumeFile(file);
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
	};

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
	}, []); // Remove handleFileUpload dependency since it's a regular function

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
		setOptimizationResult(null);

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
		setAtsScoreResult(null);

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
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-7xl mx-auto">
					<div className="mb-8">
						<h2 className="text-3xl font-bold text-white mb-4">
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

						{/* Results Section */}
						{(optimizationResult || atsScoreResult) && (
							<div className="mt-6 space-y-4">
								{/* Optimization Results */}
								{optimizationResult && (
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-lg p-6"
									>
										<div className="flex items-center mb-4">
											<SparklesIcon className="h-6 w-6 text-cyan-400 mr-2" />
											<h3 className="text-lg font-semibold text-cyan-400">
												Resume Optimization Results
											</h3>
										</div>
										<div className="text-gray-200 text-sm leading-relaxed">
											<pre className="whitespace-pre-wrap font-sans">
												{optimizationResult.result || optimizationResult}
											</pre>
										</div>
									</motion.div>
								)}

								{/* ATS Score Results */}
								{atsScoreResult && (
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-lg p-6"
									>
										<div className="flex items-center mb-4">
											<ChartBarIcon className="h-6 w-6 text-purple-400 mr-2" />
											<h3 className="text-lg font-semibold text-purple-400">
												ATS Score Results
											</h3>
										</div>
										<div className="text-gray-200 text-sm leading-relaxed">
											<pre className="whitespace-pre-wrap font-sans">
												{atsScoreResult.analysis || atsScoreResult}
											</pre>
										</div>
									</motion.div>
								)}
							</div>
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
	);
}
