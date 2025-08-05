"use client";
import Navbar from "./Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ContactSection from "./components/ContactSection.jsx";
import FeaturesSection from "./components/FeaturesSection.jsx";
import ScenariosSection from "./components/ScenariosSection.jsx";
import WhySection from "./components/WhySection.jsx";
import TestimonialsSection from "./components/TestimonialsSection.jsx";
import PricingSection from "./components/PricingSection.jsx";
import FAQSection from "./components/FAQSection.jsx";

export default function Home() {

	return (
		<div
			data-scroll-container
			className="flex flex-col min-h-screen bg-white dark:bg-[#101113] text-gray-900 dark:text-white transition-colors duration-300"
		>
			<Navbar />
			<main className="flex-1">
				<section className="w-full flex flex-col items-center justify-center py-20 px-4 text-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#101113] dark:to-[#18191b] mt-32 sm:mt-36 md:mt-40">
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
				<FeaturesSection />
				<ScenariosSection />
				<WhySection />
				<TestimonialsSection />
				<PricingSection />
				<FAQSection />
				<ContactSection />
			</main>
			<Footer />
		</div>
	);
}
