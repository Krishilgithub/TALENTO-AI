'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useRequestCache, useDebounce } from './useCache';

// Custom hook for search with debouncing and caching
export const useSearch = (searchFunction, options = {}) => {
    const {
        debounceMs = 500,
        minQueryLength = 1,
        dependencies = []
    } = options;

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const debouncedQuery = useDebounce(query, debounceMs);
    const { cachedFetch } = useRequestCache();
    const abortControllerRef = useRef(null);

    const search = useCallback(async (searchQuery, additionalParams = {}) => {
        // Abort previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        if (!searchQuery || searchQuery.length < minQueryLength) {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            const result = await searchFunction(searchQuery, {
                ...additionalParams,
                signal: controller.signal
            });

            if (!controller.signal.aborted) {
                setResults(result);
            }
        } catch (err) {
            if (!controller.signal.aborted) {
                setError(err);
                setResults([]);
            }
        } finally {
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        }
    }, [searchFunction, minQueryLength]);

    // Auto-search when debounced query changes
    useEffect(() => {
        search(debouncedQuery);
    }, [debouncedQuery, search, ...dependencies]);

    const clearResults = useCallback(() => {
        setResults([]);
        setError(null);
        setQuery('');
    }, []);

    return {
        query,
        setQuery,
        results,
        loading,
        error,
        search,
        clearResults
    };
};

// Custom hook for job search specifically
export const useJobSearch = () => {
    const [location, setLocation] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedJobTypes, setSelectedJobTypes] = useState([]);
    const [jobLimit, setJobLimit] = useState(20);

    const searchJobs = useCallback(async (query, options = {}) => {
        const { signal } = options;

        let apiUrl = `/api/jobs?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&limit=${jobLimit}`;

        if (selectedCategories.length > 0) {
            apiUrl += selectedCategories.map(cat => `&category=${encodeURIComponent(cat)}`).join('');
        }

        const response = await fetch(apiUrl, { signal });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch jobs');
        }

        let jobs = data.results || [];

        // Filter by job types
        if (selectedJobTypes.length > 0) {
            jobs = jobs.filter(job =>
                selectedJobTypes.includes((job.job_type || '').toLowerCase())
            );
        }

        return jobs.map(job => ({ ...job, fullDescription: job.description }));
    }, [location, selectedCategories, selectedJobTypes, jobLimit]);

    const {
        query,
        setQuery,
        results,
        loading,
        error,
        search,
        clearResults
    } = useSearch(searchJobs, {
        debounceMs: 800, // Longer debounce for job search
        minQueryLength: 2,
        dependencies: [location, selectedCategories, selectedJobTypes, jobLimit]
    });

    const loadMore = useCallback(() => {
        setJobLimit(prev => prev + 20);
    }, []);

    return {
        // Search state
        query,
        setQuery,
        location,
        setLocation,
        results,
        loading,
        error,

        // Filters
        selectedCategories,
        setSelectedCategories,
        selectedJobTypes,
        setSelectedJobTypes,

        // Actions
        search,
        clearResults,
        loadMore,

        // Pagination
        jobLimit,
        setJobLimit
    };
};

// Custom hook for assessment API calls
export const useAssessmentAPI = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const submitAssessment = useCallback(async (endpoint, assessmentData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(assessmentData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Assessment failed');
            }

            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        submitAssessment
    };
};