'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import createClientForBrowser from '../../utils/supabase/client';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const [isClient, setIsClient] = useState(false);
    const supabase = createClientForBrowser();

    // Cache for user data to avoid redundant API calls
    const [userCache, setUserCache] = useState(null);
    const [lastFetch, setLastFetch] = useState(null);
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    useEffect(() => {
        setIsClient(true);
    }, []);

    const getUser = async (forceRefresh = false) => {
        // Only use cache on client side
        if (isClient && !forceRefresh && userCache && lastFetch && (Date.now() - lastFetch < CACHE_DURATION)) {
            return userCache;
        }

        try {
            const { data, error } = await supabase.auth.getUser();
            if (error) throw error;

            // Cache the result only on client side
            if (isClient) {
                setUserCache(data);
                setLastFetch(Date.now());
            }
            setUser(data?.user || null);

            return data;
        } catch (error) {
            console.error('Error fetching user:', error);
            setUser(null);
            if (isClient) {
                setUserCache(null);
            }
            return { user: null, error };
        }
    };

    const refreshUser = () => getUser(true);

    useEffect(() => {
        let mounted = true;

        // Get initial session
        const getInitialSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

                if (mounted) {
                    setSession(session);
                    setUser(session?.user || null);
                    if (session?.user) {
                        setUserCache({ user: session.user });
                        setLastFetch(Date.now());
                    }
                }
            } catch (error) {
                console.error('Error getting session:', error);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        getInitialSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!mounted) return;

                setSession(session);
                setUser(session?.user || null);
                setLoading(false);

                // Update cache when auth state changes
                if (session?.user) {
                    setUserCache({ user: session.user });
                    setLastFetch(Date.now());
                } else {
                    setUserCache(null);
                    setLastFetch(null);
                }
            }
        );

        return () => {
            mounted = false;
            subscription?.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
            setSession(null);
            setUserCache(null);
            setLastFetch(null);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const updateUser = async (updates) => {
        try {
            const { data, error } = await supabase.auth.updateUser(updates);
            if (error) throw error;

            // Update cache and state
            if (data?.user) {
                setUser(data.user);
                setUserCache({ user: data.user });
                setLastFetch(Date.now());
            }

            return { data, error: null };
        } catch (error) {
            console.error('Error updating user:', error);
            return { data: null, error };
        }
    };

    const value = {
        user,
        session,
        loading,
        getUser,
        refreshUser,
        signOut,
        updateUser,
        supabase
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};