"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
	CheckCircleIcon,
	XCircleIcon,
	ArrowPathIcon,
} from "@heroicons/react/24/outline";

function LinkedInCallbackContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [status, setStatus] = useState("processing"); // processing, success, error
	const [message, setMessage] = useState(
		"Processing LinkedIn authorization..."
	);

	useEffect(() => {
		const handleCallback = async () => {
			try {
				const code = searchParams.get("code");
				const error = searchParams.get("error");

				if (error) {
					setStatus("error");
					setMessage("LinkedIn authorization was cancelled or failed.");
					return;
				}

				if (!code) {
					setStatus("error");
					setMessage("No authorization code received from LinkedIn.");
					return;
				}

				// Exchange code for access token
				const formData = new FormData();
				formData.append("authorization_code", code);

				const response = await fetch("/api/linkedin/exchange-code", {
					method: "POST",
					body: formData,
				});

				const result = await response.json();

				if (result.error) {
					setStatus("error");
					setMessage(`Failed to authenticate with LinkedIn: ${result.error}`);
					return;
				}

				// Store the access token in localStorage (in a real app, you'd use a more secure method)
				localStorage.setItem("linkedin_access_token", result.access_token);
				localStorage.setItem("linkedin_user_id", result.user_id);

				setStatus("success");
				setMessage(
					"Successfully connected to LinkedIn! You can now post directly to your profile."
				);

				// Redirect back to the LinkedIn Post Generator after a short delay
				setTimeout(() => {
					router.push("/dashboard?tab=linkedin-post-generator");
				}, 2000);
			} catch (error) {
				console.error("LinkedIn callback error:", error);
				setStatus("error");
				setMessage(
					"An unexpected error occurred during LinkedIn authorization."
				);
			}
		};

		handleCallback();
	}, [searchParams, router]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
			>
				<div className="text-center">
					{status === "processing" && (
						<div className="mb-6">
							<ArrowPathIcon className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
							<h2 className="text-xl font-semibold text-gray-900 mb-2">
								Connecting to LinkedIn
							</h2>
							<p className="text-gray-600">{message}</p>
						</div>
					)}

					{status === "success" && (
						<div className="mb-6">
							<CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
							<h2 className="text-xl font-semibold text-gray-900 mb-2">
								Successfully Connected!
							</h2>
							<p className="text-gray-600">{message}</p>
						</div>
					)}

					{status === "error" && (
						<div className="mb-6">
							<XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
							<h2 className="text-xl font-semibold text-gray-900 mb-2">
								Connection Failed
							</h2>
							<p className="text-gray-600">{message}</p>
						</div>
					)}

					<div className="space-y-3">
						<button
							onClick={() =>
								router.push("/dashboard?tab=linkedin-post-generator")
							}
							className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
						>
							Go to LinkedIn Post Generator
						</button>
						<button
							onClick={() => router.push("/dashboard")}
							className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
						>
							Back to Dashboard
						</button>
					</div>
				</div>
			</motion.div>
		</div>
	);
}

export default function LinkedInCallback() {
	return (
		<Suspense fallback={
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
				<div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
					<ArrowPathIcon className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Loading...
					</h2>
					<p className="text-gray-600">Processing LinkedIn authorization...</p>
				</div>
			</div>
		}>
			<LinkedInCallbackContent />
		</Suspense>
	);
}
