'use client';
import { useState, useRef, useEffect } from 'react';

class RequestCache {
    constructor(maxSize = 50, ttl = 5 * 60 * 1000) { // 5 minutes TTL
        this.cache = new Map();
        this.maxSize = maxSize;
        this.ttl = ttl;
    }

    generateKey(url, params = {}) {
        const sortedParams = Object.keys(params)
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');
        return `${url}?${sortedParams}`;
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        const now = Date.now();
        if (now - item.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }

        // Move to end for LRU
        this.cache.delete(key);
        this.cache.set(key, item);
        return item.data;
    }

    set(key, data) {
        // Remove oldest if at capacity
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    clear() {
        this.cache.clear();
    }

    has(key) {
        const item = this.cache.get(key);
        if (!item) return false;

        const now = Date.now();
        if (now - item.timestamp > this.ttl) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }
}

// Global cache instance
let globalCache = null;

export const useRequestCache = () => {
    if (!globalCache) {
        globalCache = new RequestCache();
    }

    const pendingRequests = useRef(new Map());

    const cachedFetch = async (url, options = {}, params = {}) => {
        const cacheKey = globalCache.generateKey(url, params);

        // Check cache first
        const cachedData = globalCache.get(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        // Check if request is already pending
        if (pendingRequests.current.has(cacheKey)) {
            return pendingRequests.current.get(cacheKey);
        }

        // Make the request
        const requestPromise = fetch(url, options)
            .then(async (response) => {
                const data = await response.json();
                const result = { response, data };

                // Cache successful responses
                if (response.ok) {
                    globalCache.set(cacheKey, result);
                }

                return result;
            })
            .finally(() => {
                // Remove from pending requests
                pendingRequests.current.delete(cacheKey);
            });

        // Store the promise to avoid duplicate requests
        pendingRequests.current.set(cacheKey, requestPromise);

        return requestPromise;
    };

    const clearCache = () => {
        globalCache.clear();
    };

    const invalidateCache = (url, params = {}) => {
        const cacheKey = globalCache.generateKey(url, params);
        globalCache.cache.delete(cacheKey);
    };

    return {
        cachedFetch,
        clearCache,
        invalidateCache,
        cache: globalCache
    };
};

// Debounce hook
export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};