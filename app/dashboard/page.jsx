"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
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
import OverviewTab from "./components/OverviewTab";
import InterviewPrepTab from "./components/InterviewPrepTab";
import PracticeSessionsTab from "./components/PracticeSessionsTab";
import JobSearchTab from "./components/JobSearchTab";
import SubscriptionTab from "./components/SubscriptionTab";
import AssessmentTab from "./components/AssessmentTab";
import ProgressTab from "./components/ProgressTab";
import LinkedInOptimizerTab from "./components/LinkedInOptimizerTab";
import LinkedInPostGeneratorTab from "./components/LinkedInPostGeneratorTab";
import ReferralTab from "./components/ReferralTab";
import ProfileTab from "./components/ProfileTab";
import HistoryTab from "./components/HistoryTab";

export default function DashboardPage() {
	const { user: authUser, loading: authLoading, signOut, supabase } = useAuth();
	const [user, setUser] = useState(null);
	const [activeTab, setActiveTab] = useState("overview");
	const [isLoading, setIsLoading] = useState(true);
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [onboardingData, setOnboardingData] = useState(null);
	const [showOnboardingModal, setShowOnboardingModal] = useState(false);
	const router = useRouter();

	useEffect(() => {
		// Check for tab parameter in URL
		const urlParams = new URLSearchParams(window.location.search);
		const tabParam = urlParams.get('tab');
		if (tabParam) {
			setActiveTab(tabParam);
		}
	}, []);

	useEffect(() => {
		if (authLoading) return; // Wait for auth to load

		if (!authUser) {
			router.push("/login");
			return;
		}

		const userObj = {
			name:
				authUser.user_metadata?.name ||
				authUser.user_metadata?.firstName ||
				authUser.email.split("@")[0],
			email: authUser.email,
			role: authUser.user_metadata?.role || "user",
			avatar: authUser.user_metadata?.avatar_url || "/avatar1.jpg",
		};

		if (userObj.role === "admin") {
			router.push("/admin");
			return;
		}

		// OTP verification check
		if (!authUser.email_confirmed_at) {
			router.push(
				`/verify-otp?email=${encodeURIComponent(authUser.email)}`
			);
			return;
		}

		// Onboarding check
		if (!authUser.user_metadata?.onboarded) {
			router.push("/onboarding");
			return;
		}

		setUser(userObj);
		setIsLoading(false);
	}, [authUser, authLoading, router]);

	const handleLogout = async () => {
		await signOut();
		router.push("/");
	};

	const handleProfileClick = () => {
		setActiveTab("profile");
	};

	// Add fetch onboarding logic
	const fetchOnboardingData = async () => {
		if (!authUser) return;
		const { data, error } = await supabase
			.from("user_onboarding")
			.select("*")
			.eq("user_id", authUser.id)
			.single();
		if (error) {
			alert("Error fetching onboarding data: " + error.message);
			return;
		}
		setOnboardingData(data);
		setShowOnboardingModal(true);
	};

	// Replace setActiveTab with a handler that also closes the profile if open
	const handleTabChange = (tabId) => {
		setActiveTab(tabId);
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
		<div className="min-h-screen flex bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#232425] transition-colors duration-300">
			{/* Sidebar */}
			<Sidebar
				user={user}
				sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}
				activeTab={activeTab}
				setActiveTab={handleTabChange}
				ChartBarIcon={ChartBarIcon}
				ChatBubbleLeftRightIcon={ChatBubbleLeftRightIcon}
				PlayCircleIcon={PlayCircleIcon}
				BriefcaseIcon={BriefcaseIcon}
				ArrowTrendingUpIcon={ArrowTrendingUpIcon}
				onProfileClick={handleProfileClick}
				onLogout={handleLogout}
			/>

			{/* Main Content Area */}
			<div
				className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${sidebarOpen ? "ml-72" : "ml-16"
					}`}
			>
				{/* Main Card Content */}
				<div className="flex-1 flex flex-col items-center justify-start py-10 px-4 bg-[#0f0f0f] w-full transition-colors duration-300">
					<div
						className={`w-full max-w-5xl bg-[#1a1a1a] border border-gray-800 rounded-2xl shadow-lg p-8 transition-all duration-300 ${sidebarOpen ? "ml-0" : "mx-auto max-w-4xl"
							}`}
					>
						{/* Onboarding Data Modal */}
						{showOnboardingModal && onboardingData && (
							<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
								<div className="bg-[#1a1a1a] border border-gray-800 p-8 rounded-2xl shadow-2xl max-w-lg w-full relative">
									<button
										onClick={() => setShowOnboardingModal(false)}
										className="absolute top-2 right-2 text-gray-400 hover:text-cyan-400 text-2xl font-bold"
									>
										&times;
									</button>
									<h2 className="text-2xl font-bold text-cyan-400 mb-4">
										My Onboarding Details
									</h2>
									<div className="space-y-2 text-white max-h-96 overflow-y-auto">
										{Object.entries(onboardingData).map(([key, value]) => (
											<div key={key} className="flex flex-col">
												<span className="font-semibold text-cyan-300">
													{key
														.replace(/_/g, " ")
														.replace(/\b\w/g, (l) => l.toUpperCase())}
													:
												</span>
												<span className="ml-2 break-words">
													{Array.isArray(value)
														? value.join(", ")
														: value?.toString()}
												</span>
											</div>
										))}
									</div>
								</div>
							</div>
						)}
						{/* Dashboard Header */}
						<>
							{activeTab === "overview" && <OverviewTab user={user} />}
							{activeTab === "assessment" && <AssessmentTab />}
							{activeTab === "progress" && <ProgressTab />}
							{activeTab === "history" && <HistoryTab />}
							{activeTab === "subscription" && <SubscriptionTab />}
							{activeTab === "referral" && <ReferralTab />}
							{activeTab === "profile" && <ProfileTab />}
							{/* {activeTab === "interviews" && <InterviewPrepTab />} */}
							{/* {activeTab === "practice" && <PracticeSessionsTab />} */}
							{activeTab === "jobsearch" && <JobSearchTab />}
							{activeTab === "linkedin-optimizer" && <LinkedInOptimizerTab />}
							{activeTab === "linkedin-post-generator" && (
								<LinkedInPostGeneratorTab />
							)}
						</>
					</div>
				</div>
			</div>
		</div>
	);
}
