import Image from "next/image";
import Link from "next/link";
import { HeroSlider } from "@/components/landing/hero-slider";
import { FaqAccordion } from "@/components/landing/faq-accordion";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fafaf8]">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-[#ccfbf1]/40 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-[#99f6e4]/30 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a1f2e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative w-full">
        {/* Nav - full width with padding */}
        <nav className="flex items-center justify-between px-6 py-6 sm:px-8 sm:py-8 lg:px-12 xl:px-16 2xl:px-24">
          <span
            className="text-xl font-semibold tracking-tight text-[#1a1f2e]"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            Telemedicine
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-medium text-[#5c6370] transition-colors hover:bg-white/80 hover:text-[#1a1f2e]"
            >
              Sign in
            </Link>
            <Link
              href="/signup/patient"
              className="rounded-full bg-[#0d9488] px-4 py-2 text-sm font-medium text-white shadow-lg shadow-[#0d9488]/25 transition hover:bg-[#0f766e] hover:shadow-[#0d9488]/30"
            >
              Get started
            </Link>
          </div>
        </nav>

        {/* Hero banner slider - edge to edge */}
        <div className="mt-4 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] sm:mt-6">
          <HeroSlider />
        </div>

        {/* Hero headline + CTA */}
        <header className="mx-auto mt-16 max-w-4xl px-6 text-center sm:mt-20 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-[#0d9488]">
            Healthcare, when you need it
          </p>
          <h1
            className="mb-6 text-4xl font-semibold leading-[1.15] tracking-tight text-[#1a1f2e] sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            See a doctor from home.
            <br />
            <span className="text-[#0d9488]">Simple and secure.</span>
          </h1>
          <p className="mx-auto mb-12 max-w-xl text-lg leading-relaxed text-[#5c6370]">
            Book video appointments with licensed providers in minutes. No waiting rooms, no commute—just quality care on your schedule.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup/patient"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#1a1f2e] px-8 py-4 text-base font-medium text-white shadow-xl shadow-[#1a1f2e]/20 transition hover:bg-[#252b3d] sm:w-auto"
            >
              Sign up as Patient
            </Link>
            <Link
              href="/signup/provider"
              className="inline-flex w-full items-center justify-center rounded-full border-2 border-[#e8e6e1] bg-white px-8 py-4 text-base font-medium text-[#1a1f2e] transition hover:border-[#0d9488]/40 hover:bg-[#fafaf8] sm:w-auto"
            >
              Join as Provider
            </Link>
          </div>
        </header>

        {/* How it works */}
        <section className="mx-auto mt-24 w-full px-6 sm:mt-32 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <h2
            className="text-center text-3xl font-semibold text-[#1a1f2e] sm:text-4xl"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            How it works
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[#5c6370]">
            Three simple steps to get the care you need.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-3 sm:gap-10">
            {[
              { step: "1", title: "Create an account", desc: "Sign up as a patient in under a minute. No paperwork.", icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" },
              { step: "2", title: "Choose your provider", desc: "Browse doctors by specialty and pick a time that works for you.", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
              { step: "3", title: "Join your video visit", desc: "Connect from your phone or computer. Get care without leaving home.", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
            ].map((item) => (
              <div key={item.step} className="relative rounded-2xl border border-[#e8e6e1] bg-white p-6 sm:p-8">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0d9488] text-lg font-bold text-white">
                  {item.step}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-[#1a1f2e]">{item.title}</h3>
                <p className="mt-2 text-[#5c6370]">{item.desc}</p>
                <div className="absolute right-6 top-6 text-[#ccfbf1]">
                  <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Medical Specialties */}
        <section className="mx-auto mt-24 w-full max-w-7xl px-6 sm:mt-32 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <h2
            className="text-center text-3xl font-semibold text-[#1a1f2e] sm:text-4xl"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            Browse by specialty
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[#5c6370]">
            Find the right specialist for your health needs.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "General Medicine", icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" },
              { name: "Mental Health", icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              { name: "Dermatology", icon: "M12 6v6m0 0v6m0-6h6m-6 0H6" },
              { name: "Cardiology", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
              { name: "Pediatrics", icon: "M12 4.354a4 4 0 110 5.292M15 12H9m4 8.004H9m7-13h.01M9 15h.01" },
              { name: "Orthopedics", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" },
              { name: "Nutrition", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
              { name: "Women's Health", icon: "M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" },
            ].map((specialty) => (
              <div
                key={specialty.name}
                className="group rounded-2xl border border-[#e8e6e1] bg-white p-6 text-center transition hover:border-[#0d9488] hover:shadow-lg sm:p-8"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#ccfbf1] text-[#0d9488] transition group-hover:bg-[#0d9488] group-hover:text-white">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={specialty.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#1a1f2e]">{specialty.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Stats - full width bar */}
        <section className="mx-auto mt-24 w-full px-6 sm:mt-32 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <div className="mx-auto max-w-5xl rounded-2xl border border-[#e8e6e1] bg-white/90 px-6 py-12 backdrop-blur sm:px-12 sm:py-14">
            <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4 sm:gap-12">
              {[
                { value: "50K+", label: "Patients helped" },
                { value: "200+", label: "Licensed providers" },
                { value: "98%", label: "Satisfaction rate" },
                { value: "24/7", label: "Booking available" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold text-[#0d9488] sm:text-4xl" style={{ fontFamily: "var(--font-fraunces), serif" }}>
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#5c6370]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust & Certifications */}
        <section className="mx-auto mt-24 w-full px-6 sm:mt-32 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <div className="mx-auto max-w-6xl rounded-2xl border border-[#e8e6e1] bg-white/80 px-8 py-12 backdrop-blur sm:px-12 sm:py-14">
            <h2
              className="text-center text-2xl font-semibold text-[#1a1f2e] sm:text-3xl"
              style={{ fontFamily: "var(--font-fraunces), serif" }}
            >
              Healthcare you can trust
            </h2>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
              {[
                { label: "HIPAA Compliant", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
                { label: "Board-Certified Doctors", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
                { label: "256-bit Encryption", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
                { label: "Verified Credentials", icon: "M5 13l4 4L19 7" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-3 rounded-full border border-[#ccfbf1] bg-[#ccfbf1]/30 px-4 py-2 sm:px-5 sm:py-3"
                >
                  <svg className="h-5 w-5 text-[#0d9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={badge.icon} />
                  </svg>
                  <span className="text-sm font-medium text-[#1a1f2e]">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature with image */}
        <section className="mx-auto mt-24 grid w-full max-w-7xl gap-12 px-6 sm:mt-32 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-12 xl:px-16 2xl:mx-auto 2xl:px-24">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#e8e6e1] bg-[#e8e6e1] shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80"
              alt="Doctor and patient on video call"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2
              className="text-3xl font-semibold text-[#1a1f2e] sm:text-4xl"
              style={{ fontFamily: "var(--font-fraunces), serif" }}
            >
              Care that fits your life
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-[#5c6370]">
              Whether you need a quick check-in or a follow-up, our platform makes it easy to connect with the right provider. Schedule at a time that works for you—even same-day appointments when available.
            </p>
            <ul className="mt-6 space-y-3">
              {["Same-day and next-day appointments", "Evening and weekend slots", "Cancel or reschedule anytime", "Prescriptions sent to your pharmacy"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[#1a1f2e]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ccfbf1] text-[#0d9488]">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/signup/patient"
              className="mt-8 inline-flex rounded-full bg-[#0d9488] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#0f766e]"
            >
              Book your first visit
            </Link>
          </div>
        </section>

        {/* Value props */}
        <section className="mx-auto mt-24 w-full max-w-7xl px-6 sm:mt-32 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <h2
            className="text-center text-3xl font-semibold text-[#1a1f2e] sm:text-4xl"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            Why choose us
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[#5c6370]">
            Built for convenience, trust, and your peace of mind.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Book in minutes", desc: "Choose a provider and time slot. No phone calls, no hold music.", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
              { title: "Licensed providers", desc: "Connect with verified doctors and specialists you can trust.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              { title: "Secure & private", desc: "Your visits and data are encrypted and HIPAA-aligned.", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
              { title: "Affordable options", desc: "Transparent pricing and flexible payment options for everyone.", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-[#e8e6e1] bg-white/80 p-6 backdrop-blur sm:p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#ccfbf1] text-[#0d9488]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[#1a1f2e]">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[#5c6370]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mx-auto mt-24 w-full max-w-7xl px-6 sm:mt-32 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <h2
            className="text-center text-3xl font-semibold text-[#1a1f2e] sm:text-4xl"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            What people are saying
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[#5c6370]">
            Real stories from patients and providers.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { quote: "Finally, healthcare that works around my schedule. I had a video visit on my lunch break—no driving, no waiting.", name: "Sarah M.", role: "Patient" },
              { quote: "As a provider, the platform is smooth and my patients love the convenience. Booking and reminders are handled for me.", name: "Dr. James K.", role: "Provider" },
              { quote: "I was skeptical about online visits, but the doctor was thorough and kind. Got my prescription the same day.", name: "Michael T.", role: "Patient" },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl border border-[#e8e6e1] bg-white p-6 sm:p-8">
                <p className="text-[#1a1f2e]">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#ccfbf1] flex items-center justify-center text-[#0d9488] font-semibold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-[#1a1f2e]">{t.name}</p>
                    <p className="text-sm text-[#5c6370]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto mt-24 w-full max-w-4xl px-6 sm:mt-32 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <h2
            className="text-center text-3xl font-semibold text-[#1a1f2e] sm:text-4xl"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            Common questions
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[#5c6370]">
            Everything you need to know about telemedicine.
          </p>
          <div className="mt-10">
            <FaqAccordion />
          </div>
        </section>

        {/* Final CTA banner - full width */}
        <section className="mt-24 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] sm:mt-32">
          <div className="relative overflow-hidden bg-[#1a1f2e] px-8 py-16 sm:px-14 sm:py-20 lg:px-20 xl:px-24">
            <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0d9488]/20 blur-3xl" />
            <div className="relative mx-auto max-w-2xl text-center">
              <h2
                className="text-3xl font-semibold text-white sm:text-4xl"
                style={{ fontFamily: "var(--font-fraunces), serif" }}
              >
                Ready to get started?
              </h2>
              <p className="mt-4 text-lg text-white/80">
                Join thousands of patients and providers who trust us for their care.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/signup/patient"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#0d9488] px-8 py-4 text-base font-medium text-white transition hover:bg-[#0f766e] sm:w-auto"
                >
                  Sign up as Patient
                </Link>
                <Link
                  href="/signup/provider"
                  className="inline-flex w-full items-center justify-center rounded-full border-2 border-white/40 bg-white/10 px-8 py-4 text-base font-medium text-white backdrop-blur transition hover:bg-white/20 sm:w-auto"
                >
                  Join as Provider
                </Link>
              </div>
              <p className="mt-6 text-sm text-white/60">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-[#0d9488] hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* Footer - full width */}
        <footer className="mt-20 w-full border-t border-[#e8e6e1] px-6 py-12 sm:mt-24 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <span
                className="text-lg font-semibold text-[#1a1f2e]"
                style={{ fontFamily: "var(--font-fraunces), serif" }}
              >
                Telemedicine
              </span>
              <div className="flex gap-8 text-sm text-[#5c6370]">
                <Link href="/login" className="hover:text-[#0d9488]">Sign in</Link>
                <Link href="/signup/patient" className="hover:text-[#0d9488]">Patients</Link>
                <Link href="/signup/provider" className="hover:text-[#0d9488]">Providers</Link>
              </div>
            </div>
            <p className="mt-6 text-center text-xs text-[#5c6370] sm:text-left">
              © {new Date().getFullYear()} Telemedicine. Healthcare when you need it.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
