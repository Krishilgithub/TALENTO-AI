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
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
							<div className="relative">
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									autoComplete="new-password"
									required
									value={formData.password}
									onChange={handleChange}
									className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 bg-[#101113] text-white placeholder-gray-400 pr-10 ${
										errors.password ? "border-red-500" : "border-gray-600"
									}`}
									placeholder="Create a strong password"
								/>
								<button
									type="button"
									onClick={() => setShowPassword((v) => !v)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none"
									tabIndex={-1}
									aria-label={showPassword ? "Hide password" : "Show password"}
								>
									{showPassword ? (
										<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.19.631-.453 1.23-.78 1.786M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.542 1.786A9.956 9.956 0 0122 12c0 5.523-4.477 10-10 10S2 17.523 2 12c0-.69.07-1.362.2-2.014" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 15.232A3.001 3.001 0 0112 15c-.828 0-1.58-.336-2.121-.879M4.271 4.271l15.458 15.458" /></svg>
									) : (
										<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.19.631-.453 1.23-.78 1.786M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
									)}
								</button>
							</div>
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
							<div className="relative">
								<input
									id="confirmPassword"
									name="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									autoComplete="new-password"
									required
									value={formData.confirmPassword}
									onChange={handleChange}
									className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 bg-[#101113] text-white placeholder-gray-400 ${
										errors.confirmPassword ? "border-red-500" : "border-gray-600"
									}`}
									placeholder="Confirm your password"
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword((v) => !v)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none"
									tabIndex={-1}
									aria-label={showConfirmPassword ? "Hide password" : "Show password"}
								>
									{showConfirmPassword ? (
										<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.19.631-.453 1.23-.78 1.786M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.542 1.786A9.956 9.956 0 0122 12c0 5.523-4.477 10-10 10S2 17.523 2 12c0-.69.07-1.362.2-2.014" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 15.232A3.001 3.001 0 0112 15c-.828 0-1.58-.336-2.121-.879M4.271 4.271l15.458 15.458" /></svg>
									) : (
										<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.19.631-.453 1.23-.78 1.786M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
									)}
								</button>
							</div>
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
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.339 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.417-.012 2.747 0 .268.18.579.688.481C19.138 20.2 22 16.448 22 12.021 22 6.484 17.523 2 12 2z" />
								</svg>
								<span className="ml-2">GitHub</span>
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
