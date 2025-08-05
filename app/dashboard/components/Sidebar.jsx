"use client";

import {
	ChevronLeftIcon,
	ClipboardDocumentListIcon,
	AcademicCapIcon,
	CreditCardIcon,
	Bars3Icon,
	XMarkIcon,
	DocumentTextIcon,
} from "@heroicons/react/24/outline";
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
	onLogout,
}) {
	const router = useRouter();

	const navTabs = [
		{ id: "overview", name: "Overview", icon: ChartBarIcon },
		{
			id: "assessment",
			name: "Take Assessment",
			icon: ClipboardDocumentListIcon,
		},
		// { id: "practice", name: "Practice Sessions", icon: PlayCircleIcon }, // Commented out practice sessions
		{ id: "progress", name: "Progress", icon: ArrowTrendingUpIcon },
		{ id: "jobsearch", name: "Job Search", icon: BriefcaseIcon },
		{
			id: "linkedin-optimizer",
			name: "LinkedIn Optimizer",
			icon: ChatBubbleLeftRightIcon,
		},
		{
			id: "linkedin-post-generator",
			name: "LinkedIn Post Generator",
			icon: DocumentTextIcon,
		},
	];

	return (
		<aside
			className={`fixed left-0 top-0 h-full bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 dark:from-[#18191b] dark:via-[#181b22] dark:to-[#101113] border-r border-gray-300 dark:border-gray-800 flex flex-col shadow-xl transition-all duration-300 ease-in-out z-50
			${sidebarOpen ? "w-72 px-5 py-8" : "w-16 px-0 py-4"}`}
		>
			{/* Hamburger Menu Button (always visible) */}
			<button
				onClick={() => setSidebarOpen(!sidebarOpen)}
				className={`absolute top-4 ${
					sidebarOpen ? "right-4" : "left-1/2 -translate-x-1/2"
				} p-2 rounded-full bg-[#23272f] border border-gray-700 hover:bg-cyan-900 transition-all duration-200 hover:scale-110 z-10`}
				title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
			>
				{sidebarOpen ? (
					<XMarkIcon className="w-5 h-5 text-cyan-400" />
				) : (
					<Bars3Icon className="w-5 h-5 text-cyan-400" />
				)}
			</button>

			{/* Sidebar Content (static, scrolls if needed) */}
			{sidebarOpen && (
				<div className="flex items-center mb-10 mt-2">
					<span className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-wide">
						TALENTO <span className="text-cyan-400">AI</span>
					</span>
				</div>
			)}
			{/* Profile Avatar and Badges (only when open) */}
			{sidebarOpen && (
				<>
					<div className="flex flex-col items-center mb-4">
						<button
							onClick={onProfileClick}
							className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold text-white bg-gradient-to-br from-cyan-500 to-blue-700 border-4 border-cyan-400 shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer hover:border-cyan-300"
							title="Click to view profile"
						>
							{getInitialFromName(user?.name)}
						</button>
						<p className="text-gray-900 dark:text-white font-semibold text-lg mt-3">{user.name}</p>
					</div>
					<div className="mb-8 flex flex-row items-center justify-center space-x-3 w-full">
						<span className="flex items-center bg-gradient-to-r from-cyan-900 to-blue-900 text-cyan-300 px-3 py-2 rounded-lg font-semibold text-sm border border-cyan-700 shadow-md">
							FREE
						</span>
						<span className="flex items-center bg-gradient-to-r from-green-900 to-emerald-900 text-green-300 px-3 py-2 rounded-lg text-sm font-semibold border border-green-700 shadow-md">
							⏱️10
						</span>
						<span className="flex items-center bg-gradient-to-r from-purple-900 to-indigo-900 text-purple-300 px-3 py-2 rounded-lg text-sm font-semibold border border-purple-700 shadow-md">
							0
						</span>
					</div>
					<div className="flex w-full space-x-2 mt-2 mb-8">
						<button 
							onClick={() => setActiveTab("referral")}
							className="flex-1 bg-gradient-to-r from-cyan-700 to-blue-700 border border-cyan-400 text-white py-2 rounded-lg font-medium hover:bg-cyan-400 hover:text-black transition-all duration-200 flex items-center justify-center shadow-md hover:scale-105"
						>
							Referral
						</button>
						<button
							onClick={() => setActiveTab("subscription")}
							className="flex-1 bg-gradient-to-r from-cyan-700 to-blue-700 border border-cyan-400 text-white py-2 rounded-lg font-medium hover:bg-cyan-400 hover:text-black transition-all duration-200 flex items-center justify-center shadow-md hover:scale-105"
						>
							Subscription
						</button>
					</div>
				</>
			)}

			{/* Navigation (always visible, centered vertically when closed) */}
			<div
				className={`flex-1 flex ${
					sidebarOpen ? "flex-col" : "flex-col justify-center"
				} items-center w-full`}
			>
				<nav className="w-full">
					<ul
						className={`space-y-2 ${
							sidebarOpen
								? ""
								: "flex flex-col items-center justify-center space-y-6"
						}`}
					>
						{navTabs.map((tab) => (
							<li key={tab.id} className="w-full">
								<button
									onClick={() => setActiveTab(tab.id)}
									className={`flex items-center ${
										sidebarOpen ? "px-4 py-3" : "justify-center py-3"
									} w-full rounded-lg text-left font-medium transition-all duration-200 shadow-sm hover:scale-105
									${
										activeTab === tab.id
											? "bg-gradient-to-r from-cyan-900 to-blue-900 text-cyan-400 shadow-lg border border-cyan-700"
											: "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#23272f] hover:text-cyan-300 hover:shadow-md"
									}
								`}
									title={tab.name}
								>
									<tab.icon
										className={`w-5 h-5 transition-all duration-200 ${
											activeTab === tab.id
												? "text-cyan-400 scale-110"
												: "text-gray-400"
										} ${sidebarOpen ? "mr-3" : ""}`}
									/>
									{sidebarOpen && tab.name}
								</button>
							</li>
						))}
					</ul>
				</nav>
			</div>
		</aside>
	);
}
