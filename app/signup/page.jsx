"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
		agreeToTerms: false,
	});
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.firstName.trim()) {
			newErrors.firstName = "First name is required";
		}

		if (!formData.lastName.trim()) {
			newErrors.lastName = "Last name is required";
		}

		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 8) {
			newErrors.password = "Password must be at least 8 characters";
		} else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
			newErrors.password =
				"Password must contain at least one uppercase letter, one lowercase letter, and one number";
		}

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = "Please confirm your password";
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		if (!formData.agreeToTerms) {
			newErrors.agreeToTerms = "You must agree to the terms and conditions";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsLoading(true);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Store user data in localStorage (in a real app, this would be sent to a backend)
			const userData = {
				firstName: formData.firstName,
				lastName: formData.lastName,
				email: formData.email,
				role: "user",
				name: `${formData.firstName} ${formData.lastName}`,
				createdAt: new Date().toISOString(),
			};

			localStorage.setItem("user", JSON.stringify(userData));

			// Store in users list for admin panel
			const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
			existingUsers.push(userData);
			localStorage.setItem("users", JSON.stringify(existingUsers));

			router.push("/dashboard");
		} catch (error) {
			console.error("Signup error:", error);
			setErrors({ general: "Signup failed. Please try again." });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#101113] flex items-center justify-center px-4 py-8">
			<div className="max-w-md w-full space-y-8">
				{/* Header */}
				<div className="text-center">
					<Link href="/" className="inline-block">
						<h1 className="text-3xl font-bold text-white mb-2">Talento AI</h1>
					</Link>
					<h2 className="text-2xl font-semibold text-white">
						Create your account
					</h2>
					<p className="mt-2 text-gray-300">
						Start your journey with Talento AI
					</p>
				</div>

				{/* Signup Form */}
				<div className="bg-[#18191b] rounded-2xl shadow-xl p-8 border border-gray-700">
					<form onSubmit={handleSubmit} className="space-y-6">
						{errors.general && (
							<div className="bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
								{errors.general}
							</div>
						)}

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="firstName"
									className="block text-sm font-medium text-gray-300 mb-2"
								>
									First name
								</label>
								<input
									id="firstName"
									name="firstName"
									type="text"
									autoComplete="given-name"
									required
									value={formData.firstName}
									onChange={handleChange}
									className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 bg-[#101113] text-white placeholder-gray-400 ${
										errors.firstName ? "border-red-500" : "border-gray-600"
									}`}
									placeholder="John"
								/>
								{errors.firstName && (
									<p className="mt-1 text-sm text-red-400">
										{errors.firstName}
									</p>
								)}
							</div>

							<div>
								<label
									htmlFor="lastName"
									className="block text-sm font-medium text-gray-300 mb-2"
								>
									Last name
								</label>
								<input
									id="lastName"
									name="lastName"
									type="text"
									autoComplete="family-name"
									required
									value={formData.lastName}
									onChange={handleChange}
									className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 bg-[#101113] text-white placeholder-gray-400 ${
										errors.lastName ? "border-red-500" : "border-gray-600"
									}`}
									placeholder="Doe"
								/>
								{errors.lastName && (
									<p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
								)}
							</div>
						</div>

						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-300 mb-2"
							>
								Email address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								value={formData.email}
								onChange={handleChange}
								className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 bg-[#101113] text-white placeholder-gray-400 ${
									errors.email ? "border-red-500" : "border-gray-600"
								}`}
								placeholder="john@example.com"
							/>
							{errors.email && (
								<p className="mt-1 text-sm text-red-400">{errors.email}</p>
							)}
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-300 mb-2"
							>
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="new-password"
								required
								value={formData.password}
								onChange={handleChange}
								className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 bg-[#101113] text-white placeholder-gray-400 ${
									errors.password ? "border-red-500" : "border-gray-600"
								}`}
								placeholder="Create a strong password"
							/>
							{errors.password && (
								<p className="mt-1 text-sm text-red-400">{errors.password}</p>
							)}
						</div>

						<div>
							<label
								htmlFor="confirmPassword"
								className="block text-sm font-medium text-gray-300 mb-2"
							>
								Confirm password
							</label>
							<input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								autoComplete="new-password"
								required
								value={formData.confirmPassword}
								onChange={handleChange}
								className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 bg-[#101113] text-white placeholder-gray-400 ${
									errors.confirmPassword ? "border-red-500" : "border-gray-600"
								}`}
								placeholder="Confirm your password"
							/>
							{errors.confirmPassword && (
								<p className="mt-1 text-sm text-red-400">
									{errors.confirmPassword}
								</p>
							)}
						</div>

						<div className="flex items-start">
							<div className="flex items-center h-5">
								<input
									id="agreeToTerms"
									name="agreeToTerms"
									type="checkbox"
									checked={formData.agreeToTerms}
									onChange={handleChange}
									className="h-4 w-4 text-cyan-400 focus:ring-cyan-400 border-gray-600 rounded bg-[#101113]"
								/>
							</div>
							<div className="ml-3 text-sm">
								<label htmlFor="agreeToTerms" className="text-gray-300">
									I agree to the{" "}
									<Link
										href="/terms"
										className="text-cyan-400 hover:text-cyan-300"
									>
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link
										href="/privacy"
										className="text-cyan-400 hover:text-cyan-300"
									>
										Privacy Policy
									</Link>
								</label>
								{errors.agreeToTerms && (
									<p className="mt-1 text-sm text-red-400">
										{errors.agreeToTerms}
									</p>
								)}
							</div>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-cyan-400 text-black py-3 px-4 rounded-lg font-medium hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? (
								<div className="flex items-center justify-center">
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
									Creating account...
								</div>
							) : (
								"Create account"
							)}
						</button>
					</form>

					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-600" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-[#18191b] text-gray-400">
									Or continue with
								</span>
							</div>
						</div>

						<div className="mt-6 grid grid-cols-2 gap-3">
							<button className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-lg shadow-sm bg-[#101113] text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors duration-200">
								<svg className="w-5 h-5" viewBox="0 0 24 24">
									<path
										fill="currentColor"
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									/>
									<path
										fill="currentColor"
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									/>
									<path
										fill="currentColor"
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									/>
									<path
										fill="currentColor"
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									/>
								</svg>
								<span className="ml-2">Google</span>
							</button>
							<button className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-lg shadow-sm bg-[#101113] text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors duration-200">
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
								</svg>
								<span className="ml-2">Twitter</span>
							</button>
						</div>
					</div>

					<p className="mt-6 text-center text-sm text-gray-400">
						Already have an account?{" "}
						<Link
							href="/login"
							className="font-medium text-cyan-400 hover:text-cyan-300"
						>
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
