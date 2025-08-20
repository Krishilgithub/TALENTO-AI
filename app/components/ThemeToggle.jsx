"use client";

import React from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
	const { isDark, toggleTheme } = useTheme();

	return (
		<button
			onClick={toggleTheme}
			className="p-2 rounded-lg bg-gradient-to-r from-cyan-700 to-blue-700 border border-cyan-400 text-white hover:bg-cyan-400 hover:text-black transition-all duration-200 hover:scale-105 shadow-md"
			title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
		>
			{isDark ? (
				<SunIcon className="w-5 h-5" />
			) : (
				<MoonIcon className="w-5 h-5" />
			)}
		</button>
	);
} 