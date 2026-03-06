'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithPassword, signInWithGoogleFormAction, resendConfirmationEmail } from './actions';
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
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

function GoogleSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="outline" className="w-full border-[#e8e6e1] hover:bg-[#fafaf8]" size="lg" disabled={pending}>
      {pending ? (
        <>
          <Spinner size="sm" className="mr-2 shrink-0" />
          Redirecting…
        </>
      ) : (
        'Google'
      )}
    </Button>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const {
    register,
    watch,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const emailValue = watch('email');

  const isEmailNotConfirmed =
    errors.root?.message?.toLowerCase().includes('email not confirmed');
  const isRateLimit =
    errors.root?.message?.toLowerCase().includes('rate limit');

  async function onSubmit(data: FormData) {
    setResendSuccess(false);
    const formData = new FormData();
    formData.set('email', data.email);
    formData.set('password', data.password);
    const result = await signInWithPassword(formData);
    if (result?.error) {
      setError('root', { message: result.error });
    } else if (result?.success) {
      reset();
      router.push('/dashboard/patient');
    }
  }

  async function onResendConfirmation(email: string) {
    setResendLoading(true);
    try {
      const formData = new FormData();
      formData.set('email', email);
      const result = await resendConfirmationEmail(formData);
      if (result?.error) setError('root', { message: result.error });
      else setResendSuccess(true);
    } finally {
      setResendLoading(false);
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

        {/* Login Card */}
        <Card className="border-[#e8e6e1] bg-white shadow-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl text-[#1a1f2e]">Sign in</CardTitle>
            <CardDescription className="text-[#5c6370]">
              Sign in with email or Google to access your account
            </CardDescription>
          </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errors.root && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                <p className="text-sm text-red-700">
                  {isEmailNotConfirmed
                    ? 'Please confirm your email before signing in. Check your inbox for the confirmation link.'
                    : isRateLimit
                      ? 'Too many emails sent. Please wait a few minutes and try again, or turn off "Confirm email" in Supabase (Authentication → Providers → Email) to sign in without confirmation.'
                      : errors.root.message}
                </p>
                {isEmailNotConfirmed && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => emailValue && onResendConfirmation(emailValue)}
                      disabled={resendLoading}
                      className="text-[#0d9488] hover:text-[#0f766e] hover:underline font-medium disabled:opacity-70 inline-flex items-center gap-1.5 text-sm"
                    >
                      {resendLoading ? (
                        <>
                          <Spinner size="sm" className="shrink-0" />
                          Sending…
                        </>
                      ) : (
                        'Resend confirmation email'
                      )}
                    </button>
                    {resendSuccess && (
                      <p className="text-green-600 mt-2 text-sm">Check your inbox.</p>
                    )}
                  </div>
                )}
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
            <Button
              type="submit"
              className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-medium"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2 shrink-0" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#e8e6e1]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase text-[#5c6370]">
              <span className="bg-white px-2">Or continue with</span>
            </div>
          </div>
          <form action={signInWithGoogleFormAction}>
            <GoogleSubmitButton />
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 text-center border-t border-[#e8e6e1] pt-4">
          <p className="text-sm text-[#5c6370]">
            Don&apos;t have an account?{' '}
            <Link href="/signup/patient" className="text-[#0d9488] hover:text-[#0f766e] font-medium">
              Sign up as Patient
            </Link>
            {' or '}
            <Link href="/signup/provider" className="text-[#0d9488] hover:text-[#0f766e] font-medium">
              Sign up as Provider
            </Link>
          </p>
        </CardFooter>
      </Card>
      </div>
    </div>
  );
}
