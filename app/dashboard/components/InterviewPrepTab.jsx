"use client";

export default function InterviewPrepTab() {
	const interviewTypes = [
		{
			name: "Behavioral Interviews",
			description: "Practice common behavioral questions with AI feedback",
			icon: "💬",
			difficulty: "Beginner",
			duration: "15-30 min",
		},
		{
			name: "Technical Interviews",
			description: "Code challenges and technical problem solving",
			icon: "💻",
			difficulty: "Advanced",
			duration: "45-60 min",
		},
		{
			name: "Case Interviews",
			description: "Business case studies and problem solving",
			icon: "📊",
			difficulty: "Intermediate",
			duration: "30-45 min",
		},
		{
			name: "System Design",
			description: "Design scalable systems and architectures",
			icon: "🏗️",
			difficulty: "Advanced",
			duration: "60-90 min",
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-7xl mx-auto">
					<div className="mb-8">
						<h2 className="text-3xl font-bold text-white mb-4">
							Interview Preparation
						</h2>
						<p className="text-gray-300 text-lg">
							Choose your interview type and start practicing with AI-powered
							feedback.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{interviewTypes.map((type) => (
							<div
								key={type.name}
								className="bg-gray-800/30 border border-gray-600/50 backdrop-blur-sm rounded-lg p-6 hover:border-cyan-400/50 transition-all duration-200"
							>
								<div className="flex items-start justify-between mb-4">
									<div className="text-3xl">{type.icon}</div>
									<div className="text-right">
										<span
											className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${type.difficulty === "Beginner"
													? "bg-green-900 text-green-300"
													: type.difficulty === "Intermediate"
														? "bg-yellow-900 text-yellow-200"
														: "bg-red-900 text-red-300"
												}`}
										>
											{type.difficulty}
										</span>
									</div>
								</div>
								<h3 className="text-lg font-semibold text-white mb-2">
									{type.name}
								</h3>
								<p className="text-gray-400 mb-4">{type.description}</p>
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-500">
										Duration: {type.duration}
									</span>
									<button className="bg-cyan-400 text-black px-4 py-2 rounded-lg hover:bg-cyan-300 transition-colors duration-200">
										Start Practice
									</button>
								</div>
							</div>
						))}
					</div>

					{/* Quick Tips */}
					<div className="bg-[#232323] border border-cyan-900 rounded-lg p-6">
						<h3 className="text-lg font-semibold text-cyan-400 mb-3">
							💡 Quick Tips
						</h3>
						<ul className="space-y-2 text-gray-300">
							<li>• Practice regularly to build confidence</li>
							<li>• Review your recordings to identify improvement areas</li>
							<li>• Use the STAR method for behavioral questions</li>
							<li>• Prepare questions to ask your interviewer</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
} 