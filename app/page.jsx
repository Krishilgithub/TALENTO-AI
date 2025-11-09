"use client";
import Navbar from "./Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ContactSection from "./components/ContactSection.jsx";
import FeaturesSection from "./components/FeaturesSection.jsx";
import ScenariosSection from "./components/ScenariosSection.jsx";
import WhySection from "./components/WhySection.jsx";
import TestimonialsSection from "./components/TestimonialsSection.jsx";
import FAQSection from "./components/FAQSection.jsx";
import { withLoadingCursor } from "../utils/profileUtils";

export default function Home() {
	const handleNavigation = withLoadingCursor(async (href) => {
		if (href.startsWith('#')) {
			// For anchor links, scroll smoothly with a slight delay to show cursor loading
			await new Promise(resolve => setTimeout(resolve, 500));
			const element = document.querySelector(href);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
			}
		} else {
			// For page navigation
			window.location.href = href;
		}
	});

	return (
		<div
			data-scroll-container
			className="flex flex-col min-h-screen bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white transition-colors duration-300"
		>
			<Navbar />
			<main className="flex-1">
				<section className="w-full flex flex-col items-center justify-center py-20 px-4 text-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#0f0f0f] dark:to-[#1a1a1a] mt-32 sm:mt-36 md:mt-40">
					<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight max-w-3xl text-gray-900 dark:text-white">
						Unlock Your Potential with{" "}
						<span className="text-cyan-400">AI-Powered</span> Interview Prep &
						Career Tools
					</h1>
					<p className="text-lg sm:text-xl max-w-2xl mb-8 text-gray-600 dark:text-gray-300">
						Resume building and Optimization, Job Search, Interview Preparation,
						Everything you need to land your dream job, powered by the latest AI
						technology.
					</p>

					{/* Website Functions Info */}
					<div className="max-w-4xl mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-200 dark:border-gray-800">
							<div className="text-cyan-400 text-2xl mb-3">🤖</div>
							<h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">AI-Powered Assessments</h3>
							<p className="text-gray-600 dark:text-gray-400 text-sm">Comprehensive personality, technical, and communication assessments with AI-driven insights</p>
						</div>
						<div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-200 dark:border-gray-800">
							<div className="text-cyan-400 text-2xl mb-3">📄</div>
							<h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Smart Resume Builder</h3>
							<p className="text-gray-600 dark:text-gray-400 text-sm">AI-optimized resume creation and analysis to match job requirements perfectly</p>
						</div>
						<div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-200 dark:border-gray-800">
							<div className="text-cyan-400 text-2xl mb-3">🎯</div>
							<h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Interview Practice</h3>
							<p className="text-gray-600 dark:text-gray-400 text-sm">Mock interviews with real-time feedback and personalized coaching recommendations</p>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button
							onClick={() => handleNavigation('#features')}
							className="bg-cyan-400 text-black px-8 py-3 rounded-full font-semibold shadow hover:bg-cyan-300 transition cursor-pointer"
						>
							Get Started
						</button>
						<button
							onClick={() => handleNavigation('#contact')}
							className="border border-cyan-400 text-cyan-400 px-8 py-3 rounded-full font-semibold hover:bg-cyan-400 hover:text-black transition cursor-pointer"
						>
							Contact Us
						</button>
					</div>
				</section>
				<FeaturesSection />
				<ScenariosSection />
				<WhySection />
				<TestimonialsSection />
				<FAQSection />
				<ContactSection />
			</main>
			<Footer />
		</div>
	);
}
