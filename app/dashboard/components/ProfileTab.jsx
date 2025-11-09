'use client';
import { useEffect, useState } from 'react';
import { FiEdit2, FiCheck, FiX, FiLogOut, FiCamera, FiArrowLeft, FiUser, FiMail, FiCalendar, FiShield, FiLock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProfileTab() {
    const { user: authUser, loading: authLoading, updateUser, signOut, supabase } = useAuth();
    const { profileImageUrl, imageError, updateProfileImage, handleImageError } = useProfile();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [editField, setEditField] = useState(null);
    const [form, setForm] = useState({ name: '', email: '' });
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Change password states
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    // Onboarding data
    const [onboardingData, setOnboardingData] = useState(null);
    const [showOnboardingDetails, setShowOnboardingDetails] = useState(false);

    const router = useRouter();

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
        if (user?.user_metadata?.avatar_url) {
            return user.user_metadata.avatar_url;
        }
        if (user?.avatar_url) {
            return user.avatar_url;
        }
        return null;
    };

    const getUserDisplayName = (user) => {
        return user?.user_metadata?.name ||
            user?.user_metadata?.full_name ||
            user?.name ||
            user?.email?.split('@')[0] ||
            'User';
    };

    const withLoadingCursor = (fn) => {
        return async (...args) => {
            document.body.style.cursor = 'wait';
            try {
                return await fn(...args);
            } finally {
                document.body.style.cursor = 'default';
            }
        };
    };

    // Fetch onboarding data
    const fetchOnboardingData = async () => {
        if (!authUser) return;

        try {
            const { data, error } = await supabase
                .from("user_onboarding")
                .select("*")
                .eq("user_id", authUser.id)
                .single();

            if (error) {
                console.log('No onboarding data found or error:', error.message);
            } else {
                setOnboardingData(data);
            }
        } catch (error) {
            console.log('Error fetching onboarding data:', error);
        }
    };

    useEffect(() => {
        if (authLoading) return;

        if (!authUser) {
            router.push('/login');
            return;
        }

        setUser(authUser);
        setForm({
            name: getUserDisplayName(authUser),
            email: authUser.email || ''
        });
        fetchOnboardingData();
        setIsLoading(false);
    }, [authUser, authLoading, router]); const handleFieldEdit = (field) => {
        setEditField(field);
        setError('');
        setSuccess('');
    };

    const handleFieldCancel = () => {
        setEditField(null);
        setForm({
            name: getUserDisplayName(user),
            email: user?.email || ''
        });
        setError('');
    };

    const handleFieldSave = withLoadingCursor(async (field) => {
        if (!form[field].trim()) {
            setError(`${field.charAt(0).toUpperCase() + field.slice(1)} cannot be empty`);
            return;
        }

        try {
            const updates = {};
            if (field === 'name') {
                updates.data = {
                    ...user.user_metadata,
                    name: form.name.trim(),
                    full_name: form.name.trim()
                };
            } else if (field === 'email') {
                updates.email = form.email.trim();
            }

            const { data, error } = await supabase.auth.updateUser(updates);

            if (error) throw error;

            await updateUser();
            setUser(data.user);
            setEditField(null);
            setSuccess(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);

            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
            setError(error.message || `Failed to update ${field}`);
        }
    });

    const handleImageUpload = withLoadingCursor(async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file');
            return;
        }

        setUploading(true);
        setError('');

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/avatar.${fileExt}`;
            const filePath = fileName;

            console.log('Uploading to path:', filePath);

            const { error: uploadError, data: uploadData } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                throw uploadError;
            }

            console.log('Upload successful:', uploadData);

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            console.log('Public URL:', publicUrl);

            const { data, error: updateError } = await supabase.auth.updateUser({
                data: {
                    ...user.user_metadata,
                    avatar_url: publicUrl
                }
            });

            if (updateError) {
                console.error('User update error:', updateError);
                throw updateError;
            }

            await updateUser();
            setUser(data.user);
            updateProfileImage(publicUrl); // Update shared profile context
            setSuccess('Profile picture updated successfully!');
            setTimeout(() => setSuccess(''), 3000);

        } catch (error) {
            console.error('Error uploading image:', error);
            setError(`Failed to upload image: ${error.message}`);
        } finally {
            setUploading(false);
        }
    });

    const handleSignOut = withLoadingCursor(async () => {
        try {
            await signOut();
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
            setError('Failed to sign out');
        }
    });

    const handleChangePassword = withLoadingCursor(async () => {
        setPasswordError('');
        setPasswordSuccess('');

        if (!newPassword || !confirmPassword) {
            setPasswordError('Please fill in both password fields.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match.');
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters long.');
            return;
        }

        setIsPasswordUpdating(true);

        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });

            if (error) {
                setPasswordError(error.message);
            } else {
                setPasswordSuccess('Password updated successfully!');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => {
                    setPasswordSuccess('');
                    setShowChangePassword(false);
                }, 3000);
            }
        } catch (e) {
            console.error('Password update error:', e);
            setPasswordError('Failed to update password.');
        } finally {
            setIsPasswordUpdating(false);
        }
    }); if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
            </div>
        );
    }

    const displayName = getUserDisplayName(user);
    const initials = getInitialFromName(displayName, user?.email);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <h1 className="text-4xl font-bold text-white">
                        My Profile
                    </h1>
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto">
                    {/* Error/Success Messages */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 flex items-center gap-2">
                            <FiX className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 flex items-center gap-2">
                            <FiCheck className="w-5 h-5" />
                            {success}
                        </div>
                    )}

                    {/* Profile Card */}
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                        {/* Profile Picture Section */}
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="flex flex-col items-center">
                                <div className="relative group">
                                    <div className="w-48 h-48 rounded-full p-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 shadow-2xl">
                                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 flex items-center justify-center relative">
                                            {profileImageUrl && !imageError ? (
                                                <Image
                                                    src={profileImageUrl}
                                                    alt={displayName}
                                                    fill
                                                    className="object-cover hover:scale-105 transition-transform duration-300"
                                                    onError={handleImageError}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-white bg-gradient-to-br from-cyan-500 to-blue-700">
                                                    {initials}
                                                </div>
                                            )}

                                            {/* Upload Overlay */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-full">
                                                <label htmlFor="avatar-upload" className="cursor-pointer">
                                                    <FiCamera className="w-8 h-8 text-white" />
                                                </label>
                                                <input
                                                    id="avatar-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                    disabled={uploading}
                                                />
                                            </div>

                                            {uploading && (
                                                <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-full">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-400 text-sm mt-4 text-center max-w-xs">
                                    Click the camera icon to upload a new profile picture (max 5MB)
                                </p>
                            </div>

                            {/* Profile Information */}
                            <div className="flex-1 space-y-6">
                                {/* Name Field */}
                                <div className="space-y-2">
                                    <label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                                        <FiUser className="w-4 h-4" />
                                        Display Name
                                    </label>
                                    {editField === 'name' ? (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                                                placeholder="Enter your display name"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleFieldSave('name')}
                                                className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
                                            >
                                                <FiCheck className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={handleFieldCancel}
                                                className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
                                            >
                                                <FiX className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between bg-gray-700/30 border border-gray-600/50 rounded-lg px-4 py-3">
                                            <span className="text-white text-lg">{displayName}</span>
                                            <button
                                                onClick={() => handleFieldEdit('name')}
                                                className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 flex items-center gap-2"
                                            >
                                                <FiEdit2 className="w-4 h-4" />
                                                Edit
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                                        <FiMail className="w-4 h-4" />
                                        Email Address
                                    </label>
                                    {editField === 'email' ? (
                                        <div className="flex gap-2">
                                            <input
                                                type="email"
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                                                placeholder="Enter your email address"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleFieldSave('email')}
                                                className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
                                            >
                                                <FiCheck className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={handleFieldCancel}
                                                className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
                                            >
                                                <FiX className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between bg-gray-700/30 border border-gray-600/50 rounded-lg px-4 py-3">
                                            <span className="text-white text-lg">{user?.email}</span>
                                            <button
                                                onClick={() => handleFieldEdit('email')}
                                                className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 flex items-center gap-2"
                                            >
                                                <FiEdit2 className="w-4 h-4" />
                                                Edit
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Account Info */}
                                <div className="space-y-4">
                                    <h3 className="text-gray-300 text-sm font-medium flex items-center gap-2">
                                        <FiShield className="w-4 h-4" />
                                        Account Information
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gray-700/30 border border-gray-600/50 rounded-lg px-4 py-3 hover:border-gray-500/50 transition-all duration-300">
                                            <div className="text-gray-400 text-sm">Account Created</div>
                                            <div className="text-white flex items-center gap-2">
                                                <FiCalendar className="w-4 h-4" />
                                                {new Date(user?.created_at).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <div className="bg-gray-700/30 border border-gray-600/50 rounded-lg px-4 py-3 hover:border-gray-500/50 transition-all duration-300">
                                            <div className="text-gray-400 text-sm">Account Status</div>
                                            <div className="text-white flex items-center gap-2">
                                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                                <span className="text-green-400 font-semibold">Active</span>
                                            </div>
                                        </div>

                                        {onboardingData && (
                                            <div className="md:col-span-2">
                                                <button
                                                    onClick={() => setShowOnboardingDetails(!showOnboardingDetails)}
                                                    className="w-full bg-gray-700/30 border border-gray-600/50 rounded-lg px-4 py-3 hover:border-cyan-500/50 transition-all duration-300 text-left"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-gray-400 text-sm">Onboarding Details</div>
                                                        <div className="text-cyan-400 text-sm">
                                                            {showOnboardingDetails ? '▼ Hide' : '▶ Show'}
                                                        </div>
                                                    </div>
                                                    <div className="text-white flex items-center gap-2 mt-1">
                                                        <FiUser className="w-4 h-4 text-cyan-400" />
                                                        <span className="text-cyan-400 font-semibold">Profile Setup Completed</span>
                                                    </div>
                                                </button>

                                                {showOnboardingDetails && (
                                                    <div className="mt-4 bg-gray-800/30 border border-gray-600/30 rounded-lg p-4 space-y-3 max-h-60 overflow-y-auto">
                                                        <h4 className="text-cyan-400 font-semibold text-sm mb-3">Your Onboarding Information</h4>
                                                        {Object.entries(onboardingData).map(([key, value]) => {
                                                            if (key === 'id' || key === 'user_id' || key === 'created_at' || key === 'updated_at') return null;
                                                            return (
                                                                <div key={key} className="flex flex-col">
                                                                    <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                                                                        {key.replace(/_/g, ' ')}
                                                                    </span>
                                                                    <span className="text-white text-sm mt-1 break-words">
                                                                        {Array.isArray(value)
                                                                            ? value.join(', ')
                                                                            : typeof value === 'object'
                                                                                ? JSON.stringify(value, null, 2)
                                                                                : value?.toString() || 'Not specified'
                                                                        }
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Account Statistics */}
                                <div className="space-y-4">
                                    <h3 className="text-gray-300 text-sm font-medium flex items-center gap-2">
                                        <FiUser className="w-4 h-4" />
                                        Account Statistics
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gray-700/30 border border-gray-600/50 rounded-lg px-4 py-3 hover:border-gray-500/50 transition-all duration-300">
                                            <div className="text-gray-400 text-sm">Total Assessments</div>
                                            <div className="text-white flex items-center gap-2">
                                                <span className="text-2xl font-bold text-cyan-400">0</span>
                                            </div>
                                        </div>

                                        <div className="bg-gray-700/30 border border-gray-600/50 rounded-lg px-4 py-3 hover:border-gray-500/50 transition-all duration-300">
                                            <div className="text-gray-400 text-sm">Profile Completion</div>
                                            <div className="text-white flex items-center gap-3">
                                                <div className="flex-1 h-2 bg-gray-600 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full w-[85%]"></div>
                                                </div>
                                                <span className="text-green-400 font-bold">85%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-4 pt-6">
                                    <h3 className="text-gray-300 text-sm font-medium flex items-center gap-2">
                                        Account Actions
                                    </h3>

                                    <div className="space-y-4">
                                        {/* Change Password Button */}
                                        <button
                                            onClick={() => setShowChangePassword(!showChangePassword)}
                                            className="w-full flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
                                        >
                                            <FiLock className="w-4 h-4" />
                                            <span className="font-medium">{showChangePassword ? 'Hide Change Password' : 'Change Password'}</span>
                                        </button>

                                        {/* Change Password Form */}
                                        {showChangePassword && (
                                            <div className="bg-gray-700/30 border border-gray-600/50 rounded-lg p-6 space-y-4">
                                                <h4 className="text-lg font-semibold text-cyan-400 mb-4">Change Password</h4>

                                                <div className="space-y-4">
                                                    <div>
                                                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-300 mb-2">
                                                            New Password
                                                        </label>
                                                        <input
                                                            id="new-password"
                                                            type="password"
                                                            value={newPassword}
                                                            onChange={(e) => setNewPassword(e.target.value)}
                                                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                                                            placeholder="Enter your new password"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-2">
                                                            Confirm New Password
                                                        </label>
                                                        <input
                                                            id="confirm-password"
                                                            type="password"
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                                                            placeholder="Confirm your new password"
                                                        />
                                                    </div>

                                                    {/* Error and Success Messages */}
                                                    {passwordError && (
                                                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 flex items-center gap-2">
                                                            <FiX className="w-4 h-4" />
                                                            {passwordError}
                                                        </div>
                                                    )}

                                                    {passwordSuccess && (
                                                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 flex items-center gap-2">
                                                            <FiCheck className="w-4 h-4" />
                                                            {passwordSuccess}
                                                        </div>
                                                    )}

                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={handleChangePassword}
                                                            disabled={isPasswordUpdating || !newPassword || !confirmPassword}
                                                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
                                                        >
                                                            {isPasswordUpdating ? (
                                                                <>
                                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                                    Updating...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FiCheck className="w-4 h-4" />
                                                                    Update Password
                                                                </>
                                                            )}
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                setShowChangePassword(false);
                                                                setNewPassword('');
                                                                setConfirmPassword('');
                                                                setPasswordError('');
                                                                setPasswordSuccess('');
                                                            }}
                                                            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}


                                    </div>

                                    <div className="pt-4 border-t border-gray-600/50">
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                                        >
                                            <FiLogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}