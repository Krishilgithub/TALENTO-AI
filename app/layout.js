import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata = {
	title: "Talento AI - AI-Powered Interview Prep & Career Tools",
	description:
		"Unlock your potential with AI-powered interview preparation, resume optimization, coding help, and career tools. Everything you need to land your dream job.",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-[#101113] text-gray-900 dark:text-white transition-colors duration-300`}
			>
				<ThemeProvider>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
