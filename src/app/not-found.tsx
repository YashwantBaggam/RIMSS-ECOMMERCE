import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
      <h1 className="text-6xl font-black text-gray-200">404</h1>
      <h2 className="text-xl font-bold text-gray-800">Page Not Found</h2>
      <p className="text-gray-500 text-sm">The page you're looking for doesn't exist.</p>
      <Link href="/" className="mt-4 bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
        Back to Home
      </Link>
    </div>
  );
}
