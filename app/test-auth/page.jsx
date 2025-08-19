'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import createClientForBrowser from '@/utils/supabase/client';

export default function TestAuthPage() {
  const [authStatus, setAuthStatus] = useState('Loading...');
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [configStatus, setConfigStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkConfig();
    checkAuth();
  }, []);

  const checkConfig = async () => {
    try {
      const response = await fetch('/api/check-config');
      const data = await response.json();
      setConfigStatus(data);
    } catch (error) {
      console.error('Failed to check config:', error);
    }
  };

  const checkAuth = async () => {
    const supabase = createClientForBrowser();
    
    try {
      // Get current session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      
      if (currentUser) {
        setAuthStatus('Authenticated');
        
        // Check if user needs onboarding
        const onboarded = currentUser.user_metadata?.onboarded === true;
        if (onboarded) {
          router.push('/dashboard');
        } else {
          router.push('/onboarding');
        }
      } else {
        setAuthStatus('Not authenticated');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthStatus(`Error: ${error.message}`);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const supabase = createClientForBrowser();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        setAuthStatus(`Error: ${error.message}`);
      } else if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      setAuthStatus(`Exception: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    try {
      const supabase = createClientForBrowser();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        setAuthStatus(`Error: ${error.message}`);
      } else if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      setAuthStatus(`Exception: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClientForBrowser();
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setAuthStatus('Signed out');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Authentication Test & Debug</h1>
        
        {/* Configuration Status */}
        {configStatus && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Configuration Status</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Supabase URL: {configStatus.config.supabase.url}</div>
              <div>Supabase Key: {configStatus.config.supabase.key}</div>
              <div>Site URL: {configStatus.config.site.url}</div>
              <div>Environment: {configStatus.config.environment.nodeEnv}</div>
            </div>
            {configStatus.recommendations.length > 0 && (
              <div className="mt-3">
                <p className="text-blue-700 text-sm font-semibold">Recommendations:</p>
                <ul className="text-blue-600 text-sm list-disc list-inside">
                  {configStatus.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* Authentication Status */}
        <div className="mb-6">
          <p className="text-gray-600 mb-2">Status: <span className="font-semibold">{authStatus}</span></p>
          
          {user && (
            <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
              <p className="text-green-800 text-sm">
                <strong>User ID:</strong> {user.id}<br/>
                <strong>Email:</strong> {user.email}<br/>
                <strong>Email Confirmed:</strong> {user.email_confirmed_at ? 'Yes' : 'No'}<br/>
                <strong>Onboarded:</strong> {user.user_metadata?.onboarded ? 'Yes' : 'No'}
              </p>
            </div>
          )}
          
          {session && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
              <p className="text-blue-800 text-sm">
                <strong>Session Active:</strong> Yes<br/>
                <strong>Access Token:</strong> {session.access_token ? 'Present' : 'Missing'}<br/>
                <strong>Refresh Token:</strong> {session.refresh_token ? 'Present' : 'Missing'}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Test Google Login'}
          </button>
          
          <button
            onClick={handleGithubLogin}
            disabled={loading}
            className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Test GitHub Login'}
          </button>

          {user && (
            <button
              onClick={handleSignOut}
              className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          )}
        </div>

        {/* Debug Links */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <a href="/api/debug-auth" target="_blank" className="text-blue-600 hover:underline text-sm">
            Debug Auth API
          </a>
          <a href="/api/check-config" target="_blank" className="text-blue-600 hover:underline text-sm">
            Check Config API
          </a>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Testing Instructions:</h3>
          <ol className="text-gray-600 text-sm list-decimal list-inside space-y-1">
            <li>Check configuration status above</li>
            <li>Click on Google or GitHub login buttons</li>
            <li>Complete the OAuth flow</li>
            <li>You should be redirected to /dashboard or /onboarding</li>
            <li>Check browser console and network tab for any errors</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
