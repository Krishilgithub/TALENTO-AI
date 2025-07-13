"use client";

const CAREER_STEPS = [
	{
		step: 1,
		title: "Self-Assessment",
		description:
			"Understand your strengths, interests, and skills. Take our assessments to get started.",
		action: { label: "Take Assessment", href: "/assessment" },
	},
	{
		step: 2,
		title: "Explore Career Paths",
		description: "Browse popular roles and industries that match your profile.",
		action: null,
	},
	{
		step: 3,
		title: "Set Goals",
		description: "Define your short-term and long-term career goals.",
		action: null,
	},
	{
		step: 4,
		title: "Track Progress",
		description: "Monitor your journey and update your progress regularly.",
		action: null,
	},
];

const CAREER_PATHS = [
	"Software Engineer",
	"Data Scientist",
	"Product Manager",
	"Digital Marketer",
	"Financial Analyst",
	"UX/UI Designer",
	"Mechanical Engineer",
	"Entrepreneur",
];

export default function CareerPage() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-yellow-50 py-12 px-4">
			<h1 className="text-3xl font-bold mb-2">Career Planning</h1>
			<p className="text-lg text-gray-700 mb-8 text-center max-w-2xl">
				Plan your career with confidence! Follow the steps below to discover
				your strengths, explore opportunities, set goals, and track your
				progress.
			</p>
			<div className="w-full max-w-3xl mb-12">
				{CAREER_STEPS.map((step) => (
					<div
						key={step.step}
						className="bg-white rounded-xl shadow-md border border-purple-100 p-6 mb-6 flex flex-col md:flex-row items-start md:items-center"
					>
						<div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-lg font-bold text-purple-700 mr-4 mb-2 md:mb-0">
							{step.step}
						</div>
						<div className="flex-1">
							<h2 className="text-xl font-semibold text-purple-800 mb-1">
								{step.title}
							</h2>
							<p className="text-gray-600 mb-2">{step.description}</p>
							{step.action && (
								<a
									href={step.action.href}
									className="inline-block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors duration-200"
								>
									{step.action.label}
								</a>
							)}
						</div>
					</div>
				))}
			</div>
			<div className="w-full max-w-3xl mb-12">
				<h3 className="text-lg font-semibold text-yellow-700 mb-2">
					Popular Career Paths
				</h3>
				<div className="flex flex-wrap gap-3">
					{CAREER_PATHS.map((path) => (
						<span
							key={path}
							className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium"
						>
							{path}
						</span>
					))}
				</div>
			</div>
			<div className="w-full max-w-3xl">
				<h3 className="text-lg font-semibold text-gray-700 mb-2">
					Resources & Next Steps
				</h3>
				<ul className="list-disc list-inside text-gray-600">
					<li>
						Take relevant assessments to identify your strengths and areas for
						growth.
					</li>
					<li>Research roles and industries that interest you.</li>
					<li>Set clear, achievable career goals and review them regularly.</li>
					<li>Track your progress and celebrate milestones along the way!</li>
				</ul>
			</div>
		</div>
	);
}
