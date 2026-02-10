export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface TimeSlot {
  opens: string;
  closes: string;
}

export interface DaySchedule {
  dayOfWeek: DayOfWeek;
  isOpen: boolean;
  timeSlots: TimeSlot[];
}

export interface SpecialHoursEntry {
  label: string;
  validFrom: string;
  validThrough: string;
  isOpen: boolean;
  timeSlots: TimeSlot[];
}

export interface OpeningHoursValue {
  regularHours: DaySchedule[];
  specialHours: SpecialHoursEntry[];
}

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const WEEKDAYS: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];
