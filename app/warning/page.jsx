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
      <div className="bg-white shadow-xl rounded-lg p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-yellow-700 mb-4">Protected Page Warning</h1>
        <p className="text-gray-700 mb-6 text-center">
          You are trying to access a protected page without logging in.
        </p>
        <div className="flex items-center gap-2 text-lg text-yellow-800 font-semibold">
          Redirecting to login in <span className="text-2xl font-bold">{count}</span> seconds...
        </div>
      </div>
    </div>
  );
} 