import {
  toggleDay,
  updateTimeSlot,
  addTimeSlot,
  removeTimeSlot,
  copyHoursToDays,
  addSpecialEntry,
  removeSpecialEntry,
  updateSpecialEntry,
  updateSpecialEntryTimeSlot,
  addSpecialEntryTimeSlot,
  removeSpecialEntryTimeSlot,
} from '../openingHoursActions';
import { createDefaultSchedule } from '../defaults';
import type { OpeningHoursValue } from '../../types';

const makeSchedule = (): OpeningHoursValue => createDefaultSchedule();

describe('toggleDay', () => {
  it('toggles a day to closed and clears time slots', () => {
    const schedule = makeSchedule();
    const result = toggleDay(schedule, 0, false); // Monday -> closed

    expect(result.regularHours[0].isOpen).toBe(false);
    expect(result.regularHours[0].timeSlots).toEqual([]);
  });

  it('toggles a day to open and adds default slot when empty', () => {
    const schedule = makeSchedule();
    const result = toggleDay(schedule, 6, true); // Sunday -> open

    expect(result.regularHours[6].isOpen).toBe(true);
    expect(result.regularHours[6].timeSlots).toEqual([{ opens: '09:00', closes: '17:00' }]);
  });

  it('preserves existing time slots when toggling to open', () => {
    const schedule = makeSchedule();
    // Monday already has slots
    const result = toggleDay(schedule, 0, true);

    expect(result.regularHours[0].timeSlots).toEqual([{ opens: '09:00', closes: '17:00' }]);
  });

  it('does not mutate the original value', () => {
    const schedule = makeSchedule();
    const original = JSON.parse(JSON.stringify(schedule));
    toggleDay(schedule, 0, false);

    expect(schedule).toEqual(original);
  });
});

describe('updateTimeSlot', () => {
  it('updates the opens time', () => {
    const schedule = makeSchedule();
    const result = updateTimeSlot(schedule, 0, 0, 'opens', '10:00');

    expect(result.regularHours[0].timeSlots[0].opens).toBe('10:00');
    expect(result.regularHours[0].timeSlots[0].closes).toBe('17:00');
  });

  it('updates the closes time', () => {
    const schedule = makeSchedule();
    const result = updateTimeSlot(schedule, 0, 0, 'closes', '18:30');

    expect(result.regularHours[0].timeSlots[0].closes).toBe('18:30');
    expect(result.regularHours[0].timeSlots[0].opens).toBe('09:00');
  });

  it('does not affect other days', () => {
    const schedule = makeSchedule();
    const result = updateTimeSlot(schedule, 0, 0, 'opens', '10:00');

    expect(result.regularHours[1].timeSlots[0].opens).toBe('09:00');
  });
});

describe('addTimeSlot', () => {
  it('adds a new time slot with default values', () => {
    const schedule = makeSchedule();
    const result = addTimeSlot(schedule, 0);

    expect(result.regularHours[0].timeSlots).toHaveLength(2);
    expect(result.regularHours[0].timeSlots[1]).toEqual({ opens: '09:00', closes: '17:00' });
  });

  it('does not affect other days', () => {
    const schedule = makeSchedule();
    const result = addTimeSlot(schedule, 0);

    expect(result.regularHours[1].timeSlots).toHaveLength(1);
  });
});

describe('removeTimeSlot', () => {
  it('removes a time slot by index', () => {
    const schedule = makeSchedule();
    const withTwo = addTimeSlot(schedule, 0);
    const result = removeTimeSlot(withTwo, 0, 0);

    expect(result.regularHours[0].timeSlots).toHaveLength(1);
    expect(result.regularHours[0].timeSlots[0]).toEqual({ opens: '09:00', closes: '17:00' });
  });

  it('can remove the last time slot', () => {
    const schedule = makeSchedule();
    const result = removeTimeSlot(schedule, 0, 0);

    expect(result.regularHours[0].timeSlots).toHaveLength(0);
  });
});

describe('copyHoursToDays', () => {
  it('copies hours to weekdays', () => {
    const schedule = makeSchedule();
    // Set Monday to special hours
    const modified = updateTimeSlot(schedule, 0, 0, 'opens', '07:00');
    const result = copyHoursToDays(modified, 0, 'weekdays');

    // Tue-Fri should match Monday
    for (let i = 1; i <= 4; i++) {
      expect(result.regularHours[i].timeSlots[0].opens).toBe('07:00');
      expect(result.regularHours[i].isOpen).toBe(true);
    }
    // Saturday and Sunday should be unchanged
    expect(result.regularHours[5].timeSlots[0].opens).toBe('09:00');
  });

  it('copies hours to all days', () => {
    const schedule = makeSchedule();
    const modified = updateTimeSlot(schedule, 0, 0, 'closes', '22:00');
    const result = copyHoursToDays(modified, 0, 'all');

    for (let i = 1; i <= 6; i++) {
      expect(result.regularHours[i].timeSlots[0].closes).toBe('22:00');
      expect(result.regularHours[i].isOpen).toBe(true);
    }
  });

  it('copies closed status to target days', () => {
    const schedule = makeSchedule();
    const closed = toggleDay(schedule, 0, false); // close Monday
    const result = copyHoursToDays(closed, 0, 'weekdays');

    for (let i = 1; i <= 4; i++) {
      expect(result.regularHours[i].isOpen).toBe(false);
      expect(result.regularHours[i].timeSlots).toEqual([]);
    }
  });

  it('does not modify the source day itself', () => {
    const schedule = makeSchedule();
    const result = copyHoursToDays(schedule, 0, 'all');

    expect(result.regularHours[0]).toEqual(schedule.regularHours[0]);
  });
});

describe('special hours actions', () => {
  describe('addSpecialEntry', () => {
    it('adds a blank special entry', () => {
      const schedule = makeSchedule();
      const result = addSpecialEntry(schedule);

      expect(result.specialHours).toHaveLength(1);
      expect(result.specialHours[0]).toEqual({
        label: '',
        validFrom: '',
        validThrough: '',
        isOpen: false,
        timeSlots: [],
      });
    });

    it('appends to existing entries', () => {
      const schedule = makeSchedule();
      const one = addSpecialEntry(schedule);
      const two = addSpecialEntry(one);

      expect(two.specialHours).toHaveLength(2);
    });
  });

  describe('removeSpecialEntry', () => {
    it('removes by index', () => {
      const schedule = makeSchedule();
      const withTwo = addSpecialEntry(addSpecialEntry(schedule));
      const updated = updateSpecialEntry(withTwo, 0, { label: 'First' });
      const updated2 = updateSpecialEntry(updated, 1, { label: 'Second' });
      const result = removeSpecialEntry(updated2, 0);

      expect(result.specialHours).toHaveLength(1);
      expect(result.specialHours[0].label).toBe('Second');
    });
  });

  describe('updateSpecialEntry', () => {
    it('updates label', () => {
      const schedule = addSpecialEntry(makeSchedule());
      const result = updateSpecialEntry(schedule, 0, { label: 'Christmas Eve' });

      expect(result.specialHours[0].label).toBe('Christmas Eve');
    });

    it('updates multiple fields at once', () => {
      const schedule = addSpecialEntry(makeSchedule());
      const result = updateSpecialEntry(schedule, 0, {
        label: 'Holiday',
        validFrom: '2025-12-25',
        validThrough: '2025-12-25',
        isOpen: false,
      });

      expect(result.specialHours[0]).toMatchObject({
        label: 'Holiday',
        validFrom: '2025-12-25',
        validThrough: '2025-12-25',
        isOpen: false,
      });
    });
  });

  describe('updateSpecialEntryTimeSlot', () => {
    it('updates a time slot in a special entry', () => {
      const schedule = addSpecialEntry(makeSchedule());
      const withSlot = updateSpecialEntry(schedule, 0, {
        isOpen: true,
        timeSlots: [{ opens: '09:00', closes: '17:00' }],
      });
      const result = updateSpecialEntryTimeSlot(withSlot, 0, 0, 'opens', '10:00');

      expect(result.specialHours[0].timeSlots[0].opens).toBe('10:00');
    });
  });

  describe('addSpecialEntryTimeSlot', () => {
    it('adds a time slot to a special entry', () => {
      const schedule = addSpecialEntry(makeSchedule());
      const withSlot = updateSpecialEntry(schedule, 0, {
        isOpen: true,
        timeSlots: [{ opens: '09:00', closes: '12:00' }],
      });
      const result = addSpecialEntryTimeSlot(withSlot, 0);

      expect(result.specialHours[0].timeSlots).toHaveLength(2);
    });
  });

  describe('removeSpecialEntryTimeSlot', () => {
    it('removes a time slot from a special entry', () => {
      const schedule = addSpecialEntry(makeSchedule());
      const withSlots = updateSpecialEntry(schedule, 0, {
        isOpen: true,
        timeSlots: [
          { opens: '09:00', closes: '12:00' },
          { opens: '14:00', closes: '18:00' },
        ],
      });
      const result = removeSpecialEntryTimeSlot(withSlots, 0, 0);

      expect(result.specialHours[0].timeSlots).toHaveLength(1);
      expect(result.specialHours[0].timeSlots[0].opens).toBe('14:00');
    });
  });
});
