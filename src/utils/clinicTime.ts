import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const CLINIC_TZ = 'Asia/Tashkent';

/** Start-of-day "today" anchored to the clinic timezone (not the browser's). */
export function clinicToday(): dayjs.Dayjs {
  return dayjs().tz(CLINIC_TZ).startOf('day');
}

/** The next 7 clinic-local days [today, today+6] as dayjs values. */
export function clinicNext7(): dayjs.Dayjs[] {
  const start = clinicToday();
  return Array.from({ length: 7 }, (_, i) => start.add(i, 'day'));
}
