import type { OpeningHoursValue, DayOfWeek } from '../types';
import { DAYS_OF_WEEK } from '../types';

const DEFAULT_OPEN: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const createDefaultSchedule = (): OpeningHoursValue => ({
  regularHours: DAYS_OF_WEEK.map((day) => ({
    dayOfWeek: day,
    isOpen: DEFAULT_OPEN.includes(day),
    timeSlots: DEFAULT_OPEN.includes(day) ? [{ opens: '09:00', closes: '17:00' }] : [],
  })),
  specialHours: [],
});
