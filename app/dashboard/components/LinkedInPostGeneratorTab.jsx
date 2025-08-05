import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	GlobeAltIcon,
	DocumentTextIcon,
	SparklesIcon,
	ClipboardDocumentIcon,
	CheckCircleIcon,
	ArrowPathIcon,
	LinkIcon,
	XCircleIcon,
} from "@heroicons/react/24/outline";

export default function LinkedInPostGeneratorTab() {
	const [postType, setPostType] = useState("Professional Insight");
	const [topic, setTopic] = useState("Career Development");
	const [postDescription, setPostDescription] = useState("");
	const [generatedPost, setGeneratedPost] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [isPosting, setIsPosting] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [accessToken, setAccessToken] = useState("");
	const [showSuccess, setShowSuccess] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		// Check if user is already connected to LinkedIn
		const token = localStorage.getItem("linkedin_access_token");
		if (token) {
			setAccessToken(token);
			setIsConnected(true);
		}
	}, []);

	const handleGeneratePost = async () => {
		if (!postDescription.trim()) {
			setError("Please enter a post description");
			return;
		}

		setIsGenerating(true);
		setError("");

		try {
			const formData = new FormData();
			formData.append("post_type", postType);
			formData.append("topic", topic);
			formData.append("post_description", postDescription);

			const response = await fetch("/api/assessment/linkedin_post", {
				method: "POST",
				body: formData,
			});

			const data = await response.json();

			if (data.error) {
				setError(data.error);
			} else if (data.post) {
				setGeneratedPost(data.post);
			} else {
				setError("No post was generated. Please try again.");
			}
		} catch (error) {
			console.error("Error generating post:", error);
			setError("Failed to generate post. Please try again.");
		} finally {
			setIsGenerating(false);
		}
	};

	const handleConnectLinkedIn = async () => {
		try {
			const response = await fetch("/api/linkedin/auth-url");
			const data = await response.json();

			if (data.error) {
				setError(data.error);
			} else if (data.auth_url) {
				// Redirect to LinkedIn OAuth
				window.location.href = data.auth_url;
			} else {
				setError("Failed to get LinkedIn authorization URL");
			}
		} catch (error) {
			console.error("Error connecting to LinkedIn:", error);
			setError("Failed to connect to LinkedIn. Please try again.");
		}
	};

	const handlePostToLinkedIn = async () => {
		if (!accessToken) {
			setError("Please connect to LinkedIn first");
			return;
		}

		if (!generatedPost.trim()) {
			setError("Please generate a post first");
			return;
		}

		setIsPosting(true);
		setError("");

		try {
			const formData = new FormData();
			formData.append("access_token", accessToken);
			formData.append("post_type", postType);
			formData.append("topic", topic);
			formData.append("post_description", postDescription);

			const response = await fetch("/api/linkedin/post-direct", {
				method: "POST",
				body: formData,
			});

			const data = await response.json();

			if (data.error) {
				setError(data.error);
			} else if (data.success) {
				setShowSuccess(true);
				setTimeout(() => setShowSuccess(false), 5000);
			} else {
				setError("Failed to post to LinkedIn. Please try again.");
			}
		} catch (error) {
			console.error("Error posting to LinkedIn:", error);
			setError("Failed to post to LinkedIn. Please try again.");
		} finally {
			setIsPosting(false);
		}
	};

	const handleCopyToClipboard = () => {
		navigator.clipboard.writeText(generatedPost);
		// You could add a toast notification here
	};

	const postTypes = [
		"Professional Insight",
		"Industry Update",
		"Career Advice",
		"Networking",
	];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center space-x-3">
				<GlobeAltIcon className="h-8 w-8 text-cyan-400" />
				<div>
					<h2 className="text-2xl font-bold text-white">
						LinkedIn Post Generator
					</h2>
					<p className="text-gray-300">
						Generate and post professional content directly to your LinkedIn
						profile
					</p>
				</div>
			</div>

			{/* LinkedIn Connection Status */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-gradient-to-r from-cyan-900 to-blue-900 border border-cyan-700 rounded-xl p-4"
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<LinkIcon className="h-6 w-6 text-cyan-400" />
						<div>
							<h3 className="font-semibold text-white">
								LinkedIn Connection
							</h3>
							<p className="text-sm text-gray-300">
								{isConnected
									? "Connected to LinkedIn - You can post directly to your profile"
									: "Connect your LinkedIn account to post directly"}
							</p>
						</div>
					</div>
					<button
						onClick={handleConnectLinkedIn}
						disabled={isConnected}
						className={`px-4 py-2 rounded-lg font-medium transition-colors ${
							isConnected
								? "bg-green-900 text-green-300 cursor-not-allowed"
								: "bg-cyan-600 text-white hover:bg-cyan-500"
						}`}
					>
						{isConnected ? "Connected" : "Connect LinkedIn"}
					</button>
				</div>
			</motion.div>

			{/* Post Configuration */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-[#18191b] rounded-xl border border-gray-700 p-6"
			>
				<h3 className="text-lg font-semibold text-white mb-4">
					Post Configuration
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">
							Post Type
						</label>
						<select
							value={postType}
							onChange={(e) => setPostType(e.target.value)}
							className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-[#23272f] text-white"
						>
							{postTypes.map((type) => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">
							Topic
						</label>
						<input
							type="text"
							value={topic}
							onChange={(e) => setTopic(e.target.value)}
							placeholder="e.g., Career Development"
							className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-[#23272f] text-white"
						/>
					</div>
				</div>

				<div className="mt-4">
					<label className="block text-sm font-medium text-gray-300 mb-2">
						Post Description
					</label>
					<textarea
						value={postDescription}
						onChange={(e) => setPostDescription(e.target.value)}
						placeholder="Describe what you want to post about..."
						rows={4}
						className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-[#23272f] text-white"
					/>
				</div>

				<div className="mt-6 flex space-x-3">
					<button
						onClick={handleGeneratePost}
						disabled={isGenerating || !postDescription.trim()}
						className="flex items-center space-x-2 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{isGenerating ? (
							<ArrowPathIcon className="h-5 w-5 animate-spin" />
						) : (
							<SparklesIcon className="h-5 w-5" />
						)}
						<span>{isGenerating ? "Generating..." : "Generate Post"}</span>
					</button>

					{isConnected && (
						<button
							onClick={handlePostToLinkedIn}
							disabled={isPosting || !generatedPost.trim()}
							className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{isPosting ? (
								<ArrowPathIcon className="h-5 w-5 animate-spin" />
							) : (
								<DocumentTextIcon className="h-5 w-5" />
							)}
							<span>{isPosting ? "Posting..." : "Post to LinkedIn"}</span>
						</button>
					)}
				</div>
			</motion.div>

			{/* Generated Post */}
			{generatedPost && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-[#18191b] rounded-xl border border-gray-700 p-6"
				>
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-white">
							Generated Post
						</h3>
						<button
							onClick={handleCopyToClipboard}
							className="flex items-center space-x-2 px-3 py-2 text-sm bg-[#23272f] text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
						>
							<ClipboardDocumentIcon className="h-4 w-4" />
							<span>Copy</span>
						</button>
					</div>
					<div className="bg-[#23272f] rounded-lg p-4 whitespace-pre-wrap text-gray-200">
						{generatedPost}
					</div>
				</motion.div>
			)}

			{/* Success Message */}
			{showSuccess && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-green-900 border border-green-700 rounded-xl p-4"
				>
					<div className="flex items-center space-x-3">
						<CheckCircleIcon className="h-6 w-6 text-green-400" />
						<div>
							<h3 className="font-semibold text-green-300">
								Posted Successfully!
							</h3>
							<p className="text-green-200">
								Your post has been published to your LinkedIn profile.
							</p>
						</div>
					</div>
				</motion.div>
			)}

			{/* Error Message */}
			{error && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-red-900 border border-red-700 rounded-xl p-4"
				>
					<div className="flex items-center space-x-3">
						<XCircleIcon className="h-6 w-6 text-red-400" />
						<div>
							<h3 className="font-semibold text-red-300">Error</h3>
							<p className="text-red-200">{error}</p>
						</div>
					</div>
				</motion.div>
			)}
		</div>
	);
}
