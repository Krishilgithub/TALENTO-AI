'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordRedirect() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/reset'), 600);
    return () => clearTimeout(timer);
  }, [router]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0c10] via-[#101113] to-[#0b0c10] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-[#18191b] rounded-2xl shadow-2xl p-10 border border-gray-700 text-center">
        <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-cyan-900/30 border border-cyan-700 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-cyan-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Redirecting to Reset Password</h1>
        <p className="text-gray-400 mb-6">Hold on a moment while we take you to the secure password reset page.</p>
        <button
          onClick={() => router.replace('/reset')}
          className="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-semibold transition-all duration-200"
        >
          Go now
        </button>
      </div>
    </div>
  );
}