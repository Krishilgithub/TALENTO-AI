import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/admin/settings',
  '/protected',
  '/profile',
  '/assessment',
  '/practice',
  '/career',
  '/onboarding',
  // Add more protected routes as needed
];

// Routes that should be skipped by middleware to avoid redirect loops
const skipMiddlewareRoutes = [
  '/auth/',
  '/login',
  '/signup',
  '/verify-otp',
  '/reset/',
  '/forgot-password',
  '/warning',
  '/_next/',
  '/api/',
];

/**
 * @param {import('next/server').NextRequest} request
 * */
export const middleware = async request => {
    const pathname = request.nextUrl.pathname
    
    // Skip middleware for auth-related routes and API routes
    if (skipMiddlewareRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value),
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options),
                    )
                },
            },
        },
    )

    const isProtectedRoute = protectedRoutes.includes(pathname)

    // Get user session
    const { data: { user }, error } = await supabase.auth.getUser()

    if (isProtectedRoute) {
        if (error || !user) {
            // User is not authenticated, redirect to warning page
            return NextResponse.redirect(new URL('/warning', request.url))
        }
        
        // Check if user needs onboarding
        if (!user.user_metadata?.onboarded && pathname !== '/onboarding') {
            return NextResponse.redirect(new URL('/onboarding', request.url))
        }
    }

    // If user is authenticated and trying to access public routes like homepage,
    // redirect them to dashboard if they're already onboarded
    if (user && user.user_metadata?.onboarded && pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return supabaseResponse
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
