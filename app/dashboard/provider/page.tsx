import Link from 'next/link';
import { Suspense } from 'react';
import { requireAuth } from '@/lib/auth';
import {
  getProviderAppointments,
  getUpcomingProviderAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} from '@/lib/actions/appointments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProviderAgenda } from './provider-agenda';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { StatsCard } from '@/components/dashboard/stats-card';
import { SkeletonAppointmentList } from '@/components/ui/skeleton';

export default async function ProviderDashboardPage() {
  const { user } = await requireAuth();
  const [allAppointments, todayAppointments] = await Promise.all([
    getProviderAppointments(),
    getUpcomingProviderAppointments(),
  ]);
  const completedToday = allAppointments.filter(
    (a) =>
      a.status === 'completed' &&
      new Date(a.scheduled_time).toDateString() === new Date().toDateString()
  );
  const upcoming = allAppointments.filter(
    (a) =>
      ['pending', 'confirmed'].includes(a.status) &&
      new Date(a.scheduled_time) >= new Date()
  );

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <DashboardNav userEmail={user.email} role="provider" />

      <main className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        {/* Welcome Banner */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#0d9488] to-[#1a1f2e] px-8 py-12 text-white sm:px-12 sm:py-14">
          <h2
            className="text-3xl font-semibold sm:text-4xl"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            Provider dashboard
          </h2>
          <p className="mt-2 text-lg text-white/80">
            Today is {today}. Manage your schedule and patient queue.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/provider/availability">
            <Button className="w-full bg-white text-[#0d9488] hover:bg-[#fafaf8]">
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Manage Availability
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mb-10 grid gap-6 sm:grid-cols-2">
          <StatsCard
            label="Appointments today"
            value={todayAppointments.length}
          />
          <StatsCard
            label="Completed today"
            value={completedToday.length}
            variant="accent"
          />
        </div>

        {/* Today's Agenda */}
        <section className="mb-10">
          <h3 className="mb-4 text-xl font-semibold text-[#1a1f2e]">
            Today's agenda
          </h3>
          <Card>
            <CardHeader>
              <CardDescription>Upcoming appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<SkeletonAppointmentList />}>
                <ProviderAgendaAsync
                  appointments={todayAppointments}
                  onComplete={updateAppointmentStatus}
                  onCancel={cancelAppointment}
                />
              </Suspense>
            </CardContent>
          </Card>
        </section>

        {/* Patient Queue */}
        <section>
          <h3 className="mb-4 text-xl font-semibold text-[#1a1f2e]">
            Upcoming patient queue
          </h3>
          <Card>
            <CardContent className="pt-6">
              <Suspense fallback={<SkeletonAppointmentList />}>
                <PatientQueueAsync appointments={upcoming} />
              </Suspense>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

async function ProviderAgendaAsync({
  appointments,
  onComplete,
  onCancel,
}: {
  appointments: any[];
  onComplete: any;
  onCancel: any;
}) {
  return (
    <>
      <ProviderAgenda
        appointments={appointments}
        onComplete={onComplete}
        onCancel={onCancel}
      />
      {appointments.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-[#e8e6e1] p-8 text-center">
          <p className="text-[#5c6370]">No appointments scheduled for today</p>
        </div>
      )}
    </>
  );
}

async function PatientQueueAsync({ appointments }: { appointments: any[] }) {
  return (
    <>
      {appointments.length > 0 ? (
        <ul className="space-y-3">
          {appointments.slice(0, 20).map((a) => {
            const statusColors: Record<string, string> = {
              pending: "bg-amber-100 text-amber-800",
              confirmed: "bg-[#ccfbf1] text-[#0d9488]",
              completed: "bg-emerald-100 text-emerald-800",
              cancelled: "bg-red-100 text-red-800",
            };
            const statusColor = statusColors[a.status] || "bg-slate-100 text-slate-800";

            return (
              <li
                key={a.id}
                className="rounded-xl border border-[#e8e6e1] bg-white p-4 transition hover:border-[#0d9488] hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-[#1a1f2e]">
                      {a.patient
                        ? [a.patient.first_name, a.patient.last_name]
                            .filter(Boolean)
                            .join(' ')
                        : 'Patient'}
                    </p>
                    <p className="mt-1 text-sm text-[#5c6370]">
                      {new Date(a.scheduled_time).toLocaleString()} — {a.reason_for_visit ?? 'General consultation'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColor}`}
                    >
                      {a.status}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-[#e8e6e1] p-8 text-center">
          <p className="text-[#5c6370]">No upcoming appointments</p>
        </div>
      )}
    </>
  );
}
