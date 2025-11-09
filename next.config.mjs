/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'lh3.googleusercontent.com',
            'avatars.githubusercontent.com',
            'platform-lookaside.fbsbx.com',
            'scontent.xx.fbcdn.net',
            'tdmmrdkvdvrunukavgok.supabase.co'
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'platform-lookaside.fbsbx.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'scontent.xx.fbcdn.net',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'tdmmrdkvdvrunukavgok.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/**',
            }
        ]
    }
};

export default nextConfig;
