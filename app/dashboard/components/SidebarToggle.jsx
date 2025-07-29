"use client";

import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function SidebarToggle({ sidebarOpen, setSidebarOpen }) {
	if (sidebarOpen) return null;

	return (
		<button
			className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-[#23272f] border border-gray-700 rounded-full p-2 shadow-lg hover:bg-cyan-900 transition-all duration-200 z-30 hover:scale-110"
			onClick={() => setSidebarOpen(true)}
			title="Open sidebar"
		>
			<ChevronRightIcon className="w-5 h-5 text-cyan-400" />
		</button>
	);
} 