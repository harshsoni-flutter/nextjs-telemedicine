'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { completePatientOnboarding } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

const step1Schema = z.object({
  first_name: z.string().min(1, 'Required'),
  last_name: z.string().min(1, 'Required'),
});
const step2Schema = z.object({
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  phone: z.string().optional(),
});

type Step1 = z.infer<typeof step1Schema>;
type Step2 = z.infer<typeof step2Schema>;
type FormData = Step1 & Step2;

const steps = [
  { title: 'Name', fields: ['first_name', 'last_name'] },
  { title: 'Details', fields: ['date_of_birth', 'gender', 'phone'] },
];

export default function OnboardingPatientPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(step === 0 ? step1Schema : step2Schema),
    mode: 'onBlur',
  });

  async function onNext() {
    const fields = steps[step].fields as (keyof FormData)[];
    const ok = await trigger(fields);
    if (ok) setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  const isLastStep = step === steps.length - 1;

  async function onSubmit() {
    const allValues = getValues();
    const formData = new FormData();
    (['first_name', 'last_name', 'phone', 'date_of_birth', 'gender'] as const).forEach((key) => {
      const v = allValues[key];
      if (v != null && v !== '') formData.set(key, String(v));
    });
    const result = await completePatientOnboarding(formData);
    if (result?.error) {
      // could set form error
    } else if (result?.success) {
      reset();
      router.push('/dashboard/patient');
    }
  }

  function onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf8] px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Logo */}
        <div className="text-center">
          <h1
            className="text-3xl font-semibold text-[#1a1f2e]"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            Telemedicine
          </h1>
        </div>

        {/* Onboarding Card */}
        <Card className="border-[#e8e6e1] bg-white shadow-sm">
          <CardHeader className="space-y-4">
            {/* Progress Indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#5c6370]">
                  Step {step + 1} of {steps.length}
                </span>
                <span className="text-sm font-medium text-[#0d9488]">
                  {Math.round(((step + 1) / steps.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#e8e6e1] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0d9488] transition-all duration-300 ease-out"
                  style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
            {/* Title */}
            <div className="space-y-1">
              <CardTitle className="text-2xl text-[#1a1f2e]">Patient onboarding</CardTitle>
              <CardDescription className="text-[#5c6370]">
                {steps[step].title}
              </CardDescription>
            </div>
          </CardHeader>
          <form onSubmit={onFormSubmit}>
            <CardContent className="space-y-4">
              {step === 0 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="first_name" className="text-[#1a1f2e] font-medium">First name</Label>
                    <Input
                      id="first_name"
                      error={errors.first_name?.message}
                      {...register('first_name')}
                      className="border-[#e8e6e1] focus:ring-[#0d9488]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name" className="text-[#1a1f2e] font-medium">Last name</Label>
                    <Input
                      id="last_name"
                      error={errors.last_name?.message}
                      {...register('last_name')}
                      className="border-[#e8e6e1] focus:ring-[#0d9488]"
                    />
                  </div>
                </>
              )}
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth" className="text-[#1a1f2e] font-medium">Date of birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      error={errors.date_of_birth?.message}
                      {...register('date_of_birth')}
                      className="border-[#e8e6e1] focus:ring-[#0d9488]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-[#1a1f2e] font-medium">Gender</Label>
                    <select
                      id="gender"
                      className="flex h-10 w-full rounded-lg border border-[#e8e6e1] bg-white px-3 py-2 text-sm text-[#1a1f2e] focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                      {...register('gender')}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[#1a1f2e] font-medium">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      error={errors.phone?.message}
                      {...register('phone')}
                      className="border-[#e8e6e1] focus:ring-[#0d9488]"
                    />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex gap-2 border-t border-[#e8e6e1] pt-4">
              {step > 0 && (
                <Button type="button" variant="outline" className="border-[#e8e6e1] hover:bg-[#fafaf8]" onClick={() => setStep((s) => s - 1)}>
                  Back
                </Button>
              )}
              {!isLastStep ? (
                <Button type="button" onClick={onNext} className="flex-1 bg-[#0d9488] hover:bg-[#0f766e] text-white">
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  className="flex-1 bg-[#0d9488] hover:bg-[#0f766e] text-white"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit(onSubmit)()}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" className="mr-2 shrink-0" />
                      Saving…
                    </>
                  ) : (
                    'Complete'
                  )}
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
