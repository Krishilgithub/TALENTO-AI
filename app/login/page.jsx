'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
	signinWithEmailPassword,
	signinWithGithub,
	signinWithGoogle,
} from '@/utils/actions';
// Remove react-icons imports for social icons

export default function LoginPage() {
	const [formData, setFormData] = useState({ email: '', password: '' });
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const stored = localStorage.getItem('rememberedCredentials');
		if (stored) {
			const { email, remember } = JSON.parse(stored);
			if (remember) {
				setFormData((prev) => ({ ...prev, email }));
				setRememberMe(true);
			}
		}
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: '' }));
		}
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.email) newErrors.email = 'Email is required';
		else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

		if (!formData.password) newErrors.password = 'Password is required';
		else if (formData.password.length < 6)
			newErrors.password = 'Password must be at least 6 characters';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		setIsLoading(true);
		const result = await signinWithEmailPassword(formData);

		if (result.error) {
			setErrors({ general: result.error });
		} else {
			if (rememberMe) {
				localStorage.setItem(
					'rememberedCredentials',
					JSON.stringify({ email: formData.email, remember: true })
				);
			} else {
				localStorage.removeItem('rememberedCredentials');
			}
            // OTP verification check
            if (result.user && !result.user.email_confirmed_at) {
              router.push(`/verify-otp?email=${encodeURIComponent(result.user.email)}`);
              setIsLoading(false);
              return;
            }
			router.push('/dashboard');
		}
		setIsLoading(false);
	};

	const handleSocialSignIn = async (provider) => {
		setIsLoading(true);
		const handler = {
			google: signinWithGoogle,
			github: signinWithGithub,
		}[provider];

		if (handler) {
			try {
				const { url, error } = await handler();
				if (error) {
					setErrors({ general: `${provider} login failed.` });
				} else {
					window.location.href = url; // ✅ client-side redirect
				}
			} catch (err) {
				setErrors({ general: `${provider} login failed.` });
			}
		}
		setIsLoading(false);
	};

	return (
		<div className="min-h-screen bg-[#101113] flex items-center justify-center px-4">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<Link href="/" className="inline-block">
						<h1 className="text-3xl font-bold text-white mb-2">Talento AI</h1>
					</Link>
					<h2 className="text-2xl font-semibold text-white">Welcome back</h2>
					<p className="mt-2 text-gray-300">Sign in to your account</p>
				</div>

				<div className="bg-[#18191b] rounded-2xl shadow-xl p-8 border border-gray-700">
					<form onSubmit={handleSubmit} className="space-y-6">
						{errors.general && (
							<div className="bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
								{errors.general}
							</div>
						)}

						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
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
								className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 bg-[#101113] text-white placeholder-gray-400 ${errors.email ? 'border-red-500' : 'border-gray-600'
									}`}
								placeholder="Enter your email"
							/>
							{errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
								Password
							</label>
							<div className="relative">
								<input
									id="password"
									name="password"
									type={showPassword ? 'text' : 'password'}
									autoComplete="current-password"
									required
									value={formData.password}
									onChange={handleChange}
									className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 bg-[#101113] text-white placeholder-gray-400 ${errors.password ? 'border-red-500' : 'border-gray-600'
										}`}
									placeholder="Enter your password"
								/>
								<button
									type="button"
									onClick={() => setShowPassword((v) => !v)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
								>
									{showPassword ? 'Hide' : 'Show'}
								</button>
							</div>
							{errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
						</div>

						<div className="flex items-center justify-between space-x-4">
							<div className="flex items-center space-x-3 cursor-pointer select-none">
								<input
									id="remember-me"
									name="remember-me"
									type="checkbox"
									checked={rememberMe}
									onChange={(e) => setRememberMe(e.target.checked)}
									className="h-5 w-5 text-cyan-400 focus:ring-2 focus:ring-cyan-400 border-gray-600 rounded bg-[#101113] cursor-pointer"
								/>
								<label htmlFor="remember-me" className="text-sm text-gray-300 cursor-pointer">
									Remember me
								</label>
							</div>
							<Link href="/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300">
								Forgot password?
							</Link>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-cyan-400 text-black py-3 px-4 rounded-lg font-medium hover:bg-cyan-300 disabled:opacity-50"
						>
							{isLoading ? (
								<div className="flex items-center justify-center">
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
									Signing in...
								</div>
							) : (
								'Sign in'
							)}
						</button>
					</form>

					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-600" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-[#18191b] text-gray-400">Or continue with</span>
							</div>
						</div>

						<div className="flex flex-row gap-4 mb-6 justify-center mt-8">
							<button
								type="button"
								onClick={() => handleSocialSignIn('google')}
								className="flex items-center gap-2 px-5 py-2 rounded-lg font-semibold bg-white text-black border border-gray-300 shadow hover:bg-gray-100 transition min-w-[140px] justify-center"
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
								className="flex items-center gap-2 px-5 py-2 rounded-lg font-semibold bg-[#18191b] text-white border border-gray-700 shadow hover:bg-gray-900 transition min-w-[140px] justify-center"
								style={{ minWidth: 120 }}
							>
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.339 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.417-.012 2.747 0 .268.18.579.688.481C19.138 20.2 22 16.448 22 12.021 22 6.484 17.523 2 12 2z" />
								</svg>
								GitHub
							</button>
							<button
								type="button"
								onClick={() => handleSocialSignIn('linkedin')}
								className="flex items-center gap-2 px-5 py-2 rounded-lg font-semibold bg-[#0077b5] text-white border border-[#0077b5] shadow hover:bg-[#005983] transition min-w-[140px] justify-center"
								style={{ minWidth: 120 }}
							>
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
								</svg>
								LinkedIn
							</button>
						</div>
					</div>

					<p className="mt-6 text-center text-sm text-gray-400">
						Don't have an account?{' '}
						<Link href="/signup" className="font-medium text-cyan-400 hover:text-cyan-300">
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
