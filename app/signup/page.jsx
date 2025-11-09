"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import createClientForBrowser from '@/utils/supabase/client';

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
		} else {
			const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
			if (!emailRegex.test(formData.email)) {
				newErrors.email = "Invalid email. Use a valid address like name@gmail.com";
			}
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
			// Debug: Log environment variables (remove in production)
			console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
			console.log("Supabase ANON KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

			const supabase = createClientForBrowser();

			// Debug: Log before signup
			console.log("Attempting signup with:", formData.email);

			const { data, error } = await supabase.auth.signUp({
				email: formData.email,
				password: formData.password,
				options: {
					data: {
						name: `${formData.firstName} ${formData.lastName}`.trim(),
						firstName: formData.firstName,
						lastName: formData.lastName,
					},
				},
			});

			// Debug: Log response
			console.log("Signup response:", { data, error });

			let alreadyExists = false;
			if (error) {
				if (
					error.code === 'user_already_exists' ||
					error.code === 'email_exists'
				) {
					alreadyExists = true;
				}
			}
			// If user exists but is unverified, send to OTP
			if (!error && data && data.user && !data.session) {
				alreadyExists = true;
			}

			if (alreadyExists) {
				// Check if user is unverified (email_confirmed_at is null)
				if (data && data.user && !data.user.email_confirmed_at) {
					router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
					return;
				}
				setErrors({
					general: 'An account with this email already exists. Please try logging in.',
				});
			} else if (error) {
				setErrors({ general: error.message });
			} else {
				router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
			}
		} catch (error) {
			// Improved error feedback
			setErrors({ general: 'Signup failed. Please check your network connection and try again.' });
			console.error("Signup error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	// Replace the handleSocialSignIn function with the unified version
	const handleSocialSignIn = async (provider) => {
		try {
			const supabase = createClientForBrowser();
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider,
				options: {
					redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
				},
			});

			if (error) {
				setErrors({ general: `${provider} sign-in failed: ${error.message}` });
			} else if (data.url) {
				window.location.href = data.url;
			}
		} catch (err) {
			setErrors({ general: `${provider} sign-in failed. Please try again.` });
		}
	};

	return (
		<div className="min-h-screen bg-[#101113] flex items-center justify-center px-4 py-8">
			<div className="absolute top-6 left-6">
				<button
					onClick={() => router.push('/')}
					className="flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400 bg-[#18191b] text-cyan-400 hover:bg-cyan-900 hover:text-white shadow-lg transition-all duration-200 font-semibold"
					title="Back to Home"
				>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
					<span>Back</span>
				</button>
			</div>
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
									placeholder="First name"
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
									placeholder="Last name"
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

						<div className="flex flex-row gap-4 mb-6 justify-center mt-8">
							<button
								type="button"
								onClick={() => handleSocialSignIn('google')}
								disabled={isLoading}
								className="flex items-center gap-2 px-5 py-2 rounded-lg font-semibold bg-white text-black border border-gray-300 shadow hover:bg-gray-100 transition min-w-[140px] justify-center disabled:opacity-50"
								style={{ minWidth: 120 }}
							>
								<svg className="w-5 h-5" viewBox="0 0 48 48">
									<g>
										<path fill="#4285F4" d="M24 9.5c3.54 0 6.36 1.53 7.82 2.81l5.8-5.8C34.64 3.36 29.74 1 24 1 14.82 1 6.91 6.98 3.36 15.09l6.74 5.23C12.13 14.09 17.61 9.5 24 9.5z"/>
										<path fill="#34A853" d="M46.14 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.44c-.54 2.9-2.18 5.36-4.66 7.01l7.19 5.59C43.91 37.02 46.14 31.34 46.14 24.55z"/>
										<path fill="#FBBC05" d="M10.1 28.32a14.5 14.5 0 010-8.64l-6.74-5.23A23.98 23.98 0 001 24c0 3.77.9 7.34 2.36 10.55l6.74-5.23z"/>
										<path fill="#EA4335" d="M24 46.5c6.48 0 11.92-2.14 15.89-5.82l-7.19-5.59c-2.01 1.35-4.59 2.16-8.7 2.16-6.39 0-11.87-4.59-13.9-10.81l-6.74 5.23C6.91 41.02 14.82 46.5 24 46.5z"/>
										<path fill="none" d="M1 1h46v46H1z"/>
									</g>
								</svg>
								Google
							</button>
							<button
								type="button"
								onClick={() => handleSocialSignIn('github')}
								disabled={isLoading}
								className="flex items-center gap-2 px-5 py-2 rounded-lg font-semibold bg-[#18191b] text-white border border-gray-700 shadow hover:bg-gray-900 transition min-w-[140px] justify-center disabled:opacity-50"
								style={{ minWidth: 120 }}
							>
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
								</svg>
								GitHub
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
