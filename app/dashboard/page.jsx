"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import createClientForBrowser from "@/utils/supabase/client";
import {
	ChartBarIcon,
	ChatBubbleLeftRightIcon,
	PlayCircleIcon,
	BriefcaseIcon,
	ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

// Import modular components
import Sidebar from "./components/Sidebar";
import SidebarToggle from "./components/SidebarToggle";
import OverviewTab from "./components/OverviewTab";
import InterviewPrepTab from "./components/InterviewPrepTab";
import PracticeSessionsTab from "./components/PracticeSessionsTab";
import CareerToolsTab from "./components/CareerToolsTab";
import ProgressTab from "./components/ProgressTab";
import JobSearchTab from "./components/JobSearchTab";
import ProfilePage from "./components/ProfilePage";

export default function DashboardPage() {
	const [user, setUser] = useState(null);
	const [activeTab, setActiveTab] = useState("overview");
	const [isLoading, setIsLoading] = useState(true);
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [showProfile, setShowProfile] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const fetchUser = async () => {
			const supabase = createClientForBrowser();
			const { data, error } = await supabase.auth.getUser();
			if (data?.user) {
				const userObj = {
					name: data.user.user_metadata?.name || data.user.user_metadata?.firstName || data.user.email.split('@')[0],
					email: data.user.email,
					role: data.user.user_metadata?.role || "user",
					avatar: data.user.user_metadata?.avatar_url || "/avatar1.jpg",
				};
				if (userObj.role === "admin") {
					router.push("/admin");
					return;
				}
                // OTP verification check
                if (!data.user.email_confirmed_at) {
                  router.push(`/verify-otp?email=${encodeURIComponent(data.user.email)}`);
                  return;
                }
                // Onboarding check
                if (!data.user.user_metadata?.onboarded) {
                  router.push("/onboarding");
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

	const handleProfileClick = () => {
		setShowProfile(true);
	};

	const handleBackToDashboard = () => {
		setShowProfile(false);
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
		<div className="min-h-screen flex bg-gradient-to-br from-[#101113] via-[#18191b] to-[#23272f]">
			{/* Sidebar */}
			<Sidebar
				user={user}
				sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				ChartBarIcon={ChartBarIcon}
				ChatBubbleLeftRightIcon={ChatBubbleLeftRightIcon}
				PlayCircleIcon={PlayCircleIcon}
				BriefcaseIcon={BriefcaseIcon}
				ArrowTrendingUpIcon={ArrowTrendingUpIcon}
				onProfileClick={handleProfileClick}
				onLogout={handleLogout}
			/>
			<SidebarToggle sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

			{/* Main Content Area */}
			<div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
				sidebarOpen ? 'ml-0' : 'ml-0'
			}`}>
				{/* Main Card Content */}
				<div className="flex-1 flex flex-col items-center justify-start py-10 px-4 bg-[#101113]">
					<div className={`w-full max-w-5xl bg-[#18191b] rounded-2xl shadow-lg border border-gray-800 p-8 transition-all duration-300 ${
						sidebarOpen ? 'ml-0' : 'mx-auto'
					}`}>
						{/* Dashboard Header */}
						{showProfile ? (
							<ProfilePage user={user} onBack={handleBackToDashboard} />
						) : (
							<>
								{activeTab === "overview" && <OverviewTab user={user} />}
								{/* {activeTab === "interviews" && <InterviewPrepTab />} */}
								{activeTab === "practice" && <PracticeSessionsTab />}
								{activeTab === "career" && <CareerToolsTab />}
								{activeTab === "progress" && <ProgressTab />}
								{activeTab === "jobsearch" && <JobSearchTab />}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
