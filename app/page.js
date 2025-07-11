import Image from "next/image";

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
			{/* Hero Section */}
			<section className="w-full flex flex-col items-center justify-center py-20 px-4 text-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
				<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight max-w-3xl">
					Unlock Your Potential with{" "}
					<span className="text-blue-600 dark:text-blue-400">AI-Powered</span>{" "}
					Interview Prep & Career Tools
				</h1>
				<p className="text-lg sm:text-xl max-w-2xl mb-8 text-gray-600 dark:text-gray-300">
					Real-time coaching, resume optimization, coding help, and more.
					Everything you need to land your dream job, powered by the latest AI
					technology.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<a
						href="#features"
						className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-blue-700 transition"
					>
						Get Started
					</a>
					<a
						href="#contact"
						className="border border-blue-600 text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 dark:hover:bg-gray-900 transition"
					>
						Contact Us
					</a>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="w-full max-w-6xl mx-auto py-20 px-4">
				<h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
					Features & Services
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{/* Feature Card Example */}
					<div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center text-center">
						<Image
							src="/file.svg"
							alt="AI Copilot"
							width={48}
							height={48}
							className="mb-4"
						/>
						<h3 className="text-xl font-semibold mb-2">
							AI Copilot for Job Interviews
						</h3>
						<p className="text-gray-600 dark:text-gray-300">
							Real-time answers, live coaching, and interview simulations for
							job seekers.
						</p>
					</div>
					<div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center text-center">
						<Image
							src="/window.svg"
							alt="Resume Builder"
							width={48}
							height={48}
							className="mb-4"
						/>
						<h3 className="text-xl font-semibold mb-2">Resume Builder</h3>
						<p className="text-gray-600 dark:text-gray-300">
							Create and optimize resumes with AI assistance.
						</p>
					</div>
					<div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center text-center">
						<Image
							src="/globe.svg"
							alt="Coding Assistance"
							width={48}
							height={48}
							className="mb-4"
						/>
						<h3 className="text-xl font-semibold mb-2">Coding Assistance</h3>
						<p className="text-gray-600 dark:text-gray-300">
							Support for technical interviews, including coding questions and
							solutions.
						</p>
					</div>
					<div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center text-center">
						<Image
							src="/next.svg"
							alt="Assessment Support"
							width={48}
							height={48}
							className="mb-4"
						/>
						<h3 className="text-xl font-semibold mb-2">
							Online Assessment Support
						</h3>
						<p className="text-gray-600 dark:text-gray-300">
							Practice and guidance for online job assessments.
						</p>
					</div>
					<div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center text-center">
						<Image
							src="/vercel.svg"
							alt="Behavioral & Technical Prep"
							width={48}
							height={48}
							className="mb-4"
						/>
						<h3 className="text-xl font-semibold mb-2">
							Behavioral & Technical Question Prep
						</h3>
						<p className="text-gray-600 dark:text-gray-300">
							Real-time feedback for both behavioral and technical interview
							questions.
						</p>
					</div>
					<div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center text-center">
						<Image
							src="/file.svg"
							alt="Live Coaching"
							width={48}
							height={48}
							className="mb-4"
						/>
						<h3 className="text-xl font-semibold mb-2">Live Coaching</h3>
						<p className="text-gray-600 dark:text-gray-300">
							Interactive, real-time coaching sessions and video interviewing.
						</p>
					</div>
				</div>
			</section>

			{/* Placeholders for other sections */}
			<section
				id="testimonials"
				className="w-full max-w-4xl mx-auto py-20 px-4 text-center"
			>
				<h2 className="text-3xl sm:text-4xl font-bold mb-8">Testimonials</h2>
				<p className="text-gray-500">Coming soon...</p>
			</section>
			<section
				id="pricing"
				className="w-full max-w-4xl mx-auto py-20 px-4 text-center"
			>
				<h2 className="text-3xl sm:text-4xl font-bold mb-8">Pricing</h2>
				<p className="text-gray-500">Coming soon...</p>
			</section>
			<section
				id="faq"
				className="w-full max-w-4xl mx-auto py-20 px-4 text-center"
			>
				<h2 className="text-3xl sm:text-4xl font-bold mb-8">FAQ</h2>
				<p className="text-gray-500">Coming soon...</p>
			</section>
			<section
				id="contact"
				className="w-full max-w-4xl mx-auto py-20 px-4 text-center"
			>
				<h2 className="text-3xl sm:text-4xl font-bold mb-8">
					Contact & Support
				</h2>
				<p className="text-gray-500">Coming soon...</p>
			</section>
		</div>
	);
}
