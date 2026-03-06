'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { AppointmentStatus, Provider } from '@/types/database';

export type PatientAppointmentRow = {
  id: string;
  patient_id: string;
  provider_id: string;
  scheduled_time: string;
  status: AppointmentStatus;
  reason_for_visit: string | null;
  created_at: string;
  provider?: Provider | Provider[] | null;
};

export async function getPatientAppointments(): Promise<
  (Omit<PatientAppointmentRow, 'provider'> & { provider?: Provider | null })[]
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from('appointments')
    .select(
      `
      id, patient_id, provider_id, scheduled_time, status, reason_for_visit, created_at,
      provider:providers(id, specialty, bio, years_of_experience)
    `
    )
    .eq('patient_id', user.id)
    .order('scheduled_time', { ascending: true });
  const rows = (data ?? []) as PatientAppointmentRow[];
  return rows.map((row) => ({
    ...row,
    provider: Array.isArray(row.provider) ? row.provider[0] ?? null : row.provider ?? null,
  }));
}

export async function getProviderAppointments() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data: appointments } = await supabase
    .from('appointments')
    .select('id, patient_id, provider_id, scheduled_time, status, reason_for_visit, created_at')
    .eq('provider_id', user.id)
    .order('scheduled_time', { ascending: true });
  if (!appointments?.length) return [];
  const ids = [...new Set(appointments.map((a) => a.patient_id))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, phone')
    .in('id', ids);
  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
  return appointments.map((a) => ({
    ...a,
    patient: byId.get(a.patient_id) ?? null,
  }));
}

export async function getUpcomingProviderAppointments() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  const { data: appointments } = await supabase
    .from('appointments')
    .select('id, patient_id, scheduled_time, status, reason_for_visit')
    .eq('provider_id', user.id)
    .gte('scheduled_time', start.toISOString())
    .lt('scheduled_time', end.toISOString())
    .in('status', ['pending', 'confirmed'])
    .order('scheduled_time', { ascending: true });
  if (!appointments?.length) return [];
  const ids = [...new Set(appointments.map((a) => a.patient_id))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, first_name, last_name')
    .in('id', ids);
  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
  return appointments.map((a) => ({
    ...a,
    patient: byId.get(a.patient_id) ?? null,
  }));
}

export async function createAppointment(
  providerId: string,
  scheduledTime: string,
  reasonForVisit: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { error } = await supabase.from('appointments').insert({
    patient_id: user.id,
    provider_id: providerId,
    scheduled_time: scheduledTime,
    reason_for_visit: reasonForVisit || null,
    status: 'pending',
  });
  if (error) return { error: error.message };
  revalidatePath('/dashboard/patient');
  revalidatePath('/dashboard/provider');
  return {};
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('appointments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', appointmentId);
  if (error) return { error: error.message };
  revalidatePath('/dashboard/patient');
  revalidatePath('/dashboard/provider');
  return {};
}

export async function rescheduleAppointment(
  appointmentId: string,
  scheduledTime: string
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('appointments')
    .update({
      scheduled_time: scheduledTime,
      updated_at: new Date().toISOString(),
    })
    .eq('id', appointmentId);
  if (error) return { error: error.message };
  revalidatePath('/dashboard/patient');
  revalidatePath('/dashboard/provider');
  return {};
}

export async function cancelAppointment(appointmentId: string) {
  return updateAppointmentStatus(appointmentId, 'cancelled');
}
