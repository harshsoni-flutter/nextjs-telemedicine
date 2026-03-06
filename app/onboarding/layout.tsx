import { ensureUserAndProfile } from '@/lib/ensure-user';

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await ensureUserAndProfile();
  return <>{children}</>;
}
