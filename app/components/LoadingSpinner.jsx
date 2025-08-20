"use client";

import React from "react";
import { motion } from "framer-motion";

export default function LoadingSpinner({ message = "Generating content..." }) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="flex flex-col items-center justify-center p-8"
		>
			<div className="relative">
				{/* Outer ring */}
				<div className="w-16 h-16 border-4 border-gray-700 rounded-full"></div>
				{/* Animated ring */}
				<div className="absolute top-0 left-0 w-16 h-16 border-4 border-cyan-400 rounded-full animate-spin border-t-transparent"></div>
				{/* Inner dot */}
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 rounded-full"></div>
			</div>
			<motion.p
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="mt-4 text-gray-300 text-center"
			>
				{message}
			</motion.p>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5 }}
				className="mt-2 text-xs text-gray-500 text-center"
			>
				This may take a few moments...
			</motion.div>
		</motion.div>
	);
} 