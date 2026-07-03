import { useState, useMemo, useCallback } from 'react';
import dayjs from 'dayjs';
import type { Doctor } from '@/pages/appointments/types/appointment.types';
import { clinicToday } from '@/utils/clinicTime';

export interface ScheduleDay {
  dateStr: string;
  dayIndex: number;
  isSunday: boolean;
}

type Ranges = Record<string, [dayjs.Dayjs, dayjs.Dayjs] | null>;

/** Default working hours applied to newly-enabled / unscheduled non-Sunday days. */
const defaultRange = (): [dayjs.Dayjs, dayjs.Dayjs] => [dayjs('09:00', 'HH:mm'), dayjs('17:00', 'HH:mm')];

/** The next 7 days [today, today+6] anchored to the clinic timezone (Asia/Tashkent). */
function getNext7Days(): ScheduleDay[] {
  const start = clinicToday();
  return Array.from({ length: 7 }, (_, i) => {
    const d = start.add(i, 'day');
    return { dateStr: d.format('YYYY-MM-DD'), dayIndex: d.day(), isSunday: d.day() === 0 };
  });
}

/** Owns the doctor-schedule editing state: which dates are enabled and their time ranges. */
export function useDoctorSchedule() {
  const next7Days = useMemo(() => getNext7Days(), []);
  const [enabledDates, setEnabledDates] = useState<Set<string>>(new Set());
  const [dateTimeRanges, setDateTimeRanges] = useState<Ranges>({});

  /** Create-mode default: all days except Sundays enabled at 09:00–17:00. */
  const initForCreate = useCallback(() => {
    const enabled = new Set<string>();
    const times: Ranges = {};
    for (const day of next7Days) {
      if (!day.isSunday) {
        enabled.add(day.dateStr);
        times[day.dateStr] = defaultRange();
      } else {
        times[day.dateStr] = null;
      }
    }
    setEnabledDates(enabled);
    setDateTimeRanges(times);
  }, [next7Days]);

  /** Edit-mode: populate from the doctor's existing schedule; unscheduled non-Sundays get a default range (not enabled). */
  const initForEdit = useCallback((doctor: Doctor) => {
    const enabled = new Set<string>();
    const times: Ranges = {};
    for (const day of next7Days) {
      const timeRange = doctor.weeklySchedule?.[day.dateStr];
      if (timeRange) {
        enabled.add(day.dateStr);
        const [start, end] = timeRange.split('-');
        times[day.dateStr] = [dayjs(start, 'HH:mm'), dayjs(end, 'HH:mm')];
      } else {
        times[day.dateStr] = day.isSunday ? null : defaultRange();
      }
    }
    setEnabledDates(enabled);
    setDateTimeRanges(times);
  }, [next7Days]);

  const toggleDate = useCallback((dateStr: string) => {
    setEnabledDates((prev) => {
      const next = new Set(prev);
      if (next.has(dateStr)) {
        next.delete(dateStr);
      } else {
        next.add(dateStr);
        // Give a newly-enabled day a default range if it has none yet.
        setDateTimeRanges((ranges) => (ranges[dateStr] ? ranges : { ...ranges, [dateStr]: defaultRange() }));
      }
      return next;
    });
  }, []);

  const updateTimeRange = useCallback((dateStr: string, range: [dayjs.Dayjs, dayjs.Dayjs] | null) => {
    setDateTimeRanges((prev) => ({ ...prev, [dateStr]: range }));
  }, []);

  /** Build the date-keyed { "YYYY-MM-DD": "HH:mm-HH:mm" } payload from enabled dates. */
  const buildWeeklySchedule = useCallback((): Record<string, string> => {
    const schedule: Record<string, string> = {};
    for (const dateStr of enabledDates) {
      const range = dateTimeRanges[dateStr];
      if (range && range[0] && range[1]) {
        schedule[dateStr] = `${range[0].format('HH:mm')}-${range[1].format('HH:mm')}`;
      }
    }
    return schedule;
  }, [enabledDates, dateTimeRanges]);

  return {
    next7Days,
    enabledDates,
    dateTimeRanges,
    initForCreate,
    initForEdit,
    toggleDate,
    updateTimeRange,
    buildWeeklySchedule,
  };
}
