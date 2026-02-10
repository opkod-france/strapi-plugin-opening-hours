import type {
  OpeningHoursValue,
  DaySchedule,
  TimeSlot,
  SpecialHoursEntry,
  DayOfWeek,
} from '../types';
import { WEEKDAYS, DAYS_OF_WEEK } from '../types';

export const toggleDay = (
  value: OpeningHoursValue,
  dayIndex: number,
  isOpen: boolean
): OpeningHoursValue => ({
  ...value,
  regularHours: value.regularHours.map((day, i) =>
    i === dayIndex
      ? {
          ...day,
          isOpen,
          timeSlots: isOpen
            ? (day.timeSlots.length === 0 ? [{ opens: '09:00', closes: '17:00' }] : day.timeSlots)
            : [],
        }
      : day
  ),
});

export const updateTimeSlot = (
  value: OpeningHoursValue,
  dayIndex: number,
  slotIndex: number,
  field: keyof TimeSlot,
  time: string
): OpeningHoursValue => ({
  ...value,
  regularHours: value.regularHours.map((day, i) =>
    i === dayIndex
      ? {
          ...day,
          timeSlots: day.timeSlots.map((slot, j) =>
            j === slotIndex ? { ...slot, [field]: time } : slot
          ),
        }
      : day
  ),
});

export const addTimeSlot = (
  value: OpeningHoursValue,
  dayIndex: number
): OpeningHoursValue => ({
  ...value,
  regularHours: value.regularHours.map((day, i) =>
    i === dayIndex
      ? {
          ...day,
          timeSlots: [...day.timeSlots, { opens: '09:00', closes: '17:00' }],
        }
      : day
  ),
});

export const removeTimeSlot = (
  value: OpeningHoursValue,
  dayIndex: number,
  slotIndex: number
): OpeningHoursValue => ({
  ...value,
  regularHours: value.regularHours.map((day, i) =>
    i === dayIndex
      ? {
          ...day,
          timeSlots: day.timeSlots.filter((_, j) => j !== slotIndex),
        }
      : day
  ),
});

export const copyHoursToDays = (
  value: OpeningHoursValue,
  sourceDayIndex: number,
  target: 'weekdays' | 'all'
): OpeningHoursValue => {
  const source = value.regularHours[sourceDayIndex];
  const targetDays: DayOfWeek[] = target === 'weekdays' ? WEEKDAYS : DAYS_OF_WEEK;

  return {
    ...value,
    regularHours: value.regularHours.map((day) =>
      targetDays.includes(day.dayOfWeek) && day.dayOfWeek !== source.dayOfWeek
        ? {
            ...day,
            isOpen: source.isOpen,
            timeSlots: source.timeSlots.map((slot) => ({ ...slot })),
          }
        : day
    ),
  };
};

export const addSpecialEntry = (value: OpeningHoursValue): OpeningHoursValue => ({
  ...value,
  specialHours: [
    ...value.specialHours,
    {
      label: '',
      validFrom: '',
      validThrough: '',
      isOpen: false,
      timeSlots: [],
    },
  ],
});

export const removeSpecialEntry = (
  value: OpeningHoursValue,
  entryIndex: number
): OpeningHoursValue => ({
  ...value,
  specialHours: value.specialHours.filter((_, i) => i !== entryIndex),
});

export const updateSpecialEntry = (
  value: OpeningHoursValue,
  entryIndex: number,
  updates: Partial<SpecialHoursEntry>
): OpeningHoursValue => ({
  ...value,
  specialHours: value.specialHours.map((entry, i) =>
    i === entryIndex ? { ...entry, ...updates } : entry
  ),
});

export const updateSpecialEntryTimeSlot = (
  value: OpeningHoursValue,
  entryIndex: number,
  slotIndex: number,
  field: keyof TimeSlot,
  time: string
): OpeningHoursValue => ({
  ...value,
  specialHours: value.specialHours.map((entry, i) =>
    i === entryIndex
      ? {
          ...entry,
          timeSlots: entry.timeSlots.map((slot, j) =>
            j === slotIndex ? { ...slot, [field]: time } : slot
          ),
        }
      : entry
  ),
});

export const addSpecialEntryTimeSlot = (
  value: OpeningHoursValue,
  entryIndex: number
): OpeningHoursValue => ({
  ...value,
  specialHours: value.specialHours.map((entry, i) =>
    i === entryIndex
      ? {
          ...entry,
          timeSlots: [...entry.timeSlots, { opens: '09:00', closes: '17:00' }],
        }
      : entry
  ),
});

export const removeSpecialEntryTimeSlot = (
  value: OpeningHoursValue,
  entryIndex: number,
  slotIndex: number
): OpeningHoursValue => ({
  ...value,
  specialHours: value.specialHours.map((entry, i) =>
    i === entryIndex
      ? {
          ...entry,
          timeSlots: entry.timeSlots.filter((_, j) => j !== slotIndex),
        }
      : entry
  ),
});
