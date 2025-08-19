'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthCodeErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'no_code':
        return 'No authorization code was received from the authentication provider.';
      case 'no_session':
        return 'Failed to establish a user session after authentication.';
      case 'invalid_grant':
        return 'The authorization code has expired or is invalid.';
      default:
        return errorCode || 'An unknown authentication error occurred.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h1>
          <p className="text-gray-600 mb-4">
            {getErrorMessage(error)}
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/login"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition block"
          >
            Try Again
          </Link>
          
          <Link
            href="/test-auth"
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition block"
          >
            Test Authentication
          </Link>
          
          <Link
            href="/"
            className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded hover:bg-gray-200 transition block"
          >
            Back to Home
          </Link>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Error Details:</p>
            <code className="text-xs bg-gray-200 p-2 rounded block break-all">
              {error}
            </code>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            If this problem persists, please check the browser console and network tab for more details.
          </p>
        </div>
      </div>
    </div>
  );
}
