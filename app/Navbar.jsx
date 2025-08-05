"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./components/ThemeToggle";
import { useTheme } from "./context/ThemeContext";

const navLinks = [
	{ label: "Features", href: "#features" },
	{ label: "Testimonials", href: "#testimonials" },
	{ label: "Pricing", href: "#pricing" },
	{ label: "FAQ", href: "#faq" },
	{ label: "Contact", href: "#contact" },
];

export default function Navbar() {
	const [open, setOpen] = useState(false);
	const { isDark } = useTheme();
	
	return (
		<nav className={`floating-navbar bg-white/80 dark:bg-[#101113]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 ${isDark ? 'dark' : 'light'}`}>
			<div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 py-3">
				<div className="flex items-center gap-2">
					<Link href="/">
						<div className="flex items-center space-x-2">
							<Image src="/logo.svg" alt="Talento AI" width={32} height={32} />
							<span className="text-xl font-bold text-gray-900 dark:text-white">
								TALENTO <span className="text-cyan-400">AI</span>
							</span>
						</div>
					</Link>
				</div>

				<div className="hidden lg:flex gap-2 items-center text-base font-medium">
					{navLinks.map((link) => (
						<a
							key={link.label}
							href={link.href}
							className="px-4 py-2 rounded-full transition font-semibold text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#232323]"
						>
							{link.label}
						</a>
					))}
					<ThemeToggle />
					<Link
						href="/login"
						className="text-gray-700 dark:text-white px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#232323]"
					>
						Login
					</Link>
					<Link
						href="/signup"
						className="ml-2 px-4 py-2 rounded-full bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition"
					>
						Sign Up
					</Link>
				</div>
				<button
					className="lg:hidden flex items-center text-gray-700 dark:text-white focus:outline-none"
					onClick={() => setOpen((o) => !o)}
					aria-label="Open menu"
				>
					<svg width="28" height="28" fill="none" viewBox="0 0 24 24">
						<path
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
			</div>
			{/* Mobile menu */}
			{open && (
				<div className="lg:hidden bg-white dark:bg-[#101113] border-t border-gray-200 dark:border-gray-800 px-4 pb-4 flex flex-col gap-2 rounded-b-2xl">
					{navLinks.map((link) => (
						<a
							key={link.label}
							href={link.href}
							className="block px-4 py-2 rounded-full transition font-semibold text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#232323]"
							onClick={() => setOpen(false)}
						>
							{link.label}
						</a>
					))}
					<Link
						href="/login"
						className="text-gray-700 dark:text-white px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#232323]"
						onClick={() => setOpen(false)}
					>
						Login
					</Link>
					<Link
						href="/signup"
						className="px-4 py-2 rounded-full bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition"
						onClick={() => setOpen(false)}
					>
						Sign Up
					</Link>
				</div>
			)}
		</nav>
	);
}
