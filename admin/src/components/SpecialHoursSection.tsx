import { Flex, Box, Button, Typography } from '@strapi/design-system';
import { Plus } from '@strapi/icons';
import { useIntl } from 'react-intl';

import type { OpeningHoursValue, SpecialHoursEntry, TimeSlot } from '../types';
import {
  addSpecialEntry,
  removeSpecialEntry,
  updateSpecialEntry,
  updateSpecialEntryTimeSlot,
  addSpecialEntryTimeSlot,
  removeSpecialEntryTimeSlot,
} from '../utils/openingHoursActions';
import { getTrad } from '../utils/getTrad';
import { SpecialHoursEntryComponent } from './SpecialHoursEntry';

interface SpecialHoursSectionProps {
  value: OpeningHoursValue;
  onChange: (value: OpeningHoursValue) => void;
  disabled?: boolean;
}

export const SpecialHoursSection = ({ value, onChange, disabled }: SpecialHoursSectionProps) => {
  const { formatMessage } = useIntl();

  const handleAdd = () => {
    onChange(addSpecialEntry(value));
  };

  const handleRemove = (entryIndex: number) => {
    onChange(removeSpecialEntry(value, entryIndex));
  };

  const handleUpdate = (entryIndex: number, updates: Partial<SpecialHoursEntry>) => {
    onChange(updateSpecialEntry(value, entryIndex, updates));
  };

  const handleUpdateSlot = (
    entryIndex: number,
    slotIndex: number,
    field: keyof TimeSlot,
    time: string
  ) => {
    onChange(updateSpecialEntryTimeSlot(value, entryIndex, slotIndex, field, time));
  };

  const handleAddSlot = (entryIndex: number) => {
    onChange(addSpecialEntryTimeSlot(value, entryIndex));
  };

  const handleRemoveSlot = (entryIndex: number, slotIndex: number) => {
    onChange(removeSpecialEntryTimeSlot(value, entryIndex, slotIndex));
  };

  return (
    <Flex direction="column" gap={3}>
      {value.specialHours.length === 0 && (
        <Box
          padding={6}
          hasRadius
          background="neutral100"
          style={{ textAlign: 'center' }}
        >
          <Typography variant="omega" textColor="neutral500">
            {formatMessage({
              id: getTrad('preview.noSpecialHours'),
              defaultMessage: 'No special hours defined',
            })}
          </Typography>
        </Box>
      )}

      {value.specialHours.map((entry, index) => (
        <SpecialHoursEntryComponent
          key={index}
          entry={entry}
          entryIndex={index}
          disabled={disabled}
          onUpdate={handleUpdate}
          onRemove={handleRemove}
          onUpdateSlot={handleUpdateSlot}
          onAddSlot={handleAddSlot}
          onRemoveSlot={handleRemoveSlot}
        />
      ))}

      {!disabled && (
        <Button
          variant="secondary"
          startIcon={<Plus />}
          onClick={handleAdd}
          size="S"
          style={{ alignSelf: 'flex-start' }}
        >
          {formatMessage({
            id: getTrad('addSpecialHours'),
            defaultMessage: 'Add special hours',
          })}
        </Button>
      )}
    </Flex>
  );
};
