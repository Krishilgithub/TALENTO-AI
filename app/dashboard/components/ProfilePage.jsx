"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import createClientForBrowser from "@/utils/supabase/client";
import { getInitialFromName } from "../../../utils/getInitialFromName";
import { 
	UserIcon, 
	EnvelopeIcon, 
	PhoneIcon, 
	MapPinIcon, 
	AcademicCapIcon,
	BriefcaseIcon,
	ArrowLeftIcon,
	PencilIcon,
	CheckIcon,
	XMarkIcon
} from '@heroicons/react/24/outline';

export default function ProfilePage({ user, onBack }) {
	const [isEditing, setIsEditing] = useState(false);
	const [profileData, setProfileData] = useState({
		name: user?.name || "",
		email: user?.email || "",
		phone: "",
		location: "",
		education: "",
		experience: "",
		bio: "",
		skills: [],
		interests: []
	});
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	useEffect(() => {
		// Load profile data from localStorage or API
		const savedProfile = localStorage.getItem('userProfile');
		if (savedProfile) {
			setProfileData(JSON.parse(savedProfile));
		}
	}, []);

	const handleSave = async () => {
		setLoading(true);
		try {
			// Save to localStorage for now (can be replaced with API call)
			localStorage.setItem('userProfile', JSON.stringify(profileData));
			
			// Update user metadata in Supabase
			const supabase = createClientForBrowser();
			await supabase.auth.updateUser({
				data: { 
					name: profileData.name,
					phone: profileData.phone,
					location: profileData.location,
					education: profileData.education,
					experience: profileData.experience,
					bio: profileData.bio,
					skills: profileData.skills,
					interests: profileData.interests
				}
			});
			
			setIsEditing(false);
		} catch (error) {
			console.error('Error saving profile:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = async () => {
		const supabase = createClientForBrowser();
		await supabase.auth.signOut();
		router.push('/login');
	};

	const handleCancel = () => {
		setIsEditing(false);
		// Reset to original data
		const savedProfile = localStorage.getItem('userProfile');
		if (savedProfile) {
			setProfileData(JSON.parse(savedProfile));
		}
	};

	return (
		<div className="space-y-6 animate-fadeIn">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-4">
					<button
						onClick={onBack}
						className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-200"
					>
						<ArrowLeftIcon className="w-5 h-5 text-white" />
					</button>
					<h2 className="text-2xl font-bold text-white">Profile</h2>
				</div>
				<div className="flex gap-3">
					{isEditing ? (
						<>
							<button
								onClick={handleCancel}
								className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-all duration-200"
							>
								<XMarkIcon className="w-4 h-4" />
								Cancel
							</button>
							<button
								onClick={handleSave}
								disabled={loading}
								className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-400 text-black hover:bg-cyan-300 transition-all duration-200 disabled:opacity-50"
							>
								<CheckIcon className="w-4 h-4" />
								{loading ? 'Saving...' : 'Save'}
							</button>
						</>
					) : (
						<button
							onClick={() => setIsEditing(true)}
							className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-400 text-black hover:bg-cyan-300 transition-all duration-200"
						>
							<PencilIcon className="w-4 h-4" />
							Edit Profile
						</button>
					)}
				</div>
			</div>

			{/* Profile Card */}
			<div className="bg-[#232323] rounded-xl p-6 border border-gray-700">
				{/* Avatar and Basic Info */}
				<div className="flex items-center gap-6 mb-8">
					<div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-br from-cyan-500 to-blue-700 border-4 border-cyan-400 shadow-lg">
						{getInitialFromName(profileData.name)}
					</div>
					<div className="flex-1">
						{isEditing ? (
							<input
								type="text"
								value={profileData.name}
								onChange={(e) => setProfileData({...profileData, name: e.target.value})}
								className="text-2xl font-bold text-white bg-transparent border-b border-gray-600 focus:border-cyan-400 outline-none"
							/>
						) : (
							<h3 className="text-2xl font-bold text-white">{profileData.name}</h3>
						)}
						<p className="text-gray-400">{profileData.email}</p>
					</div>
				</div>

				{/* Profile Details Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Contact Information */}
					<div className="space-y-4">
						<h4 className="text-lg font-semibold text-cyan-400 mb-4">Contact Information</h4>
						
						<div className="space-y-3">
							<div className="flex items-center gap-3">
								<EnvelopeIcon className="w-5 h-5 text-gray-400" />
								<span className="text-gray-300">{profileData.email}</span>
							</div>
							
							<div className="flex items-center gap-3">
								<PhoneIcon className="w-5 h-5 text-gray-400" />
								{isEditing ? (
									<input
										type="tel"
										value={profileData.phone}
										onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
										placeholder="Phone number"
										className="flex-1 bg-transparent text-gray-300 border-b border-gray-600 focus:border-cyan-400 outline-none"
									/>
								) : (
									<span className="text-gray-300">{profileData.phone || "Not provided"}</span>
								)}
							</div>
							
							<div className="flex items-center gap-3">
								<MapPinIcon className="w-5 h-5 text-gray-400" />
								{isEditing ? (
									<input
										type="text"
										value={profileData.location}
										onChange={(e) => setProfileData({...profileData, location: e.target.value})}
										placeholder="Location"
										className="flex-1 bg-transparent text-gray-300 border-b border-gray-600 focus:border-cyan-400 outline-none"
									/>
								) : (
									<span className="text-gray-300">{profileData.location || "Not provided"}</span>
								)}
							</div>
						</div>
					</div>

					{/* Professional Information */}
					<div className="space-y-4">
						<h4 className="text-lg font-semibold text-cyan-400 mb-4">Professional Information</h4>
						
						<div className="space-y-3">
							<div className="flex items-center gap-3">
								<AcademicCapIcon className="w-5 h-5 text-gray-400" />
								{isEditing ? (
									<input
										type="text"
										value={profileData.education}
										onChange={(e) => setProfileData({...profileData, education: e.target.value})}
										placeholder="Education"
										className="flex-1 bg-transparent text-gray-300 border-b border-gray-600 focus:border-cyan-400 outline-none"
									/>
								) : (
									<span className="text-gray-300">{profileData.education || "Not provided"}</span>
								)}
							</div>
							
							<div className="flex items-center gap-3">
								<BriefcaseIcon className="w-5 h-5 text-gray-400" />
								{isEditing ? (
									<input
										type="text"
										value={profileData.experience}
										onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
										placeholder="Experience"
										className="flex-1 bg-transparent text-gray-300 border-b border-gray-600 focus:border-cyan-400 outline-none"
									/>
								) : (
									<span className="text-gray-300">{profileData.experience || "Not provided"}</span>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Bio Section */}
				<div className="mt-6">
					<h4 className="text-lg font-semibold text-cyan-400 mb-3">Bio</h4>
					{isEditing ? (
						<textarea
							value={profileData.bio}
							onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
							placeholder="Tell us about yourself..."
							rows={4}
							className="w-full bg-transparent text-gray-300 border border-gray-600 rounded-lg p-3 focus:border-cyan-400 outline-none resize-none"
						/>
					) : (
						<p className="text-gray-300">{profileData.bio || "No bio provided"}</p>
					)}
				</div>
			</div>

			{/* Account Actions */}
			<div className="bg-[#232323] rounded-xl p-6 border border-gray-700">
				<h4 className="text-lg font-semibold text-cyan-400 mb-4">Account Actions</h4>
				<div className="space-y-3">
					<button className="w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-200 text-white">
						Change Password
					</button>
					<button className="w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-200 text-white">
						Privacy Settings
					</button>
					<button className="w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-200 text-white">
						Notification Preferences
					</button>
					<button 
						onClick={handleLogout}
						className="w-full text-left p-3 rounded-lg bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition-all duration-200 text-white border border-red-400"
					>
						🚪 Logout
					</button>
				</div>
			</div>

			<style jsx>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				.animate-fadeIn {
					animation: fadeIn 0.5s ease-out;
				}
			`}</style>
		</div>
	);
} 