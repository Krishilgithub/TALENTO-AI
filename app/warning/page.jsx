'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WarningPage() {
  const [count, setCount] = useState(5);
  const router = useRouter();

  useEffect(() => {
    if (count === 0) {
      router.replace('/login');
    }
    const timer = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300">
      <div className="bg-white shadow-2xl rounded-xl p-10 flex flex-col items-center border-4 border-yellow-400 relative">
        <div className="absolute -top-12 flex items-center justify-center w-24 h-24 bg-yellow-400 rounded-full shadow-lg border-4 border-white">
          <svg className="w-14 h-14 text-yellow-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M21 19a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-yellow-700 mb-4 mt-16 drop-shadow">Protected Page Warning</h1>
        <p className="text-gray-800 mb-6 text-center text-lg font-medium">
          You are trying to access a protected page without logging in.
        </p>
        <div className="flex items-center gap-2 text-lg text-yellow-900 font-semibold bg-yellow-100 px-4 py-2 rounded-lg border border-yellow-300 shadow">
          Redirecting to login in <span className="text-2xl font-bold">{count}</span> seconds...
        </div>
      </div>
    </div>
  );
} 