'use client';

import { useRouter } from 'next/navigation';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { completeProviderOnboarding } from './actions';
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

const schema = z.object({
  first_name: z.string().min(1, 'Required'),
  last_name: z.string().min(1, 'Required'),
  specialty: z.string().min(1, 'Required'),
  bio: z.string().optional(),
  years_of_experience: z.coerce.number().int().min(0).optional(),
});

type FormData = z.infer<typeof schema>;

export default function OnboardingProviderPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) as Resolver<FormData> });

  async function onSubmit(data: FormData) {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) =>
      formData.set(k, v != null ? String(v) : '')
    );
    const result = await completeProviderOnboarding(formData);
    if (result?.error) {
      setError('root', { message: result.error });
    } else if (result?.success) {
      reset();
      router.push('/dashboard/provider');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf8] px-4 py-8">
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
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-[#1a1f2e]">Provider onboarding</CardTitle>
            <CardDescription className="text-[#5c6370]">
              Add your professional details (specialty, bio, years of practice)
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {errors.root && (
                <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                  <p className="text-sm text-red-700">{errors.root.message}</p>
                </div>
              )}
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
              <div className="space-y-2">
                <Label htmlFor="specialty" className="text-[#1a1f2e] font-medium">Specialty</Label>
                <Input
                  id="specialty"
                  placeholder="e.g. General Practice, Cardiology"
                  error={errors.specialty?.message}
                  {...register('specialty')}
                  className="border-[#e8e6e1] focus:ring-[#0d9488]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-[#1a1f2e] font-medium">Bio</Label>
                <textarea
                  id="bio"
                  rows={3}
                  className="flex w-full rounded-lg border border-[#e8e6e1] bg-white px-3 py-2 text-sm text-[#1a1f2e] focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                  placeholder="Short professional biography"
                  {...register('bio')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="years_of_experience" className="text-[#1a1f2e] font-medium">Years of experience</Label>
                <Input
                  id="years_of_experience"
                  type="number"
                  min={0}
                  placeholder="e.g. 10"
                  error={errors.years_of_experience?.message}
                  {...register('years_of_experience')}
                  className="border-[#e8e6e1] focus:ring-[#0d9488]"
                />
              </div>
              <Button type="submit" className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="mr-2 shrink-0" />
                    Saving…
                  </>
                ) : (
                  'Complete'
                )}
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}
