"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import { CloudArrowUpIcon, DocumentTextIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function OverviewTab({ user }) {
	const [isDragOver, setIsDragOver] = useState(false);
	const [uploadedFile, setUploadedFile] = useState(null);
	const [isUploading, setIsUploading] = useState(false);

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

	const handleFileUpload = (file) => {
		if (file.type !== "application/pdf" && file.type !== "application/msword" && file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
			alert("Please upload a PDF or Word document");
			return;
		}

		setIsUploading(true);
		
		// Simulate upload
		setTimeout(() => {
			setUploadedFile({
				name: file.name,
				size: file.size,
				type: file.type
			});
			setIsUploading(false);
		}, 2000);
	};

	const removeFile = () => {
		setUploadedFile(null);
	};

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
			<div className="bg-[#18191b] rounded-lg p-6 border border-gray-700">
				<h3 className="text-lg font-semibold text-cyan-400 mb-4">
					📄 Upload Your Resume below
				</h3>
				
				{!uploadedFile ? (
					<div
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
							isDragOver
								? "border-cyan-400 bg-cyan-900/20"
								: "border-gray-600 hover:border-cyan-400"
						}`}
					>
						<CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
						<div className="text-white mb-2">
							<label htmlFor="file-upload" className="cursor-pointer">
								<span className="font-medium text-cyan-400 hover:text-cyan-300">
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
						<p className="text-xs text-gray-400">
							PDF, DOC, or DOCX up to 10MB
						</p>
					</div>
				) : (
					<div className="bg-[#232323] rounded-lg p-4 border border-gray-600">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<DocumentTextIcon className="h-8 w-8 text-cyan-400" />
								<div>
									<p className="text-white font-medium">{uploadedFile.name}</p>
									<p className="text-sm text-gray-400">
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
			</div>



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