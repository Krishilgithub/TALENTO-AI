// Utility functions for user profile management
export function getInitialFromName(name, email) {
    if (name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
        return email[0].toUpperCase();
    }
    return '?';
}

export function getProfileImageUrl(user) {
    // Check for OAuth profile pictures first
    if (user?.user_metadata?.avatar_url) {
        return user.user_metadata.avatar_url;
    }

    // Check for uploaded profile picture
    if (user?.avatar_url) {
        return user.avatar_url;
    }

    return null;
}

export function getUserDisplayName(user) {
    return user?.user_metadata?.name ||
        user?.user_metadata?.full_name ||
        user?.name ||
        user?.email?.split('@')[0] ||
        'User';
}

// Cursor loader utilities
export function showLoadingCursor() {
    document.body.classList.add('cursor-loading');
}

export function hideLoadingCursor() {
    document.body.classList.remove('cursor-loading');
}

export function withLoadingCursor(asyncFn) {
    return async (...args) => {
        showLoadingCursor();
        try {
            const result = await asyncFn(...args);
            return result;
        } finally {
            hideLoadingCursor();
        }
    };
}