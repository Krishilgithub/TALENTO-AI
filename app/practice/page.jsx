"use client";

const PRACTICE_CATEGORIES = [
	{
		key: "aptitude",
		name: "Aptitude",
		description:
			"Sharpen your logical reasoning, quantitative, and verbal skills with practice questions.",
	},
	{
		key: "coding",
		name: "Coding",
		description:
			"Practice coding problems in various languages and improve your problem-solving skills.",
	},
	{
		key: "communication",
		name: "Communication",
		description:
			"Enhance your written and verbal communication through scenario-based exercises.",
	},
	{
		key: "domain",
		name: "Domain Knowledge",
		description:
			"Test your knowledge in your chosen field or industry with relevant questions.",
	},
];

export default function PracticePage() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
			<h1 className="text-3xl font-bold mb-2">Start Practice Session</h1>
			<p className="text-lg text-gray-700 mb-8 text-center max-w-2xl">
				Welcome! Choose a category below to begin practicing and improving your
				skills. Each session is tailored to help you grow and track your
				progress.
			</p>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
				{PRACTICE_CATEGORIES.map((cat) => (
					<div
						key={cat.key}
						className="bg-white rounded-xl shadow-md border border-blue-100 p-6 flex flex-col items-start"
					>
						<h2 className="text-xl font-semibold mb-2 text-blue-800">
							{cat.name}
						</h2>
						<p className="text-gray-600 mb-4">{cat.description}</p>
						<button
							className="mt-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
							disabled
						>
							Start Practice
						</button>
					</div>
				))}
			</div>
			<div className="mt-12 text-gray-400 text-sm">
				(Practice session functionality coming soon!)
			</div>
		</div>
	);
}
