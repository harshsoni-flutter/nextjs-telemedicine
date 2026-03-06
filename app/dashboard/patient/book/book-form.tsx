'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createAppointment } from '@/lib/actions/appointments';
import { getSlotsForDate } from '@/lib/utils/slots';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const schema = z.object({
  provider_id: z.string().uuid(),
  date: z.string().min(1, 'Pick a date'),
  time: z.string().min(1, 'Pick a time'),
  reason_for_visit: z.string().min(1, 'Reason is required'),
});

type FormData = z.infer<typeof schema>;

type Provider = {
  id: string;
  specialty: string | null;
  first_name: string | null;
  last_name: string | null;
};

export function BookAppointmentForm({
  providers,
  defaultProviderId,
}: {
  providers: Provider[];
  defaultProviderId: string | null;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'provider' | 'date' | 'time' | 'reason'>('provider');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { provider_id: defaultProviderId ?? '' },
  });

  const selectedProviderId = watch('provider_id');
  const selectedDate = watch('date');
  const selectedTime = watch('time');
  const selectedReason = watch('reason_for_visit');

  const selectedProvider = providers.find((p) => p.id === selectedProviderId);
  const slots = selectedDate ? getSlotsForDate(new Date(selectedDate)) : [];

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);

  async function onSubmit(data: FormData) {
    setError(null);
    const result = await createAppointment(
      data.provider_id,
      data.time,
      data.reason_for_visit
    );
    if (result.error) {
      setError(result.error);
      return;
    }
    reset({
      provider_id: defaultProviderId ?? '',
      date: '',
      time: '',
      reason_for_visit: '',
    });
    router.push('/dashboard/patient');
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Form */}
      <Card className="lg:col-span-2 border-[#e8e6e1] bg-white">
        <CardHeader className="space-y-2">
          <CardTitle className="text-[#1a1f2e]">Book an appointment</CardTitle>
          <div className="flex gap-2">
            {(['provider', 'date', 'time', 'reason'] as const).map((s, idx) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  (step === s ||
                   (step === 'date' && idx <= 1) ||
                   (step === 'time' && idx <= 2) ||
                   (step === 'reason' && idx <= 3))
                    ? 'bg-[#0d9488]'
                    : 'bg-[#e8e6e1]'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Step 1: Provider */}
            <div>
              <Label className="text-[#1a1f2e] font-semibold mb-3 block">
                Step 1: Select a provider
              </Label>
              <select
                id="provider_id"
                className="w-full rounded-lg border border-[#e8e6e1] bg-white px-4 py-3 text-sm text-[#1a1f2e] focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                {...register('provider_id')}
                onChange={(e) => {
                  register('provider_id').onChange(e);
                  if (e.target.value) setStep('date');
                }}
              >
                <option value="">Select a provider</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>
                    Dr. {[p.first_name, p.last_name].filter(Boolean).join(' ')} — {p.specialty ?? 'General'}
                  </option>
                ))}
              </select>
              {errors.provider_id && (
                <p className="mt-2 text-sm text-red-600">{errors.provider_id.message}</p>
              )}
            </div>

            {/* Step 2: Date */}
            {selectedProviderId && (
              <div>
                <Label className="text-[#1a1f2e] font-semibold mb-3 block">
                  Step 2: Select a date
                </Label>
                <input
                  id="date"
                  type="date"
                  min={minDate.toISOString().slice(0, 10)}
                  max={maxDate.toISOString().slice(0, 10)}
                  className="w-full rounded-lg border border-[#e8e6e1] bg-white px-4 py-3 text-sm text-[#1a1f2e] focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                  {...register('date')}
                  onChange={(e) => {
                    register('date').onChange(e);
                    if (e.target.value) setStep('time');
                  }}
                />
                {errors.date && (
                  <p className="mt-2 text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>
            )}

            {/* Step 3: Time */}
            {selectedDate && (
              <div>
                <Label className="text-[#1a1f2e] font-semibold mb-3 block">
                  Step 3: Select a time (15-min slots)
                </Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {slots.length > 0 ? (
                    slots.map((s) => {
                      const time = new Date(s).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                      const isSelected = selectedTime === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            register('time').onChange({ target: { value: s } });
                            setStep('reason');
                          }}
                          className={`rounded-lg border-2 py-2 px-3 text-sm font-medium transition ${
                            isSelected
                              ? 'border-[#0d9488] bg-[#0d9488] text-white'
                              : 'border-[#e8e6e1] bg-white text-[#1a1f2e] hover:border-[#0d9488]'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-sm text-[#5c6370] col-span-full">
                      No slots available for this date
                    </p>
                  )}
                </div>
                {errors.time && (
                  <p className="mt-2 text-sm text-red-600">{errors.time.message}</p>
                )}
              </div>
            )}

            {/* Step 4: Reason */}
            {selectedTime && (
              <div>
                <Label className="text-[#1a1f2e] font-semibold mb-3 block">
                  Step 4: Reason for visit
                </Label>
                <textarea
                  id="reason_for_visit"
                  rows={3}
                  className="w-full rounded-lg border border-[#e8e6e1] bg-white px-4 py-3 text-sm text-[#1a1f2e] focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                  placeholder="Brief reason for the visit..."
                  {...register('reason_for_visit')}
                />
                {errors.reason_for_visit && (
                  <p className="mt-2 text-sm text-red-600">{errors.reason_for_visit.message}</p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !selectedReason}
                className="flex-1 bg-[#0d9488] hover:bg-[#0f766e] text-white"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="mr-2 shrink-0" />
                    Confirming…
                  </>
                ) : (
                  'Confirm booking'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-[#e8e6e1] hover:bg-[#fafaf8]"
                onClick={() => router.push('/dashboard/patient')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Summary */}
      {selectedProviderId && (
        <Card className="border-[#e8e6e1] bg-white h-fit sticky top-8">
          <CardHeader>
            <CardTitle className="text-lg text-[#1a1f2e]">Appointment summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedProvider && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#5c6370]">
                  Provider
                </p>
                <p className="mt-1 font-semibold text-[#1a1f2e]">
                  Dr. {[selectedProvider.first_name, selectedProvider.last_name]
                    .filter(Boolean)
                    .join(' ')}
                </p>
                {selectedProvider.specialty && (
                  <Badge className="mt-2" variant="info">
                    {selectedProvider.specialty}
                  </Badge>
                )}
              </div>
            )}

            {selectedDate && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#5c6370]">
                  Date
                </p>
                <p className="mt-1 font-semibold text-[#1a1f2e]">
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}

            {selectedTime && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#5c6370]">
                  Time
                </p>
                <p className="mt-1 font-semibold text-[#1a1f2e]">
                  {new Date(selectedTime).toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}

            {selectedReason && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#5c6370]">
                  Reason
                </p>
                <p className="mt-1 text-sm text-[#1a1f2e] line-clamp-3">
                  {selectedReason}
                </p>
              </div>
            )}

            {selectedProviderId && selectedDate && selectedTime && selectedReason && (
              <div className="rounded-lg bg-[#ccfbf1] p-3 mt-4">
                <p className="text-xs font-medium text-[#0d9488]">
                  ✓ All details complete. Ready to book!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
