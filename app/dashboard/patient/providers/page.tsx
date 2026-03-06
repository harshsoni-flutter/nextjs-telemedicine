import Link from 'next/link';
import { Suspense } from 'react';
import { requireAuth } from '@/lib/auth';
import { getProviders } from '@/lib/actions/providers';
import { Button } from '@/components/ui/button';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { ProvidersGrid } from '../providers-grid';
import { SkeletonCard } from '@/components/ui/skeleton';

export default async function ProvidersPage() {
  const { user } = await requireAuth();
  const providers = await getProviders();

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <DashboardNav userEmail={user.email ?? ''} role="patient" />

      <main className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/patient"
            className="mb-4 inline-flex items-center gap-2 text-[#0d9488] hover:text-[#0f766e]"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to dashboard
          </Link>
          <h1
            className="text-3xl font-semibold text-[#1a1f2e] sm:text-4xl"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            Find a doctor
          </h1>
          <p className="mt-2 text-lg text-[#5c6370]">
            Browse and book appointments with our licensed providers
          </p>
        </div>

        {/* Providers Grid with Search/Filter */}
        <Suspense fallback={<SkeletonCard count={6} />}>
          <ProvidersGridAsync providers={providers} />
        </Suspense>
      </main>
    </div>
  );
}

async function ProvidersGridAsync({ providers }: { providers: any[] }) {
  return providers.length > 0 ? (
    <ProvidersGrid providers={providers} />
  ) : (
    <div className="rounded-2xl border-2 border-dashed border-[#e8e6e1] p-12 text-center">
      <p className="text-lg text-[#5c6370]">No providers available at the moment.</p>
      <Link href="/dashboard/patient">
        <Button className="mt-4 bg-[#0d9488] hover:bg-[#0f766e]">
          Return to dashboard
        </Button>
      </Link>
    </div>
  );
}
