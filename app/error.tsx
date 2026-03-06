'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Application error:', error);
  }, [error]);

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

        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100 text-red-600">
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
                d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h2 className="text-4xl font-bold text-[#1a1f2e]">Oops!</h2>
          <p className="text-xl font-semibold text-[#1a1f2e]">Something went wrong</p>
          <p className="text-[#5c6370]">
            We encountered an unexpected error. Our team has been notified and is working to fix it.
          </p>
        </div>

        {/* Error Details (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-left">
            <p className="text-xs font-mono text-red-700 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={reset}
            className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white"
          >
            Try again
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full border-[#e8e6e1] hover:bg-[#fafaf8]">
              Go to home
            </Button>
          </Link>
        </div>

        {/* Support */}
        <p className="text-sm text-[#5c6370]">
          If the problem persists,{' '}
          <a
            href="mailto:support@telemedicine.com"
            className="text-[#0d9488] hover:text-[#0f766e] font-medium"
          >
            contact support
          </a>
        </p>
      </div>
    </div>
  );
}
