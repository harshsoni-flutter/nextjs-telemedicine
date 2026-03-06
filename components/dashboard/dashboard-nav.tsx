import Link from "next/link";
import { Button } from "@/components/ui/button";

interface DashboardNavProps {
  userEmail: string;
  role?: string;
}

export function DashboardNav({ userEmail, role }: DashboardNavProps) {
  return (
    <header className="border-b border-[#e8e6e1] bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <Link
          href="/dashboard/patient"
          className="text-lg font-semibold text-[#1a1f2e]"
          style={{ fontFamily: "var(--font-fraunces), serif" }}
        >
          Telemedicine
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-[#1a1f2e]">{userEmail}</p>
            {role && (
              <p className="text-xs text-[#5c6370] capitalize">{role}</p>
            )}
          </div>
          <form action="/auth/signout" method="post">
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="text-[#5c6370] hover:text-[#0d9488]"
            >
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
