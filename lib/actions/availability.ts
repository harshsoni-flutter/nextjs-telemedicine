'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function getProviderAvailability(providerId: string) {
  const supabase = await createServerComponentClient({ cookies });
  const { data, error } = await supabase
    .from('provider_availability')
    .select('*')
    .eq('provider_id', providerId)
    .order('day_of_week');

  if (error) {
    console.error('Error fetching provider availability:', error);
    return [];
  }
  return data || [];
}

export async function getProviderSettings(providerId: string) {
  const supabase = await createServerComponentClient({ cookies });
  const { data, error } = await supabase
    .from('provider_settings')
    .select('*')
    .eq('provider_id', providerId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching provider settings:', error);
  }
  return data || null;
}

export async function getProviderBlockedTime(providerId: string) {
  const supabase = await createServerComponentClient({ cookies });
  const { data, error } = await supabase
    .from('provider_blocked_time')
    .select('*')
    .eq('provider_id', providerId)
    .gte('end_date', new Date().toISOString().split('T')[0])
    .order('start_date');

  if (error) {
    console.error('Error fetching provider blocked time:', error);
    return [];
  }
  return data || [];
}

export async function saveAvailabilitySlot(
  providerId: string,
  dayOfWeek: string,
  startTime: string,
  endTime: string,
  slotDurationMinutes: number = 15
) {
  const supabase = await createServerComponentClient({ cookies });

  // Check if slot already exists for this day
  const { data: existing } = await supabase
    .from('provider_availability')
    .select('id')
    .eq('provider_id', providerId)
    .eq('day_of_week', dayOfWeek)
    .single();

  if (existing) {
    // Update existing
    const { error } = await supabase
      .from('provider_availability')
      .update({
        start_time: startTime,
        end_time: endTime,
        slot_duration_minutes: slotDurationMinutes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);

    if (error) {
      return { error: error.message };
    }
  } else {
    // Insert new
    const { error } = await supabase
      .from('provider_availability')
      .insert({
        provider_id: providerId,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
        slot_duration_minutes: slotDurationMinutes,
      });

    if (error) {
      return { error: error.message };
    }
  }

  return { error: null };
}

export async function toggleAvailability(availabilityId: string, isAvailable: boolean) {
  const supabase = await createServerComponentClient({ cookies });
  const { error } = await supabase
    .from('provider_availability')
    .update({
      is_available: isAvailable,
      updated_at: new Date().toISOString(),
    })
    .eq('id', availabilityId);

  if (error) {
    return { error: error.message };
  }
  return { error: null };
}

export async function saveProviderSettings(
  providerId: string,
  settings: {
    timezone: string;
    appointmentDurationMinutes: number;
    allowSameDayBooking: boolean;
    minAdvanceBookingHours: number;
    maxAdvanceBookingDays: number;
  }
) {
  const supabase = await createServerComponentClient({ cookies });

  const { error } = await supabase
    .from('provider_settings')
    .upsert({
      provider_id: providerId,
      timezone: settings.timezone,
      appointment_duration_minutes: settings.appointmentDurationMinutes,
      allow_same_day_booking: settings.allowSameDayBooking,
      min_advance_booking_hours: settings.minAdvanceBookingHours,
      max_advance_booking_days: settings.maxAdvanceBookingDays,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return { error: error.message };
  }
  return { error: null };
}

export async function addBlockedTime(
  providerId: string,
  startDate: string,
  endDate: string,
  reason: string = '',
  isVacation: boolean = false
) {
  const supabase = await createServerComponentClient({ cookies });

  const { error } = await supabase
    .from('provider_blocked_time')
    .insert({
      provider_id: providerId,
      start_date: startDate,
      end_date: endDate,
      reason,
      is_vacation: isVacation,
    });

  if (error) {
    return { error: error.message };
  }
  return { error: null };
}

export async function removeBlockedTime(blockedTimeId: string) {
  const supabase = await createServerComponentClient({ cookies });

  const { error } = await supabase
    .from('provider_blocked_time')
    .delete()
    .eq('id', blockedTimeId);

  if (error) {
    return { error: error.message };
  }
  return { error: null };
}
