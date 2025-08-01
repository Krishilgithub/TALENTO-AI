"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function TestPage() {
	const router = useRouter();

	return (
		<div className="min-h-screen bg-[#101113] flex items-center justify-center">
			<div className="text-center">
				<h1 className="text-3xl font-bold text-white mb-4">Test Page</h1>
				<p className="text-gray-300 mb-6">
					If you can see this, routing is working!
				</p>
				<button
					onClick={() => router.push("/assessment")}
					className="bg-green-400 text-black px-6 py-2 rounded hover:bg-green-300"
				>
					Go Back to Assessments
				</button>
			</div>
		</div>
	);
}
