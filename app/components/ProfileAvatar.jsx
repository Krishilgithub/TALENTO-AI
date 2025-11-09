'use client';
import { useState } from 'react';
import Image from 'next/image';
import { getInitialFromName, getProfileImageUrl, getUserDisplayName } from '../../utils/profileUtils';

export default function ProfileAvatar({
    user,
    size = 'md',
    onClick,
    className = '',
    showName = false
}) {
    const [imageError, setImageError] = useState(false);

    const sizeClasses = {
        sm: 'w-8 h-8 text-sm',
        md: 'w-14 h-14 text-xl',
        lg: 'w-20 h-20 text-2xl',
        xl: 'w-32 h-32 text-4xl'
    };

    const profileImageUrl = getProfileImageUrl(user);
    const displayName = getUserDisplayName(user);
    const initials = getInitialFromName(displayName, user?.email);

    const avatarElement = (
        <div className={`relative ${sizeClasses[size]} ${className}`}>
            {profileImageUrl && !imageError ? (
                <Image
                    src={profileImageUrl}
                    alt={displayName}
                    fill
                    className="rounded-full object-cover border-4 border-cyan-400 shadow-lg hover:scale-105 transition-transform duration-200"
                    onError={() => setImageError(true)}
                />
            ) : (
                <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br from-cyan-500 to-blue-700 border-4 border-cyan-400 shadow-lg hover:scale-105 transition-transform duration-200`}>
                    {initials}
                </div>
            )}
        </div>
    );

    if (onClick) {
        return (
            <div className="flex flex-col items-center">
                <button
                    onClick={onClick}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    title="Click to view profile"
                >
                    {avatarElement}
                </button>
                {showName && (
                    <p className="text-gray-900 dark:text-white font-semibold text-lg mt-3">{displayName}</p>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            {avatarElement}
            {showName && (
                <p className="text-gray-900 dark:text-white font-semibold text-lg mt-3">{displayName}</p>
            )}
        </div>
    );
}