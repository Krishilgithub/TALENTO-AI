'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfileContext = createContext({});

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};

export const ProfileProvider = ({ children }) => {
    const { user } = useAuth();
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [imageError, setImageError] = useState(false);

    // Update profile image URL when user changes
    useEffect(() => {
        if (user) {
            const imageUrl = user?.user_metadata?.avatar_url || user?.avatar_url;
            setProfileImageUrl(imageUrl);
            setImageError(false);
        }
    }, [user]);

    const updateProfileImage = (newImageUrl) => {
        setProfileImageUrl(newImageUrl);
        setImageError(false);
    };

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <ProfileContext.Provider
            value={{
                profileImageUrl,
                imageError,
                updateProfileImage,
                handleImageError,
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};