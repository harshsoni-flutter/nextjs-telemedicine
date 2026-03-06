import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{
    appointmentId?: string;
  }>;
}) {
  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* Header */}
      <div className="border-b border-[#e8e6e1] bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-6 sm:px-8 lg:px-12">
          <h1
            className="text-lg font-semibold text-[#1a1f2e]"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            Telemedicine
          </h1>
        </div>
      </div>

      <main className="mx-auto w-full max-w-md px-6 py-12 sm:px-8">
        {/* Success Card */}
        <Card className="border-[#e8e6e1] bg-white text-center space-y-6">
          <CardContent className="pt-6">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                <svg
                  className="h-10 w-10 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Message */}
            <h2 className="text-2xl font-bold text-[#1a1f2e]">
              Appointment booked!
            </h2>
            <p className="text-[#5c6370] mt-2">
              Your appointment has been confirmed. We've sent a confirmation email to your inbox.
            </p>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="border-[#e8e6e1] bg-white mt-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#1a1f2e]">What's next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 text-left">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ccfbf1] text-[#0d9488] font-semibold text-sm">
                1
              </div>
              <div>
                <p className="font-medium text-[#1a1f2e]">Check your email</p>
                <p className="text-sm text-[#5c6370]">
                  We sent confirmation details and a link to join the video call
                </p>
              </div>
            </div>

            <div className="flex gap-3 text-left">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ccfbf1] text-[#0d9488] font-semibold text-sm">
                2
              </div>
              <div>
                <p className="font-medium text-[#1a1f2e]">Join before your time</p>
                <p className="text-sm text-[#5c6370]">
                  Log in 5 minutes early to test your camera and microphone
                </p>
              </div>
            </div>

            <div className="flex gap-3 text-left">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ccfbf1] text-[#0d9488] font-semibold text-sm">
                3
              </div>
              <div>
                <p className="font-medium text-[#1a1f2e]">Start the video visit</p>
                <p className="text-sm text-[#5c6370]">
                  The provider will join at the scheduled time
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="border-[#e8e6e1] bg-[#ccfbf1] mt-6">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-[#0d9488] mb-2">💡 Pro tip:</p>
            <p className="text-sm text-[#0d9488]">
              Have your insurance card and ID ready, and find a quiet, private space for your visit.
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-8">
          <Link href="/dashboard/patient" className="w-full">
            <Button className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white">
              Back to dashboard
            </Button>
          </Link>
          <Link href="/dashboard/patient/providers" className="w-full">
            <Button
              variant="outline"
              className="w-full border-[#e8e6e1] hover:bg-[#fafaf8]"
            >
              Book another appointment
            </Button>
          </Link>
        </div>

        {/* Help */}
        <p className="text-center text-xs text-[#5c6370] mt-6">
          Need help?{' '}
          <a
            href="mailto:support@telemedicine.com"
            className="text-[#0d9488] hover:text-[#0f766e] font-medium"
          >
            Contact support
          </a>
        </p>
      </main>
    </div>
  );
}
