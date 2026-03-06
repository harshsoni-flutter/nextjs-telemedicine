import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { requireAuth } from '@/lib/auth';
import { getProviders } from '@/lib/actions/providers';
import { BookAppointmentForm } from './book-form';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { EmptyState } from '@/components/ui/empty-state';
import { SkeletonCard } from '@/components/ui/skeleton';

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ provider?: string }>;
}) {
  const { user } = await requireAuth();
  const { provider: providerId } = await searchParams;
  const providers = await getProviders();
  const selected = providerId ? providers.find((p) => p.id === providerId) : null;
  if (providerId && !selected) redirect('/dashboard/patient/providers');

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <DashboardNav userEmail={user.email ?? ''} role="patient" />

      <main className="mx-auto w-full max-w-4xl px-6 py-8 sm:px-8 lg:px-12">
        {/* Back Button */}
        <Link
          href="/dashboard/patient"
          className="mb-6 inline-flex items-center gap-2 text-[#0d9488] hover:text-[#0f766e]"
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

        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-semibold text-[#1a1f2e]"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            Book an appointment
          </h1>
          <p className="mt-2 text-lg text-[#5c6370]">
            Select a provider, choose a date and time (15-minute slots), and let them know why you're visiting.
          </p>
        </div>

        {/* Content */}
        {providers.length === 0 ? (
          <EmptyState
            title="No providers available"
            description="There are no providers available to book appointments with right now."
            action={{
              label: "View providers",
              href: "/dashboard/patient/providers",
            }}
          />
        ) : (
          <Suspense fallback={<SkeletonCard count={2} />}>
            <BookAppointmentFormAsync
              providers={providers}
              defaultProviderId={selected?.id ?? null}
            />
          </Suspense>
        )}
      </main>
    </div>
  );
}

async function BookAppointmentFormAsync({
  providers,
  defaultProviderId,
}: {
  providers: any[];
  defaultProviderId: string | null;
}) {
  return (
    <BookAppointmentForm
      providers={providers}
      defaultProviderId={defaultProviderId}
    />
  );
}
