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
	XMarkIcon,
	CameraIcon,
	CloudArrowUpIcon
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
	const [profilePhoto, setProfilePhoto] = useState(null);
	const [isPhotoUploading, setIsPhotoUploading] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	// Always fetch profile data from Supabase on mount and on auth state change
	useEffect(() => {
		let isMounted = true;
		const fetchProfile = async () => {
			const supabase = createClientForBrowser();
			const { data: userData, error: userError } = await supabase.auth.getUser();
			if (!userData?.user) {
				router.replace('/login');
				return;
			}
			// Fetch profile from user_profile table (or users table)
			const { data: profileRow } = await supabase
				.from('users')
				.select('*')
				.eq('id', userData.user.id)
				.single();
			if (profileRow && isMounted) {
				setProfileData({
					name: profileRow.name || userData.user.user_metadata?.name || "",
					email: userData.user.email,
					phone: profileRow.phone || "",
					location: profileRow.location || "",
					education: profileRow.education || "",
					experience: profileRow.experience || "",
					bio: profileRow.bio || "",
					skills: profileRow.skills || [],
					interests: profileRow.interests || []
				});
			}
		};
		fetchProfile();
		// Listen for auth state changes
		const supabase = createClientForBrowser();
		const { data: listener } = supabase.auth.onAuthStateChange(() => {
			fetchProfile();
		});
		return () => {
			isMounted = false;
			listener?.subscription.unsubscribe();
		};
	}, [router]);

	const handleSave = async () => {
		setLoading(true);
		try {
			const supabase = createClientForBrowser();
			const { data: userData } = await supabase.auth.getUser();
			if (!userData?.user) return;
			// Update profile in users table
			await supabase
				.from('users')
				.update({
					name: profileData.name,
					phone: profileData.phone,
					location: profileData.location,
					education: profileData.education,
					experience: profileData.experience,
					bio: profileData.bio,
					skills: profileData.skills,
					interests: profileData.interests
				})
				.eq('id', userData.user.id);
			setIsEditing(false);
		} catch (error) {
			console.error('Error saving profile:', error);
		} finally {
			setLoading(false);
		}
	};

	const handlePhotoUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) { // 5MB limit
				alert("File size must be less than 5MB");
				return;
			}
			
			if (!file.type.startsWith('image/')) {
				alert("Please upload an image file");
				return;
			}

			setIsPhotoUploading(true);
			
			// Simulate photo upload
			setTimeout(() => {
				const reader = new FileReader();
				reader.onload = (e) => {
					setProfilePhoto(e.target.result);
					setIsPhotoUploading(false);
				};
				reader.readAsDataURL(file);
			}, 1500);
		}
	};

	const handleLogout = async () => {
		const supabase = createClientForBrowser();
		await supabase.auth.signOut();
		setProfileData({
			name: "",
			email: "",
			phone: "",
			location: "",
			education: "",
			experience: "",
			bio: "",
			skills: [],
			interests: []
		});
		router.push('/login');
	};

	const handleCancel = () => {
		setIsEditing(false);
		// Refetch profile from Supabase
		const fetchProfile = async () => {
			const supabase = createClientForBrowser();
			const { data: userData } = await supabase.auth.getUser();
			if (!userData?.user) return;
			const { data: profileRow } = await supabase
				.from('users')
				.select('*')
				.eq('id', userData.user.id)
				.single();
			if (profileRow) {
				setProfileData({
					name: profileRow.name || userData.user.user_metadata?.name || "",
					email: userData.user.email,
					phone: profileRow.phone || "",
					location: profileRow.location || "",
					education: profileRow.education || "",
					experience: profileRow.experience || "",
					bio: profileRow.bio || "",
					skills: profileRow.skills || [],
					interests: profileRow.interests || []
				});
			}
		};
		fetchProfile();
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
					<div className="relative">
						{profilePhoto ? (
							<div className="w-20 h-20 rounded-full overflow-hidden border-4 border-cyan-400 shadow-lg">
								<img
									src={profilePhoto}
									alt="Profile"
									className="w-full h-full object-cover"
								/>
							</div>
						) : (
							<div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-br from-cyan-500 to-blue-700 border-4 border-cyan-400 shadow-lg">
								{getInitialFromName(profileData.name)}
							</div>
						)}
						
						{/* Photo Upload Button */}
						<label className="absolute -bottom-1 -right-1 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-cyan-300 transition-colors duration-200 shadow-lg">
							<CameraIcon className="w-4 h-4 text-black" />
							<input
								type="file"
								accept="image/*"
								onChange={handlePhotoUpload}
								className="sr-only"
								disabled={isPhotoUploading}
							/>
						</label>
						
						{isPhotoUploading && (
							<div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
								<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
							</div>
						)}
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
						className="w-full flex items-center px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 shadow-sm text-red-400 hover:bg-red-900 hover:text-red-300 hover:shadow-md border border-red-400 bg-gradient-to-r from-red-600 to-red-800 mt-4"
					>
						<svg className="w-5 h-5 mr-3 transition-all duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
						</svg>
						<span className="text-gray-100">Logout</span>
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