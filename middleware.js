import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/protected',
  '/profile',
  '/assessment',
  '/practice',
  '/career',
  '/onboarding',
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

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    // Get user session
    const { data: { user }, error } = await supabase.auth.getUser()

    if (isProtectedRoute) {
        if (error || !user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        
        // Check if user needs onboarding
        if (!user.user_metadata?.onboarded && pathname !== '/onboarding') {
            return NextResponse.redirect(new URL('/onboarding', request.url))
        }
    }

    // If user is authenticated and tries to visit public auth routes, redirect away
    const publicAuthRoutes = ['/', '/login', '/signup', '/forgot-password', '/reset']
    if (user && publicAuthRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
        const target = user.user_metadata?.onboarded ? '/dashboard' : '/onboarding'
        return NextResponse.redirect(new URL(target, request.url))
    }

    return supabaseResponse
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
