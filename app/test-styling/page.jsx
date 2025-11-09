import React from "react";

export default function TestStyling() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
			<div className="bg-gray-800/30 border border-gray-600/50 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto mb-8">
				<h1 className="text-2xl font-bold text-white mb-4">Tailwind v3 Test</h1>
				<p className="text-gray-300 mb-4">
					Testing if backdrop blur and opacity classes are working correctly.
				</p>
				<button className="bg-cyan-400 text-black px-4 py-2 rounded hover:bg-cyan-300 transition-colors">
					Test Button
				</button>
			</div>

			<div className="bg-red-500 p-4 rounded-lg mb-4">
				<h2 className="text-white text-xl">Basic Tailwind Test</h2>
				<p className="text-gray-100">This should be red background</p>
			</div>

			<div className="bg-blue-600 p-4 rounded-lg mb-4">
				<h2 className="text-white text-xl">Blue Test</h2>
				<p className="text-gray-100">This should be blue background</p>
			</div>

			<div className="bg-green-500 p-4 rounded-lg">
				<h2 className="text-white text-xl">Green Test</h2>
				<p className="text-gray-100">This should be green background</p>
			</div>
		</div>
	);
}