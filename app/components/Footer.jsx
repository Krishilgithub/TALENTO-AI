import Image from "next/image";
import Link from "next/link"; // ✅ Importing Link

export default function Footer() {
	return (
		<footer className="w-full bg-gray-100 dark:bg-[#0f0f0f] border-t border-gray-300 dark:border-gray-800 pt-10 pb-4 mt-0 transition-colors duration-300">
			<div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-gray-400 text-sm">
				<div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
					<div className="flex items-center gap-2 mb-2 md:mb-0">
						<Link href="/">
							<div className="flex items-center space-x-2">
								<Image src="/logo.svg" alt="Talento AI" width={24} height={24} />
								<span className="text-lg font-bold text-gray-900 dark:text-white">
									TALENTO <span className="text-cyan-400">AI</span>
								</span>
							</div>
						</Link>
						<span suppressHydrationWarning>
							© {new Date().getFullYear()} Talento AI. All rights reserved.
						</span>
					</div>
					<div className="flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-400 md:border-l md:pl-4 border-gray-400 dark:border-gray-600">
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
		</footer>
	);
}
