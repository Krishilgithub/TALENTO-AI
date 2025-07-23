"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import createClientForBrowser from "@/utils/supabase/client";

export default function DashboardPage() {
	const [user, setUser] = useState(null);
	const [activeTab, setActiveTab] = useState("overview");
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const fetchUser = async () => {
			const supabase = createClientForBrowser();
			const { data, error } = await supabase.auth.getUser();
			if (data?.user) {
				const userObj = {
					name: data.user.user_metadata?.name || data.user.email,
					email: data.user.email,
					role: data.user.user_metadata?.role || "user",
					// add more fields as needed
				};
				if (userObj.role === "admin") {
					router.push("/admin");
					return;
				}
				setUser(userObj);
				setIsLoading(false);
			} else {
				router.push("/login");
			}
		};
		fetchUser();
	}, [router]);

	const handleLogout = async () => {
		const supabase = createClientForBrowser();
		await supabase.auth.signOut();
		router.push("/");
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (!user) return null;

	return (
		<div className="min-h-screen bg-[#101113]">
			{/* Header */}
			<header className="bg-[#18191b] shadow-sm border-b border-gray-700">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-4">
						<div className="flex items-center">
							<Link href="/dashboard" className="text-2xl font-bold text-white">
								Talento AI
							</Link>
						</div>
						<div className="flex items-center space-x-4">
							<Link
								href="/profile"
								className="bg-cyan-400 text-black px-4 py-2 rounded-lg font-medium hover:bg-cyan-300 transition-colors duration-200"
							>
								Profile
							</Link>
						</div>
					</div>
				</div>
			</header>

			{/* Navigation for new features */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* <div className="flex space-x-4 mb-8">
					<Link href="/practice" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Start Practice Session</Link>
					<Link href="/assessment" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Take Assessment</Link>
					<Link href="/career" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">Career Planning</Link>
				</div> */}
				{/* Dashboard Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white mb-2">
						Your Career Dashboard
					</h1>
					<p className="text-gray-300">
						Master your interviews and accelerate your career with AI-powered
						tools
					</p>
				</div>

				{/* Navigation Tabs */}
				<div className="bg-[#18191b] rounded-xl shadow-sm border border-gray-700 mb-8">
					<nav className="flex space-x-8 px-6">
						{[
							{ id: "overview", name: "Overview", icon: "📊" },
							{ id: "interviews", name: "Interview Prep", icon: "🎯" },
							{ id: "practice", name: "Practice Sessions", icon: "💬" },
							{ id: "career", name: "Career Tools", icon: "🚀" },
							{ id: "progress", name: "Progress", icon: "📈" },
							// Removed settings tab
						].map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
									activeTab === tab.id
										? "border-cyan-400 text-cyan-400"
										: "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
								}`}
							>
								<span className="mr-2">{tab.icon}</span>
								{tab.name}
							</button>
						))}
					</nav>
				</div>

				{/* Tab Content */}
				<div className="bg-[#18191b] rounded-xl shadow-sm border border-gray-700 p-6">
					{activeTab === "overview" && <OverviewTab user={user} />}
					{activeTab === "interviews" && <InterviewPrepTab />}
					{activeTab === "practice" && <PracticeSessionsTab />}
					{activeTab === "career" && <CareerToolsTab />}
					{activeTab === "progress" && <ProgressTab />}
					{/* Removed settings tab content */}
				</div>
			</div>
		</div>
	);
}

// Overview Tab Component
function OverviewTab({ user }) {
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
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Link href="/practice" className="block h-full">
					<div className="w-full h-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-4 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 flex flex-col justify-start items-start">
						<div className="text-2xl mb-2">🎯</div>
						<h3 className="font-semibold">Start Practice Session</h3>
						<p className="text-sm opacity-90">Begin a new interview practice</p>
					</div>
				</Link>

				<Link href="/assessment" className="block h-full">
					<div className="w-full h-full bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200 flex flex-col justify-start items-start">
						<div className="text-2xl mb-2">📝</div>
						<h3 className="font-semibold">Take Assessment</h3>
						<p className="text-sm opacity-90">Evaluate your skills</p>
					</div>
				</Link>

				<Link href="/career" className="block h-full">
					<div className="w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex flex-col justify-start items-start">
						<div className="text-2xl mb-2">🚀</div>
						<h3 className="font-semibold">Career Planning</h3>
						<p className="text-sm opacity-90">Plan your next steps</p>
					</div>
				</Link>
			</div>

			{/* Recent Activities */}
			<div>
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
			</div>
		</div>
	);
}

// Interview Prep Tab Component
function InterviewPrepTab() {
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
		<div className="space-y-6">
			<div>
				<h2 className="text-xl font-semibold text-white mb-2">
					Interview Preparation
				</h2>
				<p className="text-gray-300">
					Choose your interview type and start practicing with AI-powered
					feedback.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{interviewTypes.map((type) => (
					<div
						key={type.name}
						className="border border-cyan-900 rounded-lg p-6 bg-[#18191b] hover:shadow-md transition-shadow duration-200"
					>
						<div className="flex items-start justify-between mb-4">
							<div className="text-3xl">{type.icon}</div>
							<div className="text-right">
								<span
									className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
										type.difficulty === "Beginner"
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
	);
}

// Practice Sessions Tab Component
function PracticeSessionsTab() {
	const [isRecording, setIsRecording] = useState(false);
	const [sessionType, setSessionType] = useState("behavioral");

	const startSession = () => {
		setIsRecording(true);
		// Simulate session start
		setTimeout(() => {
			setIsRecording(false);
		}, 5000);
	};

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-xl font-semibold text-white mb-2 font-sans">
					Practice Sessions
				</h2>
				<p className="text-gray-300 font-sans">
					Start a new practice session with AI-powered feedback and analysis.
				</p>
			</div>

			{/* Session Setup */}
			<div className="bg-[#18191b] rounded-lg p-6">
				<h3 className="text-lg font-semibold text-cyan-400 mb-4 font-sans">
					Start New Session
				</h3>

				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-black mb-2 font-sans">
							Session Type
						</label>
						<select
							value={sessionType}
							onChange={(e) => setSessionType(e.target.value)}
							className="w-full px-3 py-2 border border-cyan-900 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-cyan-100 text-black font-sans"
						>
							<option value="behavioral">Behavioral Interview</option>
							<option value="technical">Technical Interview</option>
							<option value="case">Case Study</option>
							<option value="system">System Design</option>
						</select>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label className="block text-sm font-medium text-black mb-2 font-sans">
								Duration
							</label>
							<select className="w-full px-3 py-2 border border-cyan-900 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-cyan-100 text-black font-sans">
								<option>15 minutes</option>
								<option>30 minutes</option>
								<option>45 minutes</option>
								<option>60 minutes</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-black mb-2 font-sans">
								Difficulty
							</label>
							<select className="w-full px-3 py-2 border border-cyan-900 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-cyan-100 text-black font-sans">
								<option>Beginner</option>
								<option>Intermediate</option>
								<option>Advanced</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-black mb-2 font-sans">
								Questions Count
							</label>
							<select className="w-full px-3 py-2 border border-cyan-900 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-cyan-100 text-black font-sans">
								<option>5 questions</option>
								<option>10 questions</option>
								<option>15 questions</option>
								<option>20 questions</option>
							</select>
						</div>
					</div>

					<button
						onClick={startSession}
						disabled={isRecording}
						className="w-full bg-cyan-400 text-black py-3 px-4 rounded-lg font-medium hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-sans"
					>
						{isRecording ? (
							<div className="flex items-center justify-center">
								<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
								Starting Session...
							</div>
						) : (
							"Start Practice Session"
						)}
					</button>
				</div>
			</div>

			{/* Recent Sessions */}
			<div>
				<h3 className="text-lg font-semibold text-white mb-4 font-sans">
					Recent Sessions
				</h3>
				<div className="space-y-3">
					{[
						{
							type: "Behavioral",
							date: "Today",
							score: "85%",
							duration: "25 min",
						},
						{
							type: "Technical",
							date: "Yesterday",
							score: "78%",
							duration: "45 min",
						},
						{
							type: "Case Study",
							date: "2 days ago",
							score: "92%",
							duration: "35 min",
						},
					].map((session, index) => (
						<div
							key={index}
							className="flex items-center justify-between p-4 bg-[#232323] rounded-lg"
						>
							<div className="flex items-center space-x-4">
								<div className="text-2xl">💬</div>
								<div>
									<p className="font-medium text-white font-sans">
										{session.type} Interview
									</p>
									<p className="text-sm text-gray-400 font-sans">
										{session.date} • {session.duration}
									</p>
								</div>
							</div>
							<div className="text-right">
								<p className="font-semibold text-cyan-400 font-sans">
									{session.score}
								</p>
								<p className="text-sm text-gray-400 font-sans">Score</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

// Career Tools Tab Component
function CareerToolsTab() {
	const [resumeFile, setResumeFile] = useState(null);
	const [atsScore, setAtsScore] = useState(null);
	const [atsFeedback, setAtsFeedback] = useState(null); // will be object
	const [isAnalyzing, setIsAnalyzing] = useState(false);

	const tools = [
		{
			name: "Resume Builder",
			description: "Create professional resumes with AI suggestions",
			icon: "📄",
			status: "Available",
		},
		{
			name: "Cover Letter Generator",
			description: "Generate personalized cover letters",
			icon: "✉️",
			status: "Available",
		},
		{
			name: "Career Assessment",
			description: "Discover your strengths and career path",
			icon: "🔍",
			status: "Available",
		},
		{
			name: "Salary Negotiation",
			description: "Learn negotiation strategies and tactics",
			icon: "💰",
			status: "Coming Soon",
		},
		{
			name: "Networking Guide",
			description: "Build professional relationships",
			icon: "🤝",
			status: "Coming Soon",
		},
		{
			name: "Industry Insights",
			description: "Stay updated with industry trends",
			icon: "📊",
			status: "Coming Soon",
		},
	];

	async function handleResumeUpload(e) {
		const file = e.target.files[0];
		if (!file) return;
		setResumeFile(file);
		setAtsScore(null);
		setAtsFeedback(null);
		setIsAnalyzing(true);

		const formData = new FormData();
		formData.append("file", file);
		formData.append("job_role", "Software Engineer"); // or allow user to select

		try {
			const res = await fetch("/api/assessment/ats_score/", {
				method: "POST",
				body: formData,
			});
			const data = await res.json();
			if (!res.ok || data.error) {
				setAtsScore(null);
				setAtsFeedback({ error: data.error || "Failed to analyze resume." });
			} else {
				setAtsScore(data.score);
				setAtsFeedback(data.feedback);
			}
		} catch (err) {
			setAtsScore(null);
			setAtsFeedback({ error: "Failed to connect to server." });
		} finally {
			setIsAnalyzing(false);
		}
	}

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-xl font-semibold text-white mb-2 font-sans">
					Career Tools
				</h2>
				<p className="text-gray-300 font-sans">
					Access powerful tools to accelerate your career growth.
				</p>
			</div>

			{/* Resume Upload & ATS Score */}
			<div className="bg-[#18191b] border border-cyan-900 rounded-xl p-6 mb-6 shadow-sm">
				<h3 className="text-lg font-bold text-cyan-400 mb-2 flex items-center gap-2 font-sans">
					Resume Optimizer & ATS Score
				</h3>
				<p className="text-gray-400 mb-4 font-sans">
					Upload your resume (PDF or DOCX) to see how it performs with Applicant
					Tracking Systems and get optimization tips.
				</p>
				<input
					type="file"
					accept=".pdf,.docx"
					onChange={handleResumeUpload}
					className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-900 file:text-cyan-300 hover:file:bg-cyan-800 mb-4 font-sans"
				/>
				{isAnalyzing && (
					<div className="flex items-center gap-2 text-cyan-400 font-medium font-sans">
						<svg
							className="animate-spin h-6 w-6 text-cyan-400"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
							></path>
						</svg>
						Analyzing your resume...
					</div>
				)}
				{atsScore !== null && atsFeedback && !atsFeedback.error && (
					<div className="mt-4 p-4 rounded-lg bg-[#232323] border border-cyan-900 shadow">
						<div className="text-lg font-bold text-cyan-400 mb-2 font-sans">
							ATS Score: {atsScore}
						</div>
						{/* Strengths */}
						<div className="mb-2">
							<span className="font-semibold text-cyan-300">Strengths:</span>
							<ul className="list-disc list-inside ml-4 text-gray-200">
								{atsFeedback.strengths && atsFeedback.strengths.length > 0 ? (
									atsFeedback.strengths.map((s, i) => <li key={i}>{s}</li>)
								) : (
									<li className="text-gray-400">None</li>
								)}
							</ul>
						</div>
						{/* Weaknesses */}
						<div className="mb-2">
							<span className="font-semibold text-cyan-300">Weaknesses:</span>
							<ul className="list-disc list-inside ml-4 text-gray-200">
								{atsFeedback.weaknesses && atsFeedback.weaknesses.length > 0 ? (
									atsFeedback.weaknesses.map((w, i) => <li key={i}>{w}</li>)
								) : (
									<li className="text-gray-400">None</li>
								)}
							</ul>
						</div>
						{/* Tips */}
						<div className="mb-2">
							<span className="font-semibold text-cyan-300">Tips:</span>
							<ul className="list-disc list-inside ml-4 text-gray-200">
								{atsFeedback.tips && atsFeedback.tips.length > 0 ? (
									atsFeedback.tips.map((t, i) => <li key={i}>{t}</li>)
								) : (
									<li className="text-gray-400">None</li>
								)}
							</ul>
						</div>
						{/* Improvement Plan */}
						<div className="mb-2">
							<span className="font-semibold text-cyan-300">
								Improvement Plan:
							</span>
							<ul className="list-disc list-inside ml-4 text-gray-200">
								{atsFeedback.improvement_plan &&
								atsFeedback.improvement_plan.length > 0 ? (
									atsFeedback.improvement_plan.map((imp, i) => (
										<li key={i}>{imp}</li>
									))
								) : (
									<li className="text-gray-400">None</li>
								)}
							</ul>
						</div>
					</div>
				)}
				{atsFeedback && atsFeedback.error && (
					<div className="mt-4 p-4 rounded-lg bg-red-900/30 border border-red-700 text-red-300 font-sans">
						{atsFeedback.error}
					</div>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{tools.map((tool) => (
					<div
						key={tool.name}
						className="bg-[#18191b] border border-cyan-900 rounded-lg p-6 flex items-center gap-4"
					>
						<div className="text-3xl">{tool.icon}</div>
						<div className="flex-1">
							<h4 className="text-lg font-semibold text-white mb-1 font-sans">
								{tool.name}
							</h4>
							<p className="text-gray-400 text-sm font-sans">
								{tool.description}
							</p>
						</div>
						{tool.status === "Coming Soon" && (
							<span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full font-sans bg-cyan-400 text-black">
								Coming Soon
							</span>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

// Progress Tab Component
function ProgressTab() {
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
