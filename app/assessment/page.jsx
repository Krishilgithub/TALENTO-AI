"use client";

const ASSESSMENTS = [
	{
		key: "aptitude",
		name: "General Aptitude Test",
		description:
			"Evaluate your logical, quantitative, and verbal reasoning skills.",
	},
	{
		key: "technical",
		name: "Technical Assessment",
		description:
			"Test your technical knowledge in programming, engineering, or your chosen field.",
	},
	{
		key: "personality",
		name: "Personality Assessment",
		description:
			"Discover your strengths, work style, and ideal career environments.",
	},
	{
		key: "communication",
		name: "Communication Skills Test",
		description: "Assess your written and verbal communication abilities.",
	},
];

export default function AssessmentPage() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[#101113] py-12 px-4">
			<h1 className="text-3xl font-bold mb-2 text-white">Take Assessment</h1>
			<p className="text-lg text-gray-300 mb-8 text-center max-w-2xl">
				Ready to evaluate your skills? Choose an assessment below to get
				started. Your results will help guide your learning and career planning.
			</p>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
				{ASSESSMENTS.map((assess) => (
					<div
						key={assess.key}
						className="bg-[#18191b] rounded-xl shadow-md border border-green-900 p-6 flex flex-col items-start"
					>
						<h2 className="text-xl font-semibold mb-2 text-green-400">
							{assess.name}
						</h2>
						<p className="text-gray-400 mb-4">{assess.description}</p>
						<button
							className="mt-auto bg-green-400 text-black px-4 py-2 rounded hover:bg-green-300 transition-colors duration-200"
							disabled
						>
							Start Assessment
						</button>
					</div>
				))}
			</div>
			<div className="mt-12 text-gray-500 text-sm">
				(Assessment functionality coming soon!)
			</div>
		</div>
	);
}
