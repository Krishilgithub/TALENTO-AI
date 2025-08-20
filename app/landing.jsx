'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import createClientForBrowser from '@/utils/supabase/client';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const supabase = createClientForBrowser();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // User is authenticated, check if they need onboarding
          const onboarded = user.user_metadata?.onboarded === true;
          if (onboarded) {
            router.push('/homepage');
          } else {
            router.push('/onboarding');
          }
        } else {
          // User is not authenticated, redirect to landing page
          router.push('/landing');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/landing');
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  // Show loading while checking authentication
  return (
    <div className="min-h-screen bg-[#101113] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading...</p>
      </div>
    </div>
  );
}
