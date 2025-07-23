'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/reset');
  }, [router]);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#101113]">
      <div className="bg-[#18191b] rounded-2xl shadow-xl p-8 border border-gray-700 flex flex-col items-center">
        <span className="text-2xl font-semibold text-white mb-2">Redirecting…</span>
        <span className="text-gray-400 mb-4">Taking you to the password reset page</span>
        <span className="loading loading-spinner loading-lg text-cyan-400"></span>
      </div>
    </div>
  );
} 