import Link from 'next/link';
import { Suspense } from 'react';
import { requireAuth } from '@/lib/auth';
import { getPatientAppointments, cancelAppointment, rescheduleAppointment } from '@/lib/actions/appointments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PatientAppointmentList } from './patient-appointment-list';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { StatsCard } from '@/components/dashboard/stats-card';
import { SkeletonAppointmentList } from '@/components/ui/skeleton';

export default async function PatientDashboardPage() {
  const { user, profile } = await requireAuth();
  const appointments = await getPatientAppointments();
  const upcoming = appointments.filter(
    (a) =>
      ['pending', 'confirmed'].includes(a.status) &&
      new Date(a.scheduled_time) >= new Date()
  );
  const past = appointments.filter(
    (a) =>
      a.status === 'completed' &&
      new Date(a.scheduled_time) < new Date()
  );
  const providers = new Set(appointments.map(a => a.provider_id)).size;
  const displayName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Patient';

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <DashboardNav userEmail={user.email} role="patient" />

      <main className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        {/* Welcome Banner */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#0d9488] to-[#1a1f2e] px-8 py-12 text-white sm:px-12 sm:py-14">
          <h2
            className="text-3xl font-semibold sm:text-4xl"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            Welcome back, {displayName}
          </h2>
          <p className="mt-2 text-lg text-white/80">
            Manage your health appointments and track your wellness journey
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-10 grid gap-6 sm:grid-cols-3">
          <StatsCard label="Upcoming visits" value={upcoming.length} />
          <StatsCard label="Past visits" value={past.length} />
          <StatsCard label="Providers seen" value={providers} />
        </div>

        {/* Profile Summary */}
        <section className="mb-10">
          <h3 className="mb-4 text-xl font-semibold text-[#1a1f2e]">Profile summary</h3>
          <Card>
            <CardHeader>
              <CardDescription>Your basic information</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#5c6370]">Email</p>
                <p className="mt-1 font-medium text-[#1a1f2e]">{user?.email ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#5c6370]">Name</p>
                <p className="mt-1 font-medium text-[#1a1f2e]">
                  {[profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || '—'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#5c6370]">First name</p>
                <p className="mt-1 font-medium text-[#1a1f2e]">{profile?.first_name ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#5c6370]">Last name</p>
                <p className="mt-1 font-medium text-[#1a1f2e]">{profile?.last_name ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#5c6370]">Phone</p>
                <p className="mt-1 font-medium text-[#1a1f2e]">{profile?.phone ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#5c6370]">Date of birth</p>
                <p className="mt-1 font-medium text-[#1a1f2e]">
                  {profile?.date_of_birth
                    ? new Date(profile.date_of_birth).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#5c6370]">Gender</p>
                <p className="mt-1 font-medium text-[#1a1f2e]">
                  {profile?.gender
                    ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1).toLowerCase()
                    : '—'}
                </p>
              </div>
              {profile?.created_at && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#5c6370]">Member since</p>
                  <p className="mt-1 font-medium text-[#1a1f2e]">
                    {new Date(profile.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Appointments Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-[#1a1f2e]">Upcoming appointments</h3>
            <Link href="/dashboard/patient/providers">
              <Button className="bg-[#0d9488] hover:bg-[#0f766e]">Find a doctor</Button>
            </Link>
          </div>
          <Card>
            <CardContent className="pt-6">
              <Suspense fallback={<SkeletonAppointmentList />}>
                <PatientAppointmentListAsync
                  appointments={upcoming}
                  onCancel={cancelAppointment}
                  onReschedule={rescheduleAppointment}
                />
              </Suspense>
            </CardContent>
          </Card>
        </section>

        {/* Health Tips */}
        <section className="mt-10">
          <h3 className="mb-4 text-xl font-semibold text-[#1a1f2e]">Health tips</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              { title: "Stay hydrated", desc: "Drink at least 8 glasses of water daily for optimal health." },
              { title: "Get enough sleep", desc: "Aim for 7-9 hours of quality sleep each night." },
              { title: "Move regularly", desc: "Take breaks to stretch and move around throughout the day." },
              { title: "Eat nutritious food", desc: "Include vegetables, fruits, and whole grains in your diet." },
            ].map((tip) => (
              <div key={tip.title} className="rounded-2xl border border-[#e8e6e1] bg-white p-6">
                <h4 className="font-semibold text-[#1a1f2e]">{tip.title}</h4>
                <p className="mt-2 text-[#5c6370]">{tip.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

async function PatientAppointmentListAsync({
  appointments,
  onCancel,
  onReschedule,
}: {
  appointments: any[];
  onCancel: any;
  onReschedule: any;
}) {
  return (
    <>
      <PatientAppointmentList
        appointments={appointments}
        onCancel={onCancel}
        onReschedule={onReschedule}
      />
      {appointments.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-[#e8e6e1] p-8 text-center">
          <p className="mb-4 text-[#5c6370]">
            You have no upcoming appointments
          </p>
          <Link href="/dashboard/patient/providers">
            <Button className="bg-[#0d9488] hover:bg-[#0f766e]">
              Book your first visit
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}
