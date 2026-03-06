"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
    title: "Healthcare from anywhere",
    subtitle: "Connect with doctors via video. No commute, no waiting room.",
    cta: "Book a visit",
    href: "/signup/patient",
  },
  {
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&q=80",
    title: "Trusted by thousands",
    subtitle: "Licensed providers ready to help you feel better, on your schedule.",
    cta: "Get started",
    href: "/signup/patient",
  },
  {
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80",
    title: "Simple, secure, private",
    subtitle: "Your health data is encrypted and protected. Care you can trust.",
    cta: "Join as patient",
    href: "/signup/patient",
  },
  {
    image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&q=80",
    title: "Fast access to care",
    subtitle: "Same-day appointments with board-certified doctors. Start feeling better today.",
    cta: "Find a doctor",
    href: "/signup/patient",
  },
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-[#1a1f2e]">
      <div className="relative aspect-[21/9] min-h-[320px] sm:min-h-[400px] lg:min-h-[480px]">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1f2e]/90 via-[#1a1f2e]/60 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-8 py-12 sm:px-14 sm:py-16 lg:px-20 xl:px-28 2xl:px-36">
              <h2
                className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl"
                style={{ fontFamily: "var(--font-fraunces), serif" }}
              >
                {slide.title}
              </h2>
              <p className="mt-3 text-lg text-white/90 sm:text-xl">
                {slide.subtitle}
              </p>
              <Link
                href={slide.href}
                className="mt-6 inline-flex w-fit items-center rounded-full bg-[#0d9488] px-6 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-[#0f766e]"
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        ))}
        {/* Dots */}
        <div className="absolute bottom-4 right-4 z-20 flex gap-2 sm:bottom-6 sm:right-8">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
