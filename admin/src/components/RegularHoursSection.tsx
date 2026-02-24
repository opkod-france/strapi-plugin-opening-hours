import { Box, Divider } from '@strapi/design-system';
import * as React from 'react';

import type { OpeningHoursValue, TimeSlot } from '../types';
import {
  toggleDay,
  updateTimeSlot,
  addTimeSlot,
  removeTimeSlot,
  copyHoursToDays,
} from '../utils/openingHoursActions';
import { CopyHoursMenu } from './CopyHoursMenu';
import { DayRow } from './DayRow';

interface RegularHoursSectionProps {
  value: OpeningHoursValue;
  onChange: (value: OpeningHoursValue) => void;
  disabled?: boolean;
}

export const RegularHoursSection = ({ value, onChange, disabled }: RegularHoursSectionProps) => {
  const handleToggle = (dayIndex: number, isOpen: boolean) => {
    onChange(toggleDay(value, dayIndex, isOpen));
  };

  const handleUpdateSlot = (
    dayIndex: number,
    slotIndex: number,
    field: keyof TimeSlot,
    time: string
  ) => {
    onChange(updateTimeSlot(value, dayIndex, slotIndex, field, time));
  };

  const handleAddSlot = (dayIndex: number) => {
    onChange(addTimeSlot(value, dayIndex));
  };

  const handleRemoveSlot = (dayIndex: number, slotIndex: number) => {
    onChange(removeTimeSlot(value, dayIndex, slotIndex));
  };

  const handleCopy = (sourceDayIndex: number, target: 'weekdays' | 'all') => {
    onChange(copyHoursToDays(value, sourceDayIndex, target));
  };

  return (
    <Box>
      {value.regularHours.map((day, index) => (
        <React.Fragment key={day.dayOfWeek}>
          {index === 5 && <Box paddingTop={1} paddingBottom={1}><Divider /></Box>}
          <DayRow
            day={day}
            dayIndex={index}
            disabled={disabled}
            isWeekend={index >= 5}
            onToggle={handleToggle}
            onUpdateSlot={handleUpdateSlot}
            onAddSlot={handleAddSlot}
            onRemoveSlot={handleRemoveSlot}
          />
          {index < value.regularHours.length - 1 && index !== 4 && <Divider />}
        </React.Fragment>
      ))}
      <CopyHoursMenu
        regularHours={value.regularHours}
        disabled={disabled}
        onCopy={handleCopy}
      />
    </Box>
  );
};
