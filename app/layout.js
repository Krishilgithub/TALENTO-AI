import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				{children}
			</body>
		</html>
	);
}
