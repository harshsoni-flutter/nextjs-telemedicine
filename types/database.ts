export type UserRole = 'patient' | 'provider' | 'admin';

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed';

export interface User {
  id: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Provider {
  id: string;
  specialty: string | null;
  bio: string | null;
  years_of_experience: number | null;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  provider_id: string;
  scheduled_time: string;
  status: AppointmentStatus;
  reason_for_visit: string | null;
  created_at: string;
  updated_at: string;
}

export interface AppointmentWithRelations extends Appointment {
  patient?: Profile;
  provider?: Provider & { profiles?: Profile };
}

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'>;
export type ProviderInsert = Omit<Provider, 'created_at' | 'updated_at'>;
export type AppointmentInsert = Omit<
  Appointment,
  'id' | 'created_at' | 'updated_at'
>;
