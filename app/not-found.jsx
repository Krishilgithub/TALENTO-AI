import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101113] via-[#18191b] to-[#23272f] text-white px-4">
      <div className="flex flex-col items-center">
        <div className="bg-cyan-400/10 rounded-full p-6 mb-6 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-cyan-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9zm-9 4h.01" />
          </svg>
        </div>
        <h1 className="text-7xl font-extrabold mb-2 tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text drop-shadow-lg">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="mb-8 text-gray-400 text-center max-w-md">Sorry, the page you are looking for does not exist or has been moved. Please check the URL or return to the homepage.</p>
        <Link href="/" className="bg-cyan-400 text-black px-8 py-3 rounded-full font-bold shadow-lg hover:bg-cyan-300 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
} 