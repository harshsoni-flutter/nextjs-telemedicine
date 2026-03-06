'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { formatSlot } from '@/lib/utils/slots';
import { getSlotsForDate } from '@/lib/utils/slots';

type Appointment = {
  id: string;
  scheduled_time: string;
  status: string;
  reason_for_visit: string | null;
  provider?: { specialty?: string | null } | null;
};

export function PatientAppointmentList({
  appointments,
  onCancel,
  onReschedule,
}: {
  appointments: Appointment[];
  onCancel: (id: string) => Promise<{ error?: string }>;
  onReschedule: (id: string, scheduledTime: string) => Promise<{ error?: string }>;
}) {
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [newTime, setNewTime] = useState('');
  const [date, setDate] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<'cancel' | 'reschedule' | null>(null);

  async function handleCancel(id: string) {
    setLoadingId(id);
    setLoadingAction('cancel');
    try {
      await onCancel(id);
    } finally {
      setLoadingId(null);
      setLoadingAction(null);
    }
  }

  async function handleReschedule(id: string) {
    if (!newTime) return;
    setLoadingId(id);
    setLoadingAction('reschedule');
    try {
      await onReschedule(id, newTime);
      setRescheduleId(null);
      setNewTime('');
      setDate('');
    } finally {
      setLoadingId(null);
      setLoadingAction(null);
    }
  }

  const slots = date ? getSlotsForDate(new Date(date)) : [];

  return (
    <ul className="space-y-3">
      {appointments.map((a) => (
        <li
          key={a.id}
          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3"
        >
          <div>
            <p className="font-medium text-slate-900">
              {formatSlot(a.scheduled_time)}
            </p>
            <p className="text-sm text-slate-600">
              {a.provider?.specialty ?? 'Provider'} — {a.reason_for_visit ?? 'No reason'}
            </p>
          </div>
          <div className="flex gap-2">
            {rescheduleId === a.id ? (
              <div className="flex flex-col gap-2 rounded border border-slate-200 bg-white p-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <select
                      className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                    >
                      <option value="">Select</option>
                      {slots.map((s) => (
                        <option key={s} value={s}>
                          {new Date(s).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleReschedule(a.id)}
                    disabled={!newTime || (loadingId === a.id && loadingAction === 'reschedule')}
                  >
                    {loadingId === a.id && loadingAction === 'reschedule' ? (
                      <>
                        <Spinner size="sm" className="mr-1.5 shrink-0" />
                        Saving…
                      </>
                    ) : (
                      'Save'
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setRescheduleId(null);
                      setNewTime('');
                      setDate('');
                    }}
                    disabled={loadingId === a.id}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setRescheduleId(a.id);
                    setDate(a.scheduled_time.slice(0, 10));
                    setNewTime(a.scheduled_time);
                  }}
                  disabled={loadingId === a.id}
                >
                  Reschedule
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleCancel(a.id)}
                  disabled={loadingId === a.id && loadingAction === 'cancel'}
                >
                  {loadingId === a.id && loadingAction === 'cancel' ? (
                    <>
                      <Spinner size="sm" className="mr-1.5 shrink-0" />
                      Cancelling…
                    </>
                  ) : (
                    'Cancel'
                  )}
                </Button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
