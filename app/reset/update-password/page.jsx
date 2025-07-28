    'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import createClientForBrowser from '@/utils/supabase/client';

const Page = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!password || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    const supabase = createClientForBrowser();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#101113] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Update Password</h1>
          <h2 className="text-lg text-gray-300 mb-4">Set your new password</h2>
        </div>
        <div className="bg-[#18191b] rounded-2xl shadow-xl p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">New Password</label>
            <input
              name="password"
              id="password"
              type="password"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 bg-[#101113] text-white placeholder-gray-400 border-gray-600"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="confirmPassword">Confirm New Password</label>
            <input
              name="confirmPassword"
              id="confirmPassword"
              type="password"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 bg-[#101113] text-white placeholder-gray-400 border-gray-600"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
            <button type="submit" className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-60" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
            {error && (
              <div role="alert" className="bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div role="alert" className="bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 px-4 py-3 rounded-lg text-sm">
                <span>{success}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
