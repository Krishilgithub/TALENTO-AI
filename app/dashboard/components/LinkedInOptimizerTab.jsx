"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

export default function LinkedInOptimizerTab() {
	const [prompt, setPrompt] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [recommendations, setRecommendations] = useState([]);

	const handleGeneratePosts = async () => {
		if (!prompt.trim()) return;
		
		setIsGenerating(true);
		
		// Simulate API call
		setTimeout(() => {
			const mockRecommendations = [
				{
					id: 1,
					title: "Professional Achievement Post",
					content: `🚀 Excited to share a significant milestone in my professional journey! ${prompt}\n\nThis experience has taught me valuable lessons about [industry/field] and reinforced the importance of [key learning].\n\n#ProfessionalGrowth #CareerDevelopment #${prompt.split(' ')[0]}`,
					type: "achievement"
				},
				{
					id: 2,
					title: "Industry Insight Post",
					content: `💡 Industry Insight: ${prompt}\n\nAs someone passionate about [field], I've been reflecting on how this impacts our industry and what it means for professionals like us.\n\nKey takeaways:\n• [Insight 1]\n• [Insight 2]\n• [Insight 3]\n\nWhat are your thoughts on this trend?\n\n#IndustryInsights #ProfessionalDevelopment #Networking`,
					type: "insight"
				},
				{
					id: 3,
					title: "Learning Journey Post",
					content: `📚 Learning Journey Update: ${prompt}\n\nRecently, I've been diving deep into [topic] and wanted to share some key learnings with my network.\n\nWhat I've discovered:\n✅ [Learning 1]\n✅ [Learning 2]\n✅ [Learning 3]\n\nAlways eager to learn from others in this space!\n\n#ContinuousLearning #ProfessionalDevelopment #KnowledgeSharing`,
					type: "learning"
				}
			];
			
			setRecommendations(mockRecommendations);
			setIsGenerating(false);
		}, 2000);
	};

	const copyToClipboard = (text) => {
		navigator.clipboard.writeText(text);
		// You could add a toast notification here
	};

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-xl font-semibold text-white mb-2">
					LinkedIn Post Optimizer
				</h2>
				<p className="text-gray-300">
					Generate professional LinkedIn posts based on your prompts and experiences.
				</p>
			</div>

			{/* Input Section */}
			<div className="bg-[#18191b] rounded-lg p-6 border border-gray-700">
				<h3 className="text-lg font-semibold text-cyan-400 mb-4">
					Describe Your Content
				</h3>
				
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">
							What would you like to post about?
						</label>
						<textarea
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							placeholder="Describe your achievement, insight, or experience you'd like to share..."
							rows={4}
							className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-gray-800 text-white placeholder-gray-400 resize-none"
						/>
					</div>

					<button
						onClick={handleGeneratePosts}
						disabled={!prompt.trim() || isGenerating}
						className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{isGenerating ? (
							<>
								<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
								Generating Posts...
							</>
						) : (
							<>
								<PaperAirplaneIcon className="w-5 h-5" />
								Generate LinkedIn Posts
							</>
						)}
					</button>
				</div>
			</div>

			{/* Recommendations Section */}
			{recommendations.length > 0 && (
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-cyan-400">
						Generated Posts
					</h3>
					
					<div className="grid grid-cols-1 gap-4">
						{recommendations.map((post) => (
							<motion.div
								key={post.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
								className="bg-[#232323] rounded-lg p-6 border border-gray-700"
							>
								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center gap-2">
										<DocumentTextIcon className="w-5 h-5 text-cyan-400" />
										<h4 className="text-white font-semibold">{post.title}</h4>
									</div>
									<button
										onClick={() => copyToClipboard(post.content)}
										className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors duration-200"
									>
										Copy
									</button>
								</div>
								
								<div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
									<pre className="text-gray-200 text-sm whitespace-pre-wrap font-sans">
										{post.content}
									</pre>
								</div>
								
								<div className="mt-4 flex gap-2">
									<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-900 text-cyan-300">
										{post.type}
									</span>
									<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900 text-blue-300">
										LinkedIn Ready
									</span>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			)}

			{/* Tips Section */}
			<div className="bg-[#18191b] rounded-lg p-6 border border-gray-700">
				<h3 className="text-lg font-semibold text-cyan-400 mb-4">
					💡 Tips for Better LinkedIn Posts
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
					<div>
						<h4 className="font-semibold text-white mb-2">Content Structure</h4>
						<ul className="space-y-1">
							<li>• Start with a compelling hook</li>
							<li>• Share your personal experience</li>
							<li>• Include relevant hashtags</li>
							<li>• End with a call to action</li>
						</ul>
					</div>
					<div>
						<h4 className="font-semibold text-white mb-2">Best Practices</h4>
						<ul className="space-y-1">
							<li>• Keep posts under 1300 characters</li>
							<li>• Use emojis strategically</li>
							<li>• Include line breaks for readability</li>
							<li>• Engage with comments</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
} 