export interface ClinicDay {
  day: string;
  shortDay: string;
  open?: string;
  close?: string;
  isConcierge?: boolean;
}

export const CLINIC_HOURS: ClinicDay[] = [
  { day: 'Monday', shortDay: 'Mon', open: '08:00', close: '19:00' },
  { day: 'Tuesday', shortDay: 'Tue', open: '08:00', close: '19:00' },
  { day: 'Wednesday', shortDay: 'Wed', open: '08:00', close: '19:00' },
  { day: 'Thursday', shortDay: 'Thu', open: '08:00', close: '19:00' },
  { day: 'Friday', shortDay: 'Fri', open: '08:00', close: '18:00' },
  { day: 'Saturday', shortDay: 'Sat', open: '09:00', close: '16:00' },
  { day: 'Sunday', shortDay: 'Sun', isConcierge: true },
];

/**
 * Converts a 24-hour time string (e.g. "08:00", "19:00") to 12-hour AM/PM format (e.g. "08:00 AM", "07:00 PM").
 */
export function formatTime12Hour(time24: string): string {
  if (!time24) return '';
  const [hourStr, minuteStr] = time24.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr || '00';
  const period = hour >= 12 ? 'PM' : 'AM';
  
  if (hour === 0) {
    hour = 12;
  } else if (hour > 12) {
    hour -= 12;
  }
  
  const formattedHour = hour.toString();
  return `${formattedHour}:${minute} ${period}`;
}

export function getGroupedClinicHours(): string[] {
  const groups: { hours: string, days: string[] }[] = [];
  
  CLINIC_HOURS.forEach((day) => {
    let hoursStr = '';
    if (day.isConcierge) {
      hoursStr = 'BY CONCIERGE';
    } else {
      hoursStr = `${formatTime12Hour(day.open!)} – ${formatTime12Hour(day.close!)}`;
    }
    
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.hours === hoursStr) {
      lastGroup.days.push(day.shortDay);
    } else {
      groups.push({ hours: hoursStr, days: [day.shortDay] });
    }
  });

  return groups.map(g => {
    if (g.days.length === 1) return `${g.days[0]}: ${g.hours}`;
    return `${g.days[0]} – ${g.days[g.days.length - 1]}: ${g.hours}`;
  });
}

