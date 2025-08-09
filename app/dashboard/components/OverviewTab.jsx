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

	const stats = [
		{
			name: "Practice Sessions",
			value: "12",
			change: "+2",
			changeType: "positive",
		},
		{
			name: "Interviews Completed",
			value: "8",
			change: "+3",
			changeType: "positive",
		},
		{
			name: "Skills Improved",
			value: "15",
			change: "+5",
			changeType: "positive",
		},
		{
			name: "Confidence Score",
			value: "85%",
			change: "+12%",
			changeType: "positive",
		},
	];

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
	}, []);

	const handleFileSelect = (e) => {
		const files = Array.from(e.target.files);
		if (files.length > 0) {
			handleFileUpload(files[0]);
		}
	};

	const handleFileUpload = async (file) => {
		if (
			file.type !== "application/pdf" &&
			file.type !== "application/msword" &&
			file.type !==
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
		) {
			alert("Please upload a PDF or Word document");
			return;
		}

		setIsUploading(true);
		try {
			const supabase = createClientForBrowser();
			// Get user ID
			const { data: userData } = await supabase.auth.getUser();
			if (!userData?.user) {
				alert('You must be logged in to upload a resume.');
				setIsUploading(false);
				return;
			}
			const userId = userData.user.id;
			// Upload to Supabase Storage
			const fileExt = file.name.split('.').pop();
			const filePath = `resume/${userId}/${Date.now()}.${fileExt}`;
			const { error: uploadError } = await supabase.storage.from('resume').upload(filePath, file, { upsert: true });
			if (uploadError) {
				alert('Failed to upload file to storage. ' + uploadError.message);
				setIsUploading(false);
				return;
			}
			// Get public URL
			const { data: publicUrlData } = supabase.storage.from('resume').getPublicUrl(filePath);
			// Store metadata in user_resume table
			const { error: dbError } = await supabase.from('user_resume').insert([
				{
					user_id: userId,
					file_url: publicUrlData.publicUrl,
					uploaded_at: new Date().toISOString(),
					is_active: true,
					analysis_output: null, // or remove if not needed
				},
			]);
			if (dbError) {
				alert('Failed to save resume metadata.');
				setIsUploading(false);
				return;
			}
			setUploadedFile({
				name: file.name,
				size: file.size,
				type: file.type,
				file: file,
				url: publicUrlData.publicUrl,
			});
		} catch (err) {
			alert('Resume upload failed.');
		} finally {
			setIsUploading(false);
		}
	};

	const removeFile = () => {
		setUploadedFile(null);
		setOptimizationResult(null);
		setAtsScoreResult(null);
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

	// Fetch user's uploaded resumes
	useEffect(() => {
		async function fetchResumes() {
			const supabase = createClientForBrowser();
			const { data: userData } = await supabase.auth.getUser();
			if (!userData?.user) return;
			const { data, error } = await supabase
				.from('user_resume')
				.select('*')
				.eq('user_id', userData.user.id)
				.order('uploaded_at', { ascending: false });
			if (!error && data) setUserResumes(data);
		}
		fetchResumes();
	}, [isUploading, uploadedFile]);

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-xl font-semibold text-white mb-4">
					Welcome back, {user.name}!
				</h2>
				<p className="text-gray-300">
					Here's your progress summary and recent activities.
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{stats.map((stat, idx) => (
					<motion.div
						key={stat.name}
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
						className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-6 border border-gray-600"
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-300">{stat.name}</p>
								<p className="text-2xl font-bold text-white">{stat.value}</p>
							</div>
							<div
								className={`text-sm font-medium ${
									stat.changeType === "positive"
										? "text-green-400"
										: "text-red-400"
								}`}
							>
								{stat.change}
							</div>
						</div>
					</motion.div>
				))}
			</div>

			{/* Resume Upload Section */}
			<div className="bg-white dark:bg-[#18191b] rounded-lg p-6 border border-gray-300 dark:border-gray-700 transition-colors duration-300">
				<h3 className="text-lg font-semibold text-cyan-600 dark:text-cyan-400 mb-4">
					📄 Upload Your Resume below
				</h3>

				{!uploadedFile ? (
					<div
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
							isDragOver
								? "border-cyan-400 bg-cyan-100 dark:bg-cyan-900/20"
								: "border-gray-300 dark:border-gray-600 hover:border-cyan-400"
						}`}
						onClick={() => document.getElementById('file-upload')?.click()}
						style={{ cursor: 'pointer' }}
					>
						<CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
						<div className="text-gray-700 dark:text-white mb-2">
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
					<div className="bg-gray-100 dark:bg-[#232323] rounded-lg p-4 border border-gray-300 dark:border-gray-600 transition-colors duration-300">
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

			{/* Uploaded Resumes List */}
			{userResumes.length > 0 && (
				<div className="mt-8">
					<h4 className="text-md font-semibold text-cyan-600 dark:text-cyan-400 mb-2">Your Uploaded Resumes</h4>
					<ul className="divide-y divide-gray-300 dark:divide-gray-700">
						{userResumes.map((resume) => (
							<li key={resume.id} className="py-2 flex items-center justify-between">
								<div>
									<span className="font-medium text-gray-900 dark:text-white">{resume.file_name}</span>
									<span className="ml-2 text-xs text-gray-500">({resume.job_role})</span>
									<span className="ml-2 text-xs text-gray-400">{new Date(resume.uploaded_at).toLocaleString()}</span>
								</div>
								<a
									href={resume.file_url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-cyan-500 hover:underline text-sm font-semibold"
								>
									View
								</a>
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
	);
}
