'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

type Appointment = {
  id: string;
  scheduled_time: string;
  status: string;
  reason_for_visit: string | null;
  patient?: { first_name: string | null; last_name: string | null } | null;
};

export function ProviderAgenda({
  appointments,
  onComplete,
  onCancel,
}: {
  appointments: Appointment[];
  onComplete: (id: string, status: 'completed') => Promise<{ error?: string }>;
  onCancel: (id: string) => Promise<{ error?: string }>;
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<'complete' | 'cancel' | null>(null);

  async function handleComplete(id: string) {
    setLoadingId(id);
    setLoadingAction('complete');
    try {
      await onComplete(id, 'completed');
    } finally {
      setLoadingId(null);
      setLoadingAction(null);
    }
  }

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

  return (
    <ul className="space-y-2">
      {appointments.map((a) => (
        <li
          key={a.id}
          className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
        >
          <div>
            <p className="font-medium text-slate-900">
              {new Date(a.scheduled_time).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              —{' '}
              {a.patient
                ? [a.patient.first_name, a.patient.last_name].filter(Boolean).join(' ')
                : 'Patient'}
            </p>
            <p className="text-sm text-slate-600">{a.reason_for_visit ?? '—'}</p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleComplete(a.id)}
              disabled={loadingId === a.id}
            >
              {loadingId === a.id && loadingAction === 'complete' ? (
                <>
                  <Spinner size="sm" className="mr-1.5 shrink-0" />
                  Completing…
                </>
              ) : (
                'Complete'
              )}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleCancel(a.id)}
              disabled={loadingId === a.id}
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
          </div>
        </li>
      ))}
    </ul>
  );
}
