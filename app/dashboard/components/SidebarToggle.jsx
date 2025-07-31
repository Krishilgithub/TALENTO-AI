"use client";

import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function SidebarToggle({ sidebarOpen, setSidebarOpen }) {
	return (
		<>
			{/* Show when sidebar is closed */}
			{!sidebarOpen && (
				<motion.button
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -20 }}
					transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
					className="fixed left-0 top-1/2 -translate-y-1/2 z-30 bg-gradient-to-r from-[#23272f] to-[#18191b] border border-gray-700 rounded-full p-3 shadow-lg hover:bg-gradient-to-r hover:from-cyan-900 hover:to-blue-900 transition-all duration-300 hover:scale-110 hover:shadow-xl"
					onClick={() => setSidebarOpen(true)}
					title="Open sidebar"
				>
					<ChevronRightIcon className="w-5 h-5 text-cyan-400" />
				</motion.button>
			)}
		</>
	);
} 