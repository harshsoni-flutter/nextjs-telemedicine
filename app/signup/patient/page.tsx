'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUpPatient } from './actions';
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

const schema = z
  .object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'At least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function SignUpPatientPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const isRateLimit = errors.root?.message?.toLowerCase().includes('rate limit');

  async function onSubmit(data: FormData) {
    const formData = new FormData();
    formData.set('email', data.email);
    formData.set('password', data.password);
    const result = await signUpPatient(formData);
    if (result?.error) {
      setError('root', { message: result.error });
    } else if (result?.success) {
      reset();
      router.push('/onboarding/patient');
    }
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

        {/* Signup Card */}
        <Card className="border-[#e8e6e1] bg-white shadow-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl text-[#1a1f2e]">Patient sign up</CardTitle>
            <CardDescription className="text-[#5c6370]">
              Create an account to book appointments with providers
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {errors.root && (
                <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                  <p className="text-sm text-red-700 space-y-1">
                    {isRateLimit
                      ? 'Too many signup emails sent. Wait a few minutes, or in Supabase turn off "Confirm email" (Authentication → Providers → Email) so signup does not send emails.'
                      : errors.root.message}
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#1a1f2e] font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  {...register('email')}
                  className="border-[#e8e6e1] focus:ring-[#0d9488]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#1a1f2e] font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  error={errors.password?.message}
                  {...register('password')}
                  className="border-[#e8e6e1] focus:ring-[#0d9488]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#1a1f2e] font-medium">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                  className="border-[#e8e6e1] focus:ring-[#0d9488]"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-medium"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="mr-2 shrink-0" />
                    Creating account…
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex flex-col gap-3 text-center border-t border-[#e8e6e1] pt-4">
            <p className="text-sm text-[#5c6370]">
              Already have an account?{' '}
              <Link href="/login" className="text-[#0d9488] hover:text-[#0f766e] font-medium">
                Sign in
              </Link>
            </p>
            <p className="text-sm text-[#5c6370]">
              Are you a provider?{' '}
              <Link href="/signup/provider" className="text-[#0d9488] hover:text-[#0f766e] font-medium">
                Sign up here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
