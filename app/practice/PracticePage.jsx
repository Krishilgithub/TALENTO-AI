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
		<div className="min-h-screen flex flex-col items-center justify-center bg-[#101113] py-12 px-4">
			<h1 className="text-3xl font-bold mb-2 text-white">Start Practice Session</h1>
			<p className="text-lg text-gray-300 mb-8 text-center max-w-2xl">
				Welcome! Choose a category below to begin practicing and improving your
				skills. Each session is tailored to help you grow and track your
				progress.
			</p>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
				{PRACTICE_CATEGORIES.map((cat) => (
					<div
						key={cat.key}
						className="bg-[#18191b] rounded-xl shadow-md border border-cyan-900 p-6 flex flex-col items-start"
					>
						<h2 className="text-xl font-semibold mb-2 text-cyan-400">
							{cat.name}
						</h2>
						<p className="text-gray-400 mb-4">{cat.description}</p>
						<button
							className="mt-auto bg-cyan-400 text-black px-4 py-2 rounded hover:bg-cyan-300 transition-colors duration-200"
							disabled
						>
							Start Practice
						</button>
					</div>
				))}
			</div>
			<div className="mt-12 text-gray-500 text-sm">
				(Practice session functionality coming soon!)
			</div>
		</div>
	);
}
