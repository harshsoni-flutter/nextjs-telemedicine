"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What conditions can be treated via telemedicine?",
    answer: "Many common conditions can be treated online, including cold/flu symptoms, allergies, skin conditions, minor infections, medication refills, and mental health concerns. For emergencies or conditions requiring physical exams, we'll guide you to appropriate care.",
  },
  {
    question: "Is my health information secure?",
    answer: "Yes. We use 256-bit encryption and comply with HIPAA regulations to protect your personal health information. All video visits are encrypted end-to-end, and your data is stored securely.",
  },
  {
    question: "Does telemedicine accept insurance?",
    answer: "Most major insurance plans are accepted. We handle billing directly with your insurance, and you'll see the cost upfront before booking. We also offer affordable self-pay options.",
  },
  {
    question: "How long is a typical video visit?",
    answer: "Most visits last 15-30 minutes depending on the complexity of your condition. You'll have a chance to discuss with the provider before booking to understand the expected duration.",
  },
  {
    question: "Can I get prescriptions through telemedicine?",
    answer: "Yes, if clinically appropriate. Your provider can send prescriptions directly to your pharmacy of choice, and you can pick them up the same day or have them delivered.",
  },
];

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <button
          key={index}
          onClick={() => setOpen(open === index ? null : index)}
          className="w-full text-left"
        >
          <div className="rounded-2xl border border-[#e8e6e1] bg-white p-6 transition hover:border-[#0d9488]">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[#1a1f2e]">{faq.question}</h3>
              <svg
                className={`h-5 w-5 text-[#0d9488] transition-transform ${
                  open === index ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
            {open === index && (
              <p className="mt-4 text-[#5c6370]">{faq.answer}</p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
