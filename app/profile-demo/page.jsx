'use client';
import { useState } from 'react';
import { FiEdit2, FiCheck, FiX, FiLogOut, FiCamera, FiArrowLeft, FiUser, FiMail, FiCalendar, FiShield } from 'react-icons/fi';
import Image from 'next/image';

export default function ProfileDemoPage() {
    const [editField, setEditField] = useState(null);
    const [form, setForm] = useState({ name: 'John Doe', email: 'john.doe@example.com' });
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [imageError, setImageError] = useState(false);

    // Mock user data for demo
    const user = {
        email: 'john.doe@example.com',
        created_at: '2024-01-15T10:30:00Z',
        last_sign_in_at: '2024-11-06T08:00:00Z',
        app_metadata: { provider: 'email' },
        user_metadata: { name: 'John Doe' }
    };

    // Utility functions
    const getInitialFromName = (name, email) => {
        if (name) {
            return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
        if (email) {
            return email[0].toUpperCase();
        }
        return '?';
    };

    const getProfileImageUrl = (user) => {
        return null; // No image for demo
    };

    const getUserDisplayName = (user) => {
        return user?.user_metadata?.name ||
            user?.user_metadata?.full_name ||
            user?.name ||
            user?.email?.split('@')[0] ||
            'User';
    };

    const handleEdit = (field) => {
        setEditField(field);
        setError('');
        setSuccess('');
    };

    const handleCancel = () => {
        setEditField(null);
        setError('');
        setSuccess('');
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = (field) => {
        setSuccess('Demo: Changes would be saved in real app!');
        setEditField(null);
    };

    const handlePhotoUpload = (e) => {
        setSuccess('Demo: Photo would be uploaded in real app!');
    };

    const profileImageUrl = getProfileImageUrl(user);
    const displayName = getUserDisplayName(user);
    const initials = getInitialFromName(displayName, user?.email);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-8 px-4 overflow-hidden">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-500/10 to-teal-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Enhanced Header */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center space-x-6">
                        <button className="group p-4 rounded-2xl bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-700/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25">
                            <FiArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" />
                        </button>
                        <div className="space-y-2">
                            <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent tracking-tight">
                                Profile Settings
                            </h1>
                            <p className="text-gray-400 text-lg font-medium">Customize your account and preferences</p>
                        </div>
                    </div>

                    {/* Action buttons with better alignment */}
                    <div className="flex items-center space-x-4">
                        <button className="group px-6 py-3 bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 text-gray-300 rounded-xl hover:bg-gray-700/40 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center space-x-2">
                            <FiShield className="w-4 h-4" />
                            <span className="font-medium">Settings</span>
                        </button>
                        <button className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-xl shadow-red-500/25 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/40">
                            <FiLogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                            <span className="font-bold">Sign Out</span>
                        </button>
                    </div>
                </div>

                {/* Enhanced Alert Messages */}
                {error && (
                    <div className="mb-8 p-6 bg-red-900/30 backdrop-blur-xl border border-red-500/40 rounded-2xl shadow-xl shadow-red-500/10 animate-in slide-in-from-top duration-500">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                            <p className="text-red-300 font-semibold text-lg">{error}</p>
                        </div>
                    </div>
                )}
                {success && (
                    <div className="mb-8 p-6 bg-green-900/30 backdrop-blur-xl border border-green-500/40 rounded-2xl shadow-xl shadow-green-500/10 animate-in slide-in-from-top duration-500">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <p className="text-green-300 font-semibold text-lg">{success}</p>
                        </div>
                    </div>
                )}

                {/* Enhanced Main Content */}
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
                    {/* Enhanced Profile Picture Card */}
                    <div className="xl:col-span-2">
                        <div className="group bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-10 h-fit hover:bg-gray-800/40 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10">
                            <h2 className="text-3xl font-bold text-white mb-10 flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                                    <FiUser className="w-5 h-5 text-white" />
                                </div>
                                Profile Picture
                            </h2>

                            <div className="flex flex-col items-center space-y-8">
                                {/* Enhanced Avatar */}
                                <div className="relative group/avatar">
                                    <div className="w-48 h-48 rounded-full p-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:from-cyan-300 hover:via-blue-400 hover:to-purple-500 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30">
                                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 flex items-center justify-center relative">
                                            <span className="text-5xl font-black text-white group-hover/avatar:scale-110 transition-transform duration-500">
                                                {initials}
                                            </span>

                                            {/* Hover overlay */}
                                            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <FiCamera className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enhanced Upload Button */}
                                    <label className="absolute bottom-4 right-4 cursor-pointer group/upload">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            className="hidden"
                                            disabled={uploading}
                                        />
                                        <div className="p-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-2xl text-white transition-all duration-300 shadow-xl shadow-cyan-500/30 hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/50 border-4 border-white">
                                            <FiCamera className="w-6 h-6 group-hover/upload:rotate-12 transition-transform duration-300" />
                                        </div>
                                    </label>
                                </div>

                                <div className="text-center space-y-4">
                                    <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{displayName}</h3>
                                    <p className="text-gray-400 text-lg font-medium">{user?.email}</p>
                                    <div className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/30">
                                        <p className="text-gray-300 font-semibold mb-2">Upload Guidelines</p>
                                        <p className="text-gray-400 text-sm">JPG, PNG up to 10MB</p>
                                        <p className="text-gray-400 text-sm">Square images work best</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Profile Information Card */}
                    <div className="xl:col-span-3">
                        <div className="group bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-10 hover:bg-gray-800/40 transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl hover:shadow-blue-500/10">
                            <h2 className="text-3xl font-bold text-white mb-10 flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                                    <FiEdit2 className="w-5 h-5 text-white" />
                                </div>
                                Personal Information
                            </h2>

                            <div className="space-y-8">
                                {/* Enhanced Name Field */}
                                <div className="group/field">
                                    <label className="flex items-center text-lg font-bold text-gray-300 mb-4">
                                        <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                                            <FiUser className="w-3 h-3 text-white" />
                                        </div>
                                        Full Name
                                    </label>
                                    {editField === 'name' ? (
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                className="flex-1 px-6 py-4 bg-gray-700/40 backdrop-blur-xl border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-lg font-medium focus:scale-[1.02]"
                                                placeholder="Enter your full name"
                                            />
                                            <button
                                                onClick={() => handleSave('name')}
                                                className="p-4 text-green-400 hover:bg-green-900/30 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-green-500/25"
                                            >
                                                <FiCheck className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="p-4 text-red-400 hover:bg-red-900/30 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/25"
                                            >
                                                <FiX className="w-6 h-6" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="group/display flex items-center justify-between p-6 bg-gradient-to-r from-gray-700/20 to-gray-600/20 backdrop-blur-xl rounded-2xl border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                                            <span className="text-white font-semibold text-lg">{form.name || 'Not set'}</span>
                                            <button
                                                onClick={() => handleEdit('name')}
                                                className="p-3 text-gray-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110 hover:bg-cyan-900/20 rounded-xl"
                                            >
                                                <FiEdit2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Enhanced Email Field */}
                                <div className="group/field">
                                    <label className="flex items-center text-lg font-bold text-gray-300 mb-4">
                                        <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                                            <FiMail className="w-3 h-3 text-white" />
                                        </div>
                                        Email Address
                                    </label>
                                    <div className="group/display flex items-center justify-between p-6 bg-gradient-to-r from-gray-700/20 to-gray-600/20 backdrop-blur-xl rounded-2xl border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                                        <span className="text-white font-semibold text-lg">{form.email}</span>
                                        <button
                                            onClick={() => handleEdit('email')}
                                            className="p-3 text-gray-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110 hover:bg-cyan-900/20 rounded-xl"
                                        >
                                            <FiEdit2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Enhanced Account Type */}
                                <div className="group/field">
                                    <label className="flex items-center text-lg font-bold text-gray-300 mb-4">
                                        <div className="w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                                            <FiShield className="w-3 h-3 text-white" />
                                        </div>
                                        Account Type
                                    </label>
                                    <div className="p-6 bg-gradient-to-r from-gray-700/20 to-gray-600/20 backdrop-blur-xl rounded-2xl border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300 hover:scale-[1.02]">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                                            <span className="text-white font-semibold text-lg">📧 Email Account</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Member Since */}
                                <div className="group/field">
                                    <label className="flex items-center text-lg font-bold text-gray-300 mb-4">
                                        <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                                            <FiCalendar className="w-3 h-3 text-white" />
                                        </div>
                                        Member Since
                                    </label>
                                    <div className="p-6 bg-gradient-to-r from-gray-700/20 to-gray-600/20 backdrop-blur-xl rounded-2xl border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300 hover:scale-[1.02]">
                                        <span className="text-white font-semibold text-lg">
                                            🗓️ {new Date(user?.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Additional Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
                    {/* Enhanced Security Card */}
                    <div className="group bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 hover:bg-gray-800/40 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/10">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                                <FiShield className="w-5 h-5 text-white" />
                            </div>
                            Security & Privacy
                        </h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center p-4 bg-gray-700/20 rounded-2xl border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300">
                                <span className="text-gray-300 font-medium">Two-factor authentication</span>
                                <span className="px-3 py-1 bg-red-900/30 text-red-400 text-sm font-semibold rounded-full border border-red-500/30">Disabled</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-700/20 rounded-2xl border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300">
                                <span className="text-gray-300 font-medium">Last login</span>
                                <span className="text-cyan-400 text-sm font-semibold">
                                    {new Date(user?.last_sign_in_at).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-700/20 rounded-2xl border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300">
                                <span className="text-gray-300 font-medium">Account status</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-green-400 text-sm font-semibold">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Statistics Card */}
                    <div className="group bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 hover:bg-gray-800/40 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                                <FiUser className="w-5 h-5 text-white" />
                            </div>
                            Account Statistics
                        </h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center p-4 bg-gray-700/20 rounded-2xl border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300">
                                <span className="text-gray-300 font-medium">Total assessments</span>
                                <span className="px-4 py-2 bg-cyan-900/30 text-cyan-400 font-bold text-lg rounded-xl border border-cyan-500/30">0</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-700/20 rounded-2xl border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300">
                                <span className="text-gray-300 font-medium">Profile completion</span>
                                <div className="flex items-center space-x-3">
                                    <div className="w-20 h-2 bg-gray-600 rounded-full overflow-hidden">
                                        <div className="w-[85%] h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                                    </div>
                                    <span className="text-green-400 font-bold text-lg">85%</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-700/20 rounded-2xl border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300">
                                <span className="text-gray-300 font-medium">Account level</span>
                                <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-sm rounded-xl">FREE TIER</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Action Buttons Row */}
                <div className="mt-12 flex flex-wrap justify-center gap-6">
                    <button onClick={() => setSuccess('Demo: Edit Profile clicked!')} className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/40 border-2 border-cyan-400/20">
                        <FiEdit2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="font-bold">Edit Profile</span>
                    </button>

                    <button onClick={() => setSuccess('Demo: Privacy Settings clicked!')} className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40 border-2 border-purple-400/20">
                        <FiShield className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="font-bold">Privacy Settings</span>
                    </button>

                    <button onClick={() => setSuccess('Demo: Account Details clicked!')} className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/40 border-2 border-emerald-400/20">
                        <FiUser className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="font-bold">Account Details</span>
                    </button>
                </div>
            </div>
        </div>
    );
}