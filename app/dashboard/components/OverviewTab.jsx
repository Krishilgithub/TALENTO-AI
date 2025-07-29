"use client";

import Link from "next/link";

export default function OverviewTab({ user }) {
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
				{stats.map((stat) => (
					<div
						key={stat.name}
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
					</div>
				))}
			</div>

			{/* Quick Actions */}
			<div className="grid grid-cols-1 md:grid-cols-1 gap-4">
				<Link href="/practice" className="block h-full">
					<div className="w-full h-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-4 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 flex flex-col justify-start items-start">
						<div className="text-2xl mb-2">🎯</div>
						<h3 className="font-semibold">Practice Session</h3>
						<p className="text-sm opacity-90">Begin a new practice session</p>
					</div>
				</Link>
			</div>

			{/* Recent Activities */}
			{/* <div>
				<h3 className="text-lg font-semibold text-white mb-4">
					Recent Activities
				</h3>
				<div className="space-y-3">
					{recentActivities.map((activity, index) => (
						<div
							key={index}
							className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700"
						>
							<div className="flex items-center space-x-3">
								<div className="text-lg">
									{activity.type === "practice" && "💬"}
									{activity.type === "interview" && "🎯"}
									{activity.type === "skill" && "📈"}
									{activity.type === "assessment" && "📝"}
								</div>
								<div>
									<p className="font-medium text-white">{activity.title}</p>
									<p className="text-sm text-gray-400">{activity.time}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div> */}
		</div>
	);
} 