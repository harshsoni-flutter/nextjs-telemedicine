'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
  saveAvailabilitySlot,
  saveProviderSettings,
  addBlockedTime,
  removeBlockedTime,
  toggleAvailability,
} from '@/lib/actions/availability';

interface AvailabilitySlot {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  is_available: boolean;
}

interface ProviderSettings {
  timezone: string;
  appointment_duration_minutes: number;
  allow_same_day_booking: boolean;
  min_advance_booking_hours: number;
  max_advance_booking_days: number;
}

interface BlockedTime {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
  is_vacation: boolean;
}

interface AvailabilityManagerProps {
  providerId: string;
  initialSlots: AvailabilitySlot[];
  initialSettings: ProviderSettings | null;
  initialBlockedTime: BlockedTime[];
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Australia/Sydney',
];

export function AvailabilityManager({
  providerId,
  initialSlots,
  initialSettings,
  initialBlockedTime,
}: AvailabilityManagerProps) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>(initialSlots);
  const [settings, setSettings] = useState<ProviderSettings>(
    initialSettings || {
      timezone: 'America/New_York',
      appointment_duration_minutes: 30,
      allow_same_day_booking: false,
      min_advance_booking_hours: 24,
      max_advance_booking_days: 30,
    }
  );
  const [blockedTime, setBlockedTime] = useState<BlockedTime[]>(initialBlockedTime);
  const [selectedTab, setSelectedTab] = useState<'schedule' | 'settings' | 'blocked'>('schedule');
  const [saving, setSaving] = useState(false);

  // Schedule management
  const handleTimeChange = (dayIndex: number, field: 'start' | 'end', value: string) => {
    const dayOfWeek = DAYS_OF_WEEK[dayIndex].toLowerCase();
    const existingSlot = slots.find((s) => s.day_of_week === dayOfWeek);

    if (existingSlot) {
      setSlots(
        slots.map((s) =>
          s.day_of_week === dayOfWeek
            ? {
                ...s,
                start_time: field === 'start' ? value : s.start_time,
                end_time: field === 'end' ? value : s.end_time,
              }
            : s
        )
      );
    } else {
      setSlots([
        ...slots,
        {
          id: `temp-${dayIndex}`,
          day_of_week: dayOfWeek,
          start_time: field === 'start' ? value : '09:00',
          end_time: field === 'end' ? value : '17:00',
          slot_duration_minutes: 15,
          is_available: true,
        },
      ]);
    }
  };

  const handleSaveSchedule = async () => {
    setSaving(true);
    for (const slot of slots) {
      const result = await saveAvailabilitySlot(
        providerId,
        slot.day_of_week,
        slot.start_time,
        slot.end_time,
        slot.slot_duration_minutes
      );
      if (result.error) {
        console.error('Error saving slot:', result.error);
      }
    }
    setSaving(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const result = await saveProviderSettings(providerId, {
      timezone: settings.timezone,
      appointmentDurationMinutes: settings.appointment_duration_minutes,
      allowSameDayBooking: settings.allow_same_day_booking,
      minAdvanceBookingHours: settings.min_advance_booking_hours,
      maxAdvanceBookingDays: settings.max_advance_booking_days,
    });
    if (!result.error) {
      console.log('Settings saved successfully');
    }
    setSaving(false);
  };

  const handleAddBlockedTime = async (startDate: string, endDate: string, reason: string) => {
    setSaving(true);
    const result = await addBlockedTime(providerId, startDate, endDate, reason, true);
    if (!result.error) {
      const newBlocked: BlockedTime = {
        id: `temp-${Date.now()}`,
        start_date: startDate,
        end_date: endDate,
        reason,
        is_vacation: true,
      };
      setBlockedTime([...blockedTime, newBlocked]);
    }
    setSaving(false);
  };

  const handleRemoveBlockedTime = async (id: string) => {
    setSaving(true);
    if (!id.startsWith('temp-')) {
      const result = await removeBlockedTime(id);
      if (result.error) {
        console.error('Error removing blocked time:', result.error);
      }
    }
    setBlockedTime(blockedTime.filter((b) => b.id !== id));
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#e8e6e1]">
        {['schedule', 'settings', 'blocked'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab as 'schedule' | 'settings' | 'blocked')}
            className={`px-4 py-3 font-medium transition ${
              selectedTab === tab
                ? 'border-b-2 border-[#0d9488] text-[#0d9488]'
                : 'text-[#5c6370] hover:text-[#1a1f2e]'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Schedule Tab */}
      {selectedTab === 'schedule' && (
        <Card className="border-[#e8e6e1] bg-white">
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
            <CardDescription>Set your available hours for each day of the week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {DAYS_OF_WEEK.map((day, idx) => {
              const slot = slots.find((s) => s.day_of_week === day.toLowerCase());
              return (
                <div key={day} className="space-y-2">
                  <div className="flex items-center gap-4">
                    <Label className="w-24 font-semibold text-[#1a1f2e]">{day}</Label>
                    <div className="flex items-center gap-4 flex-1">
                      <input
                        type="time"
                        value={slot?.start_time || '09:00'}
                        onChange={(e) => handleTimeChange(idx, 'start', e.target.value)}
                        className="rounded-lg border border-[#e8e6e1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                      />
                      <span className="text-[#5c6370]">to</span>
                      <input
                        type="time"
                        value={slot?.end_time || '17:00'}
                        onChange={(e) => handleTimeChange(idx, 'end', e.target.value)}
                        className="rounded-lg border border-[#e8e6e1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                      />
                      {slot?.is_available && (
                        <Badge variant="success" className="ml-auto">
                          Available
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <Button
              onClick={handleSaveSchedule}
              disabled={saving}
              className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white"
            >
              {saving ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Saving…
                </>
              ) : (
                'Save Schedule'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Settings Tab */}
      {selectedTab === 'settings' && (
        <Card className="border-[#e8e6e1] bg-white">
          <CardHeader>
            <CardTitle>Booking Settings</CardTitle>
            <CardDescription>Configure how patients can book appointments with you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="font-semibold text-[#1a1f2e]">Timezone</Label>
              <select
                value={settings.timezone}
                onChange={(e) =>
                  setSettings({ ...settings, timezone: e.target.value })
                }
                className="w-full rounded-lg border border-[#e8e6e1] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="font-semibold text-[#1a1f2e]">Appointment Duration (minutes)</Label>
                <input
                  type="number"
                  value={settings.appointment_duration_minutes}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      appointment_duration_minutes: parseInt(e.target.value),
                    })
                  }
                  min={15}
                  max={180}
                  step={15}
                  className="w-full rounded-lg border border-[#e8e6e1] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-[#1a1f2e]">Min Advance Booking (hours)</Label>
                <input
                  type="number"
                  value={settings.min_advance_booking_hours}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      min_advance_booking_hours: parseInt(e.target.value),
                    })
                  }
                  min={1}
                  max={168}
                  className="w-full rounded-lg border border-[#e8e6e1] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="font-semibold text-[#1a1f2e]">Max Advance Booking (days)</Label>
                <input
                  type="number"
                  value={settings.max_advance_booking_days}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      max_advance_booking_days: parseInt(e.target.value),
                    })
                  }
                  min={1}
                  max={365}
                  className="w-full rounded-lg border border-[#e8e6e1] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-[#1a1f2e]">Allow Same-Day Booking</Label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allow_same_day_booking}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        allow_same_day_booking: e.target.checked,
                      })
                    }
                    className="rounded border-[#e8e6e1]"
                  />
                  <span className="text-sm text-[#5c6370]">Enable same-day appointments</span>
                </label>
              </div>
            </div>

            <Button
              onClick={handleSaveSettings}
              disabled={saving}
              className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white"
            >
              {saving ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Saving…
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Blocked Time Tab */}
      {selectedTab === 'blocked' && (
        <Card className="border-[#e8e6e1] bg-white">
          <CardHeader>
            <CardTitle>Vacation & Blocked Time</CardTitle>
            <CardDescription>Mark periods when you're unavailable for appointments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label className="font-semibold text-[#1a1f2e]">Start Date</Label>
                <input
                  type="date"
                  id="blocked-start"
                  className="w-full rounded-lg border border-[#e8e6e1] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-[#1a1f2e]">End Date</Label>
                <input
                  type="date"
                  id="blocked-end"
                  className="w-full rounded-lg border border-[#e8e6e1] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-[#1a1f2e]">Reason (optional)</Label>
                <input
                  type="text"
                  id="blocked-reason"
                  placeholder="e.g., Vacation"
                  className="w-full rounded-lg border border-[#e8e6e1] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                />
              </div>
            </div>

            <Button
              onClick={() => {
                const startDate = (document.getElementById('blocked-start') as HTMLInputElement)?.value;
                const endDate = (document.getElementById('blocked-end') as HTMLInputElement)?.value;
                const reason = (document.getElementById('blocked-reason') as HTMLInputElement)?.value || '';
                if (startDate && endDate) {
                  handleAddBlockedTime(startDate, endDate, reason);
                  (document.getElementById('blocked-start') as HTMLInputElement).value = '';
                  (document.getElementById('blocked-end') as HTMLInputElement).value = '';
                  (document.getElementById('blocked-reason') as HTMLInputElement).value = '';
                }
              }}
              disabled={saving}
              variant="outline"
              className="border-[#e8e6e1] w-full"
            >
              {saving ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Adding…
                </>
              ) : (
                'Add Blocked Time'
              )}
            </Button>

            {blockedTime.length > 0 && (
              <div className="space-y-3 mt-6">
                <h4 className="font-semibold text-[#1a1f2e]">Upcoming blocked periods</h4>
                {blockedTime.map((blocked) => (
                  <div
                    key={blocked.id}
                    className="flex items-center justify-between rounded-lg border border-[#e8e6e1] p-4"
                  >
                    <div>
                      <p className="font-medium text-[#1a1f2e]">
                        {new Date(blocked.start_date).toLocaleDateString()} -{' '}
                        {new Date(blocked.end_date).toLocaleDateString()}
                      </p>
                      {blocked.reason && (
                        <p className="text-sm text-[#5c6370]">{blocked.reason}</p>
                      )}
                    </div>
                    <Button
                      onClick={() => handleRemoveBlockedTime(blocked.id)}
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      size="sm"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
