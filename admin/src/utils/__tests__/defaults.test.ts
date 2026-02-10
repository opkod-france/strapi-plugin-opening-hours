import { createDefaultSchedule } from '../defaults';

describe('createDefaultSchedule', () => {
  it('creates a schedule with 7 days', () => {
    const schedule = createDefaultSchedule();
    expect(schedule.regularHours).toHaveLength(7);
  });

  it('has days in correct order', () => {
    const schedule = createDefaultSchedule();
    const days = schedule.regularHours.map((d) => d.dayOfWeek);
    expect(days).toEqual([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]);
  });

  it('sets Mon-Sat as open and Sunday as closed', () => {
    const schedule = createDefaultSchedule();
    const openDays = schedule.regularHours.filter((d) => d.isOpen).map((d) => d.dayOfWeek);
    expect(openDays).toEqual(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);

    const sunday = schedule.regularHours.find((d) => d.dayOfWeek === 'Sunday');
    expect(sunday?.isOpen).toBe(false);
  });

  it('sets default time slot 09:00-17:00 for open days', () => {
    const schedule = createDefaultSchedule();
    const monday = schedule.regularHours[0];
    expect(monday.timeSlots).toEqual([{ opens: '09:00', closes: '17:00' }]);
  });

  it('sets empty time slots for closed days', () => {
    const schedule = createDefaultSchedule();
    const sunday = schedule.regularHours[6];
    expect(sunday.timeSlots).toEqual([]);
  });

  it('starts with no special hours', () => {
    const schedule = createDefaultSchedule();
    expect(schedule.specialHours).toEqual([]);
  });
});
