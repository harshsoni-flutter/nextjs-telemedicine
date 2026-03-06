import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import {
  getProviderAvailability,
  getProviderSettings,
  getProviderBlockedTime,
} from '@/lib/actions/availability';
import { AvailabilityManager } from '@/components/provider/availability-manager';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';

export default async function AvailabilityPage() {
  const { user } = await requireAuth('provider');
  const [slots, settings, blockedTime] = await Promise.all([
    getProviderAvailability(user.id),
    getProviderSettings(user.id),
    getProviderBlockedTime(user.id),
  ]);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <DashboardNav userEmail={user.email} role="provider" />

      <main className="mx-auto w-full max-w-4xl px-6 py-8 sm:px-8 lg:px-12">
        {/* Back Button */}
        <Link
          href="/dashboard/provider"
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
            Manage Availability
          </h1>
          <p className="mt-2 text-lg text-[#5c6370]">
            Set your schedule, booking preferences, and vacation periods
          </p>
        </div>

        {/* Availability Manager */}
        <AvailabilityManager
          providerId={user.id}
          initialSlots={slots}
          initialSettings={settings}
          initialBlockedTime={blockedTime}
        />
      </main>
    </div>
  );
}
