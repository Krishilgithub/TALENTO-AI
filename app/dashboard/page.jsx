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
// import { Dialog } from '@headlessui/react';

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
	const [onboardingData, setOnboardingData] = useState(null);
	const [showOnboardingModal, setShowOnboardingModal] = useState(false);
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

	// Add fetch onboarding logic
	const fetchOnboardingData = async () => {
		if (!user) return;
		const supabase = createClientForBrowser();
		// Get the current user's id
		const { data: authData } = await supabase.auth.getUser();
		const userId = authData?.user?.id;
		if (!userId) return;
		const { data, error } = await supabase
			.from('user_onboarding')
			.select('*')
			.eq('user_id', userId)
			.single();
		if (error) {
			alert('Error fetching onboarding data: ' + error.message);
			return;
		}
		setOnboardingData(data);
		setShowOnboardingModal(true);
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
						{/* Fetch Onboarding Data Button */}
						<button
							onClick={fetchOnboardingData}
							className="mb-6 px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-300 hover:to-blue-400 transition-all duration-200 shadow-lg"
						>
							Show My Onboarding Details
						</button>
						{/* Onboarding Data Modal */}
						{showOnboardingModal && onboardingData && (
							<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
								<div className="bg-[#18191b] p-8 rounded-2xl shadow-2xl max-w-lg w-full relative">
									<button
										onClick={() => setShowOnboardingModal(false)}
										className="absolute top-2 right-2 text-gray-400 hover:text-cyan-400 text-2xl font-bold"
									>
										&times;
									</button>
									<h2 className="text-2xl font-bold text-cyan-400 mb-4">My Onboarding Details</h2>
									<div className="space-y-2 text-gray-200 max-h-96 overflow-y-auto">
										{Object.entries(onboardingData).map(([key, value]) => (
											<div key={key} className="flex flex-col">
												<span className="font-semibold text-cyan-300">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span>
												<span className="ml-2 break-words">{Array.isArray(value) ? value.join(', ') : value?.toString()}</span>
											</div>
										))}
									</div>
								</div>
							</div>
						)}
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
