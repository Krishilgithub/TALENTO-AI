import Image from "next/image";

export default function Footer() {
	return (
		<footer className="w-full bg-[#18191b] border-t border-gray-800 pt-10 pb-4 mt-0">
			<div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-gray-400 text-sm">
				<div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
					<div className="flex items-center gap-2 mb-2 md:mb-0">
						<Image
							src="/file.svg"
							alt="Talento AI Logo"
							width={28}
							height={28}
						/>
						<span>
							© {new Date().getFullYear()} Talento AI. All rights reserved.
						</span>
					</div>
					<div className="flex flex-col gap-1 text-xs text-gray-300 md:border-l md:pl-4 border-gray-700">
						<span>
							Email:{" "}
							<a
								href="mailto:support@talentoai.com"
								className="text-cyan-400 hover:underline"
							>
								support@talentoai.com
							</a>
						</span>
						<span>
							Phone:{" "}
							<a
								href="tel:+1234567890"
								className="text-cyan-400 hover:underline"
							>
								+1 (234) 567-890
							</a>
						</span>
						<span>Business Hours: Mon-Fri, 9am-6pm (UTC)</span>
						<span>
							For partnership/media:{" "}
							<a
								href="mailto:media@talentoai.com"
								className="text-cyan-400 hover:underline"
							>
								media@talentoai.com
							</a>
						</span>
					</div>
				</div>
				<div className="flex flex-col md:flex-row gap-2 md:gap-4 flex-wrap items-start md:items-center">
					<a href="#features" className="hover:text-cyan-400">
						Features
					</a>
					<a href="#pricing" className="hover:text-cyan-400">
						Pricing
					</a>
					<a href="#faq" className="hover:text-cyan-400">
						FAQ
					</a>
					<a href="#contact" className="hover:text-cyan-400">
						Contact
					</a>
					<a href="/terms" className="hover:text-cyan-400">
						Terms
					</a>
					<a href="/privacy" className="hover:text-cyan-400">
						Privacy
					</a>
					<a
						href="https://github.com/Krishilgithub/TALENTO-AI"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-cyan-400"
					>
						GitHub
					</a>
				</div>
			</div>
			<div className="text-center text-xs text-gray-600 mt-4">
				Built with <span className="text-cyan-400">Next.js</span>,{" "}
				<span className="text-cyan-400">Tailwind CSS</span>,{" "}
				<span className="text-cyan-400">GSAP</span>, and{" "}
				<span className="text-cyan-400">Locomotive Scroll</span>.
			</div>
		</footer>
	);
}
