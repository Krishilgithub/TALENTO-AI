import Navbar from "./Navbar.jsx";
import Image from "next/image";

const features = [
	{
		icon: "/file.svg",
		title: "AI Copilot for Job Interviews",
		desc: "Real-time answers, live coaching, and interview simulations for job seekers.",
	},
	{
		icon: "/window.svg",
		title: "Resume Builder",
		desc: "Create and optimize resumes with AI assistance.",
	},
	{
		icon: "/globe.svg",
		title: "Coding Assistance",
		desc: "Support for technical interviews, including coding questions and solutions.",
	},
	{
		icon: "/next.svg",
		title: "Online Assessment Support",
		desc: "Practice and guidance for online job assessments.",
	},
	{
		icon: "/vercel.svg",
		title: "Behavioral & Technical Question Prep",
		desc: "Real-time feedback for both behavioral and technical interview questions.",
	},
	{
		icon: "/file.svg",
		title: "Live Coaching",
		desc: "Interactive, real-time coaching sessions and video interviewing.",
	},
];

const scenarios = [
	{
		img: "/public/scenario1.jpg",
		title: "System Design Interviews",
		desc: "Need an unfair advantage in system design interviews? LockedIn AI Coding Copilot delivers real-time solutions on architecture and scalability.",
	},
	{
		img: "/public/scenario2.jpg",
		title: "Software Engineering Interviews",
		desc: "Lock in your 300k job offer with Coding CoPilot's real-time coding solutions.",
	},
	{
		img: "/public/scenario3.jpg",
		title: "Project Management",
		desc: "Need to elevate your PMO interview game? Unlock your potential with LockedIn AI's real-time insights.",
	},
	{
		img: "/public/scenario4.jpg",
		title: "Financial Interviews",
		desc: "Ace your financial interviews with real-time analytics and insights.",
	},
	{
		img: "/public/scenario5.jpg",
		title: "Market Sizing Interviews",
		desc: "Master market sizing with AI-driven data and scenario analysis.",
	},
	{
		img: "/public/scenario6.jpg",
		title: "Case Study Interviews",
		desc: "Crack case studies with instant feedback and structured solutions.",
	},
];

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen bg-[#101113] text-white">
			<Navbar />
			{/* Hero Section */}
			<section className="w-full flex flex-col items-center justify-center py-20 px-4 text-center bg-gradient-to-b from-[#101113] to-[#18191b]">
				<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight max-w-3xl">
					Unlock Your Potential with{" "}
					<span className="text-cyan-400">AI-Powered</span> Interview Prep &
					Career Tools
				</h1>
				<p className="text-lg sm:text-xl max-w-2xl mb-8 text-gray-300">
					Real-time coaching, resume optimization, coding help, and more.
					Everything you need to land your dream job, powered by the latest AI
					technology.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<a
						href="#features"
						className="bg-cyan-400 text-black px-8 py-3 rounded-full font-semibold shadow hover:bg-cyan-300 transition"
					>
						Get Started
					</a>
					<a
						href="#contact"
						className="border border-cyan-400 text-cyan-400 px-8 py-3 rounded-full font-semibold hover:bg-cyan-900 transition"
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
					{features.map((f, i) => (
						<div
							key={i}
							className="bg-[#18191b] rounded-xl shadow p-6 flex flex-col items-center text-center transition transform hover:-translate-y-2 hover:scale-105 hover:shadow-lg hover:bg-[#232425] cursor-pointer group"
						>
							<Image
								src={f.icon}
								alt={f.title}
								width={48}
								height={48}
								className="mb-4 group-hover:scale-110 transition"
							/>
							<h3 className="text-xl font-semibold mb-2">{f.title}</h3>
							<p className="text-gray-400">{f.desc}</p>
						</div>
					))}
				</div>
			</section>

			{/* Support All Scenarios Section */}
			<section id="scenarios" className="w-full max-w-7xl mx-auto py-20 px-4">
				<h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
					Support All Scenarios
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{scenarios.map((s, i) => (
						<div
							key={i}
							className="bg-[#18191b] rounded-xl overflow-hidden shadow hover:shadow-lg transition group cursor-pointer"
						>
							<div className="h-48 w-full relative">
								{/* Replace with real images in /public */}
								<div className="absolute inset-0 bg-gray-700 flex items-center justify-center text-2xl text-white">
									Image
								</div>
							</div>
							<div className="p-6">
								<h3 className="text-lg font-bold mb-2">{s.title}</h3>
								<p className="text-gray-400 text-sm">{s.desc}</p>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Why Use Section (Feature Cards) */}
			<section id="why" className="w-full max-w-7xl mx-auto py-20 px-4">
				<h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
					Why use <span className="text-cyan-400">LockedIn AI?</span>
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{/* Example cards, add more as needed */}
					<div className="bg-[#18191b] rounded-xl shadow p-6 flex flex-col gap-2 hover:bg-[#232425] transition cursor-pointer">
						<span className="text-xs font-semibold text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded w-fit mb-2">
							Speech Recognition
						</span>
						<h3 className="text-lg font-bold">Multilingual</h3>
						<p className="text-gray-400 text-sm">
							Experience a lightning-fast 116 ms response time for natural,
							uninterrupted interviews—converse seamlessly in 42 languages with
							regional accent and dialect support, breaking down language
							barriers with AI-powered communication.
						</p>
					</div>
					<div className="bg-[#18191b] rounded-xl shadow p-6 flex flex-col gap-2 hover:bg-[#232425] transition cursor-pointer">
						<span className="text-xs font-semibold text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded w-fit mb-2">
							Premium AI
						</span>
						<h3 className="text-lg font-bold">Advanced AI Models</h3>
						<p className="text-gray-400 text-sm">
							Powered by the latest and most capable models from Deepseek, Azure
							OpenAI, Google Gemini, Claude, and Gork — always updated to ensure
							top-tier reasoning, accuracy, and performance. Includes integrated
							WebSearch for real-time results. Far beyond the lightweight models
							used by most platforms.
						</p>
					</div>
					<div className="bg-[#18191b] rounded-xl shadow p-6 flex flex-col gap-2 hover:bg-[#232425] transition cursor-pointer">
						<span className="text-xs font-semibold text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded w-fit mb-2">
							Guaranteed Results
						</span>
						<h3 className="text-lg font-bold">Proven Success Rate</h3>
						<p className="text-gray-400 text-sm">
							80% of our subscribers secure their dream jobs within 3 months,
							with 40% landing $100K+ offers. Your success is our guarantee.
						</p>
					</div>
					<div className="bg-[#18191b] rounded-xl shadow p-6 flex flex-col gap-2 hover:bg-[#232425] transition cursor-pointer">
						<span className="text-xs font-semibold text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded w-fit mb-2">
							Full Coverage
						</span>
						<h3 className="text-lg font-bold">Complete Career Ecosystem</h3>
						<p className="text-gray-400 text-sm">
							One platform for everything: build your resume, find and apply to
							jobs, ace your interviews, and tap into expert communities to
							excel at every stage.
						</p>
					</div>
					<div className="bg-[#18191b] rounded-xl shadow p-6 flex flex-col gap-2 hover:bg-[#232425] transition cursor-pointer">
						<span className="text-xs font-semibold text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded w-fit mb-2">
							Mobile Optimized
						</span>
						<h3 className="text-lg font-bold">Practice Anywhere</h3>
						<p className="text-gray-400 text-sm">
							No app download needed - get real-time answers in your live
							interview and conduct mock interviews anywhere, anytime with our
							mobile-optimized platform.
						</p>
					</div>
					<div className="bg-[#18191b] rounded-xl shadow p-6 flex flex-col gap-2 hover:bg-[#232425] transition cursor-pointer">
						<span className="text-xs font-semibold text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded w-fit mb-2">
							Cutting-Edge Technology
						</span>
						<h3 className="text-lg font-bold">Dual-Layer AI Platform</h3>
						<p className="text-gray-400 text-sm">
							The only dual-layer platform offering both an AI Copilot and an AI
							Coach running simultaneously, delivering real-time insights and
							instant corrections.
						</p>
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section
				id="testimonials"
				className="w-full max-w-4xl mx-auto py-20 px-4 text-center"
			>
				<h2 className="text-3xl sm:text-4xl font-bold mb-8">Testimonials</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
					<div className="bg-[#18191b] rounded-xl shadow p-6 text-left hover:bg-[#232425] transition cursor-pointer">
						<p className="text-lg font-semibold mb-2">
							“LockedIn AI helped me land my dream job in just 2 months!”
						</p>
						<span className="block text-gray-400 text-sm">
							— Jane Doe, Software Engineer
						</span>
					</div>
					<div className="bg-[#18191b] rounded-xl shadow p-6 text-left hover:bg-[#232425] transition cursor-pointer">
						<p className="text-lg font-semibold mb-2">
							“The real-time coaching and feedback is a game changer.”
						</p>
						<span className="block text-gray-400 text-sm">
							— John Smith, Product Manager
						</span>
					</div>
				</div>
			</section>

			{/* Pricing Section */}
			<section
				id="pricing"
				className="w-full max-w-4xl mx-auto py-20 px-4 text-center"
			>
				<h2 className="text-3xl sm:text-4xl font-bold mb-8">Pricing</h2>
				<div className="flex flex-col sm:flex-row gap-8 justify-center">
					<div className="bg-[#18191b] rounded-xl shadow p-8 flex-1 hover:bg-[#232425] transition cursor-pointer">
						<h3 className="text-xl font-bold mb-2">Free Trial</h3>
						<p className="text-gray-400 mb-4">
							Try all features for 7 days. No credit card required.
						</p>
						<span className="block text-3xl font-bold text-cyan-400 mb-2">
							$0
						</span>
						<a
							href="#signup"
							className="inline-block mt-4 px-6 py-2 rounded-full bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition"
						>
							Start Free
						</a>
					</div>
					<div className="bg-[#18191b] rounded-xl shadow p-8 flex-1 hover:bg-[#232425] transition cursor-pointer border-2 border-cyan-400">
						<h3 className="text-xl font-bold mb-2">Pro</h3>
						<p className="text-gray-400 mb-4">
							Unlock unlimited access to all features, priority support, and
							more.
						</p>
						<span className="block text-3xl font-bold text-cyan-400 mb-2">
							$29/mo
						</span>
						<a
							href="#signup"
							className="inline-block mt-4 px-6 py-2 rounded-full bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition"
						>
							Go Pro
						</a>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section
				id="faq"
				className="w-full max-w-4xl mx-auto py-20 px-4 text-center"
			>
				<h2 className="text-3xl sm:text-4xl font-bold mb-8">FAQ</h2>
				<div className="space-y-6 text-left">
					<div className="bg-[#18191b] rounded-xl shadow p-6 hover:bg-[#232425] transition cursor-pointer">
						<h3 className="text-lg font-bold mb-2">
							How does the AI Copilot work?
						</h3>
						<p className="text-gray-400 text-sm">
							Our AI Copilot uses advanced language models to simulate real
							interview scenarios and provide instant feedback.
						</p>
					</div>
					<div className="bg-[#18191b] rounded-xl shadow p-6 hover:bg-[#232425] transition cursor-pointer">
						<h3 className="text-lg font-bold mb-2">
							Can I use the platform for free?
						</h3>
						<p className="text-gray-400 text-sm">
							Yes, you can start with a 7-day free trial and upgrade to Pro
							anytime.
						</p>
					</div>
				</div>
			</section>

			{/* Contact & Support Section */}
			<section
				id="contact"
				className="w-full max-w-4xl mx-auto py-20 px-4 text-center"
			>
				<h2 className="text-3xl sm:text-4xl font-bold mb-8">
					Contact & Support
				</h2>
				<form className="max-w-xl mx-auto flex flex-col gap-4">
					<input
						type="text"
						placeholder="Your Name"
						className="px-4 py-3 rounded bg-[#232425] text-white placeholder-gray-400 focus:outline-none"
					/>
					<input
						type="email"
						placeholder="Your Email"
						className="px-4 py-3 rounded bg-[#232425] text-white placeholder-gray-400 focus:outline-none"
					/>
					<textarea
						placeholder="How can we help you?"
						className="px-4 py-3 rounded bg-[#232425] text-white placeholder-gray-400 focus:outline-none"
						rows={4}
					></textarea>
					<button
						type="submit"
						className="px-6 py-3 rounded-full bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition"
					>
						Send Message
					</button>
				</form>
			</section>
		</div>
	);
}
