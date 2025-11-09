'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

// Custom hook for Supabase data fetching with caching
export const useSupabaseQuery = (table, options = {}) => {
    const { supabase, user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const {
        select = '*',
        filters = [],
        orderBy = null,
        single = false,
        enabled = true,
        dependencies = [],
        cacheKey = null
    } = options;

    // Cache management
    const [cache, setCache] = useState(new Map());
    const getCacheKey = useCallback(() => {
        if (cacheKey) return cacheKey;
        return JSON.stringify({ table, select, filters, orderBy, single });
    }, [table, select, filters, orderBy, single, cacheKey]);

    const fetchData = useCallback(async () => {
        if (!supabase || !enabled) return;

        const key = getCacheKey();
        const cached = cache.get(key);

        // Return cached data if available and not expired (5 minutes)
        if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
            setData(cached.data);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            let query = supabase.from(table).select(select);

            // Apply filters
            filters.forEach(filter => {
                if (filter.type === 'eq') {
                    query = query.eq(filter.column, filter.value);
                } else if (filter.type === 'in') {
                    query = query.in(filter.column, filter.value);
                } else if (filter.type === 'gte') {
                    query = query.gte(filter.column, filter.value);
                } else if (filter.type === 'lte') {
                    query = query.lte(filter.column, filter.value);
                }
            });

            // Apply ordering
            if (orderBy) {
                query = query.order(orderBy.column, { ascending: orderBy.ascending });
            }

            // Execute query
            const { data: result, error: queryError } = single
                ? await query.single()
                : await query;

            if (queryError) {
                setError(queryError);
                return;
            }

            setData(result);

            // Cache the result
            setCache(prev => new Map(prev).set(key, {
                data: result,
                timestamp: Date.now()
            }));

        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [supabase, enabled, getCacheKey, cache, table, select, filters, orderBy, single]);

    useEffect(() => {
        fetchData();
    }, [fetchData, ...dependencies]);

    const refetch = useCallback(() => {
        // Clear cache and refetch
        const key = getCacheKey();
        setCache(prev => {
            const newCache = new Map(prev);
            newCache.delete(key);
            return newCache;
        });
        fetchData();
    }, [fetchData, getCacheKey]);

    const mutate = useCallback((newData) => {
        setData(newData);
        // Update cache
        const key = getCacheKey();
        setCache(prev => new Map(prev).set(key, {
            data: newData,
            timestamp: Date.now()
        }));
    }, [getCacheKey]);

    return { data, loading, error, refetch, mutate };
};

// Custom hook for saved jobs
export const useSavedJobs = () => {
    const { user } = useAuth();

    return useSupabaseQuery('saved_jobs', {
        filters: user ? [{ type: 'eq', column: 'user_id', value: user.id }] : [],
        orderBy: { column: 'id', ascending: false },
        enabled: !!user,
        dependencies: [user?.id],
        cacheKey: `saved_jobs_${user?.id}`
    });
};

// Custom hook for assessment results
export const useAssessmentResults = () => {
    const { user } = useAuth();

    return useSupabaseQuery('assessment_results', {
        filters: user ? [{ type: 'eq', column: 'user_id', value: user.id }] : [],
        orderBy: { column: 'completed_at', ascending: true },
        enabled: !!user,
        dependencies: [user?.id],
        cacheKey: `assessment_results_${user?.id}`
    });
};

// Custom hook for onboarding data
export const useOnboardingData = () => {
    const { user } = useAuth();

    return useSupabaseQuery('user_onboarding', {
        filters: user ? [{ type: 'eq', column: 'user_id', value: user.id }] : [],
        single: true,
        enabled: !!user,
        dependencies: [user?.id],
        cacheKey: `onboarding_${user?.id}`
    });
};

// Custom hook for user data with caching
export const useUserData = () => {
    const { user, loading } = useAuth();

    return {
        user,
        loading,
        isAuthenticated: !!user,
        userId: user?.id,
        userEmail: user?.email,
        userName: user?.user_metadata?.name || user?.email?.split('@')[0],
        userAvatar: user?.user_metadata?.avatar_url || '/avatar1.jpg',
        isOnboarded: user?.user_metadata?.onboarded === true,
        isEmailConfirmed: !!user?.email_confirmed_at
    };
};