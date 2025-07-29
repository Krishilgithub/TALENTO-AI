"use client";

export default function ProgressTab() {
	const progressData = {
		skills: [
			{ name: "Communication", progress: 85 },
			{ name: "Problem Solving", progress: 78 },
			{ name: "Technical Skills", progress: 92 },
			{ name: "Leadership", progress: 65 },
			{ name: "Teamwork", progress: 88 },
		],
		goals: [
			{ name: "Complete 20 practice sessions", completed: 12, total: 20 },
			{ name: "Improve communication score to 90%", completed: 85, total: 90 },
			{ name: "Master 3 interview types", completed: 2, total: 3 },
		],
	};

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-xl font-semibold text-white mb-2 font-sans">
					Your Progress
				</h2>
				<p className="text-gray-300 font-sans">
					Track your improvement across different skills and goals.
				</p>
			</div>

			{/* Skills Progress */}
			<div>
				<h3 className="text-lg font-semibold text-white mb-4 font-sans">
					Skills Development
				</h3>
				<div className="space-y-4">
					{progressData.skills.map((skill) => (
						<div key={skill.name}>
							<div className="flex justify-between items-center mb-2">
								<span className="text-sm font-medium text-gray-300 font-sans">
									{skill.name}
								</span>
								<span className="text-sm font-semibold text-white font-sans">
									{skill.progress}%
								</span>
							</div>
							<div className="w-full bg-[#232323] rounded-full h-2">
								<div
									className="bg-cyan-400 h-2 rounded-full transition-all duration-300"
									style={{ width: `${skill.progress}%` }}
								></div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Goals Progress */}
			<div>
				<h3 className="text-lg font-semibold text-white mb-4 font-sans">
					Goals Progress
				</h3>
				<div className="space-y-4">
					{progressData.goals.map((goal) => (
						<div key={goal.name} className="bg-[#232323] rounded-lg p-4">
							<div className="flex justify-between items-center mb-2">
								<span className="font-medium text-white font-sans">
									{goal.name}
								</span>
								<span className="text-sm font-semibold text-gray-300 font-sans">
									{goal.completed}/{goal.total}
								</span>
							</div>
							<div className="w-full bg-[#18191b] rounded-full h-2">
								<div
									className="bg-green-400 h-2 rounded-full transition-all duration-300"
									style={{ width: `${(goal.completed / goal.total) * 100}%` }}
								></div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Achievements */}
			<div>
				<h3 className="text-lg font-semibold text-white mb-4 font-sans">
					Recent Achievements
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{[
						{
							title: "First Practice",
							description: "Completed your first practice session",
							icon: "🎯",
						},
						{
							title: "Skill Master",
							description: "Improved a skill by 20%",
							icon: "🚀",
						},
						{
							title: "Consistent Learner",
							description: "Practiced for 7 days in a row",
							icon: "🔥",
						},
					].map((achievement, index) => (
						<div
							key={index}
							className="bg-[#232323] border border-yellow-900 rounded-lg p-4 text-center"
						>
							<div className="text-3xl mb-2">{achievement.icon}</div>
							<h4 className="font-semibold text-yellow-300 mb-1 font-sans">
								{achievement.title}
							</h4>
							<p className="text-sm text-gray-400 font-sans">
								{achievement.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
} 