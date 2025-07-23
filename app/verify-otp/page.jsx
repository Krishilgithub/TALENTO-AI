'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import createClientForBrowser from '../../utils/supabase/client';

function VerifyOtpInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const supabase = createClientForBrowser();
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });
    if (error) {
      setError(error.message);
    } else {
      router.push('/onboarding');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#101113] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Verify OTP</h1>
          <h2 className="text-lg text-gray-300 mb-4">Enter the OTP sent to <span className="font-semibold text-cyan-400">{email}</span></h2>
        </div>
        <div className="bg-[#18191b] rounded-2xl shadow-xl p-8 border border-gray-700">
          <form onSubmit={handleVerify} className="space-y-6">
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="otp">OTP</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
              placeholder="Enter OTP"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 bg-[#101113] text-white placeholder-gray-400 border-gray-600"
            />
            <button
              type="submit"
              className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-60"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
            {error && (
              <div className="bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm mb-2">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="text-white">Loading...</span></div>}>
      <VerifyOtpInner />
    </Suspense>
  );
}
