import React, { useState } from "react";
import { motion } from "framer-motion";
import {
	GlobeAltIcon,
	DocumentTextIcon,
	SparklesIcon,
	ClipboardDocumentIcon,
	CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function LinkedInPostGeneratorTab() {
	const [postType, setPostType] = useState("Professional Insight");
	const [topic, setTopic] = useState("Career Development");
	const [postDescription, setPostDescription] = useState("");
	const [generatedPost, setGeneratedPost] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [error, setError] = useState("");
	const [copied, setCopied] = useState(false);

	const postTypes = [
		"Professional Insight",
		"Industry Trends",
		"Professional Achievement",
		"Career Advice",
		"Project Showcase",
		"Learning Experience",
	];

	const topics = [
		"Career Development",
		"Industry Trends",
		"Professional Achievement",
		"Skill Development",
		"Networking",
		"Leadership",
		"Innovation",
		"Work-Life Balance",
	];

	const handleGeneratePost = async () => {
		setIsGenerating(true);
		setError("");
		setGeneratedPost("");
		setCopied(false);

		try {
			const formData = new FormData();
			formData.append("post_type", postType);
			formData.append("topic", topic);
			formData.append("post_description", postDescription || "Share insights about career growth and professional development");

			const response = await fetch("/api/assessment/linkedin_post/", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to generate LinkedIn post");
			}

			const data = await response.json();
			console.log("Generated post data:", data);
			
			if (data.post) {
				setGeneratedPost(data.post);
			} else {
				throw new Error("No post content received from the server");
			}
		} catch (err) {
			console.error("Post generation error:", err);
			setError(err.message || "Something went wrong");
		} finally {
			setIsGenerating(false);
		}
	};

	const handleCopyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(generatedPost);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy to clipboard:", err);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="space-y-6"
		>
			{/* Header */}
			<div className="flex items-center space-x-3 mb-6">
				<GlobeAltIcon className="h-8 w-8 text-blue-500" />
				<div>
					<h2 className="text-2xl font-bold text-white">
						LinkedIn Post Generator
					</h2>
					<p className="text-gray-400">
						Generate professional LinkedIn posts tailored to your industry
					</p>
				</div>
			</div>

			{/* Configuration Section */}
			<div className="bg-[#1a1b1c] rounded-lg p-6 space-y-4">
				<h3 className="text-lg font-semibold text-white mb-4">
					Post Configuration
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Post Type */}
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">
							Post Type
						</label>
						<select
							value={postType}
							onChange={(e) => setPostType(e.target.value)}
							className="w-full px-3 py-2 bg-[#2a2b2c] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							{postTypes.map((type) => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
						</select>
					</div>

					{/* Topic */}
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">
							Topic
						</label>
						<select
							value={topic}
							onChange={(e) => setTopic(e.target.value)}
							className="w-full px-3 py-2 bg-[#2a2b2c] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							{topics.map((t) => (
								<option key={t} value={t}>
									{t}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Post Description */}
				<div>
					<label className="block text-sm font-medium text-gray-300 mb-2">
						Post Description (Optional)
					</label>
					<textarea
						value={postDescription}
						onChange={(e) => setPostDescription(e.target.value)}
						placeholder="e.g., Share your thoughts on career growth, industry trends, or professional development. Describe what kind of post you want to generate."
						className="w-full px-3 py-2 bg-[#2a2b2c] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
						rows="3"
					/>
				</div>

				{/* Generate Button */}
				<button
					onClick={handleGeneratePost}
					disabled={isGenerating}
					className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium rounded-lg flex items-center justify-center space-x-2 transition-colors"
				>
					{isGenerating ? (
						<>
							<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
							<span>Generating...</span>
						</>
					) : (
						<>
							<SparklesIcon className="h-5 w-5" />
							<span>Generate Post</span>
						</>
					)}
				</button>
			</div>

			{/* Error Display */}
			{error && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-red-900/20 border border-red-500/50 rounded-lg p-4"
				>
					<p className="text-red-400">{error}</p>
				</motion.div>
			)}

			{/* Generated Post Display */}
			{generatedPost && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-[#1a1b1c] rounded-lg p-6"
				>
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-white flex items-center space-x-2">
							<DocumentTextIcon className="h-5 w-5 text-blue-400" />
							<span>Generated LinkedIn Post</span>
						</h3>
						<button
							onClick={handleCopyToClipboard}
							className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
						>
							{copied ? (
								<>
									<CheckCircleIcon className="h-4 w-4 text-green-400" />
									<span className="text-sm">Copied!</span>
								</>
							) : (
								<>
									<ClipboardDocumentIcon className="h-4 w-4" />
									<span className="text-sm">Copy</span>
								</>
							)}
						</button>
					</div>

					<div className="bg-[#2a2b2c] rounded-lg p-4 border border-gray-600">
						<pre className="text-white whitespace-pre-wrap font-sans text-sm leading-relaxed">
							{generatedPost}
						</pre>
					</div>

					<div className="mt-4 text-sm text-gray-400">
						<p>
							💡 <strong>Tip:</strong> Customize the generated post to match
							your personal style and add your own experiences before posting.
						</p>
					</div>
				</motion.div>
			)}

			{/* Tips Section */}
			<div className="bg-[#1a1b1c] rounded-lg p-6">
				<h3 className="text-lg font-semibold text-white mb-4">
					💡 Tips for Great LinkedIn Posts
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
					<div className="space-y-2">
						<p>
							• <strong>Be authentic</strong> - Add your personal experiences
						</p>
						<p>
							• <strong>Use hashtags</strong> - But don't overdo it (3-5 is
							ideal)
						</p>
						<p>
							• <strong>Include visuals</strong> - Images increase engagement
						</p>
						<p>
							• <strong>Ask questions</strong> - Encourage comments and
							discussion
						</p>
					</div>
					<div className="space-y-2">
						<p>
							• <strong>Keep it concise</strong> - LinkedIn posts work best
							under 1300 characters
						</p>
						<p>
							• <strong>Use bullet points</strong> - Makes content scannable
						</p>
						<p>
							• <strong>Add value</strong> - Share insights that help others
						</p>
						<p>
							• <strong>Engage with comments</strong> - Respond to build
							relationships
						</p>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
