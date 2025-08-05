"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};

export const ThemeProvider = ({ children }) => {
	const [isDark, setIsDark] = useState(true); // Default to dark theme

	useEffect(() => {
		// Check for saved theme preference or default to dark
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme) {
			setIsDark(savedTheme === 'dark');
		}
	}, []);

	useEffect(() => {
		// Save theme preference to localStorage
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
		
		// Apply theme to document
		if (isDark) {
			document.documentElement.classList.add('dark');
			document.documentElement.classList.remove('light');
		} else {
			document.documentElement.classList.add('light');
			document.documentElement.classList.remove('dark');
		}
	}, [isDark]);

	const toggleTheme = () => {
		setIsDark(!isDark);
	};

	const value = {
		isDark,
		toggleTheme,
	};

	return (
		<ThemeContext.Provider value={value}>
			{children}
		</ThemeContext.Provider>
	);
}; 