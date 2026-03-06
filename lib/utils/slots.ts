// 15-minute increment slots for a given date (e.g. 09:00–17:00)
const START_HOUR = 9;
const END_HOUR = 17;
const MINUTES = [0, 15, 30, 45];

export function getSlotsForDate(date: Date): string[] {
  const out: string[] = [];
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  for (let h = START_HOUR; h < END_HOUR; h++) {
    for (const m of MINUTES) {
      const slot = new Date(d);
      slot.setHours(h, m, 0, 0);
      out.push(slot.toISOString());
    }
  }
  return out;
}

export function formatSlot(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}
