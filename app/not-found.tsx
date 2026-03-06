import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Logo */}
        <h1
          className="text-3xl font-semibold text-[#1a1f2e]"
          style={{ fontFamily: "var(--font-fraunces), serif" }}
        >
          Telemedicine
        </h1>

        {/* 404 Icon */}
        <div className="flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#ccfbf1] text-[#0d9488]">
            <svg
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h2 className="text-5xl font-bold text-[#1a1f2e]">404</h2>
          <p className="text-2xl font-semibold text-[#1a1f2e]">Page not found</p>
          <p className="text-[#5c6370]">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3">
          <Link href="/">
            <Button className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white">
              Go to home
            </Button>
          </Link>
          <Link href="/dashboard/patient">
            <Button variant="outline" className="w-full border-[#e8e6e1] hover:bg-[#fafaf8]">
              Go to dashboard
            </Button>
          </Link>
        </div>

        {/* Support */}
        <p className="text-sm text-[#5c6370]">
          Need help?{' '}
          <a href="mailto:support@telemedicine.com" className="text-[#0d9488] hover:text-[#0f766e] font-medium">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
