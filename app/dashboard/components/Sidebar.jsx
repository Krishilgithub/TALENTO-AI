"use client";

import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { getInitialFromName } from "../../../utils/getInitialFromName";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Sidebar({ 
	user, 
	sidebarOpen, 
	setSidebarOpen, 
	activeTab, 
	setActiveTab,
	ChartBarIcon,
	ChatBubbleLeftRightIcon,
	PlayCircleIcon,
	BriefcaseIcon,
	ArrowTrendingUpIcon,
	onProfileClick,
	onLogout
}) {
	const router = useRouter();

	return (
		<aside className={`w-72 bg-gradient-to-b from-[#18191b] via-[#181b22] to-[#101113] border-r border-gray-800 flex flex-col py-8 px-5 min-h-screen relative shadow-xl transition-all duration-300 ease-in-out transform ${
			sidebarOpen ? 'translate-x-0' : '-translate-x-full'
		}`}>
			{/* Logo */}
			<div className="flex items-center mb-10">
				<span className="text-2xl font-extrabold text-white tracking-wide">
					TALENTO <span className="text-cyan-400">AI</span>
				</span>
			</div>
			
			{/* User Name and Email */}
			<div className="flex flex-col items-center mb-4">
				<button
					onClick={onProfileClick}
					className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold text-white bg-gradient-to-br from-cyan-500 to-blue-700 border-4 border-cyan-400 shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer hover:border-cyan-300"
					title="Click to view profile"
				>
					{getInitialFromName(user?.name)}
				</button>
				<p className="text-white font-semibold text-lg mt-3">{user.name}</p>
				{/* <p className="text-gray-400 text-sm">{user.email}</p> */}
			</div>

			{/* Profile Avatar as first letter */}
			<div className="mb-8 flex flex-row items-center justify-center space-x-3 w-full">
				{/* Subscription Plan Badge */}
				<span className="flex items-center bg-gradient-to-r from-cyan-900 to-blue-900 text-cyan-300 px-3 py-2 rounded-lg font-semibold text-sm border border-cyan-700 shadow-md">
					FREE
				</span>
				{/* Token Count */}
				<span className="flex items-center bg-gradient-to-r from-green-900 to-emerald-900 text-green-300 px-3 py-2 rounded-lg text-sm font-semibold border border-green-700 shadow-md">
					⏱️10
				</span>
				{/* Document Count */}
				<span className="flex items-center bg-gradient-to-r from-purple-900 to-indigo-900 text-purple-300 px-3 py-2 rounded-lg text-sm font-semibold border border-purple-700 shadow-md">
					0
				</span>
			</div>

			{/* Referral and Subscription Buttons */}
			<div className="flex w-full space-x-2 mt-2 mb-8">
				<button className="flex-1 bg-gradient-to-r from-cyan-700 to-blue-700 border border-cyan-400 text-white py-2 rounded-lg font-medium hover:bg-cyan-400 hover:text-black transition-all duration-200 flex items-center justify-center shadow-md hover:scale-105">
					Referral
				</button>
				<button className="flex-1 bg-gradient-to-r from-cyan-700 to-blue-700 border border-cyan-400 text-white py-2 rounded-lg font-medium hover:bg-cyan-400 hover:text-black transition-all duration-200 flex items-center justify-center shadow-md hover:scale-105">
					Upgrade
				</button>
			</div>
			{/* Navigation */}
			<nav className="flex-1">
				<ul className="space-y-2">
					{[
						{ id: "overview", name: "Overview", icon: ChartBarIcon },
						{ id: "assessment", name: "Take Assessment", icon: null, href: "/assessment" },
						{ id: "career-planning", name: "Career Planning", icon: null, href: "/career" },
						// {
						// 	id: "interviews",
						// 	name: "Interview Prep",
						// 	icon: ChatBubbleLeftRightIcon,
						// },
						{
							id: "practice",
							name: "Practice Sessions",
							icon: PlayCircleIcon,
						},
						{ id: "career", name: "Career Tools", icon: BriefcaseIcon },
						{ id: "progress", name: "Progress", icon: ArrowTrendingUpIcon },
						{ id: "jobsearch", name: "Job Search", icon: BriefcaseIcon },
					].map((tab) => (
						<li key={tab.id}>
							{tab.href ? (
								<Link href={tab.href} className="block">
									<button className="w-full flex items-center px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 shadow-sm hover:scale-105 text-gray-300 hover:bg-[#23272f] hover:text-cyan-300 hover:shadow-md">
										<span className="w-5 h-5 mr-3 text-gray-400">
											{tab.id === "assessment" ? "" : ""}
										</span>
										{tab.name}
									</button>
								</Link>
							) : (
								<button
									onClick={() => setActiveTab(tab.id)}
									className={`w-full flex items-center px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 shadow-sm hover:scale-105 ${
										activeTab === tab.id
											? "bg-gradient-to-r from-cyan-900 to-blue-900 text-cyan-400 shadow-lg border border-cyan-700"
											: "text-gray-300 hover:bg-[#23272f] hover:text-cyan-300 hover:shadow-md"
									}`}
								>
									<tab.icon
										className={`w-5 h-5 mr-3 transition-all duration-200 ${
											activeTab === tab.id ? "text-cyan-400 scale-110" : "text-gray-400"
										}`}
									/>
									{tab.name}
								</button>
							)}
						</li>
					))}
				</ul>
			</nav>

			{/* History Section */}
			<div className="mt-auto pt-8">
				<h3 className="text-white font-semibold text-base mb-2">History</h3>
				<div className="mb-3">
					<input
						type="text"
						placeholder="Search..."
						className="w-full bg-[#23272f] text-gray-200 placeholder-gray-400 px-3 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200"
					/>
				</div>
				<ul className="space-y-1">
					<li>
						<button className="text-cyan-400 text-sm font-medium hover:underline transition-all duration-200 hover:text-cyan-300">
							Recent
						</button>
					</li>
					<li>
						<button className="text-cyan-400 text-sm font-medium hover:underline transition-all duration-200 hover:text-cyan-300">
							Past 7 Days
						</button>
					</li>
					<li>
						<button className="text-cyan-400 text-sm font-medium hover:underline transition-all duration-200 hover:text-cyan-300">
							Past 30 Days
						</button>
					</li>
				</ul>
				
				{/* Logout Button */}
				<div className="mt-6 pt-4 border-t border-gray-700">
					<button
						onClick={onLogout}
						className="w-full flex items-center px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 shadow-sm hover:scale-105 text-red-400 hover:bg-red-900 hover:text-red-300 hover:shadow-md"
					>
						<svg
							className="w-5 h-5 mr-3 transition-all duration-200"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
							/>
						</svg>
						Logout
					</button>
				</div>
			</div>
		</aside>
	);
} 