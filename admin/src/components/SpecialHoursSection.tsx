import { Flex, Box, Button, Typography } from '@strapi/design-system';
import { Plus, Calendar } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { styled } from 'styled-components';

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

const IconCircle = styled(Flex)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.neutral200};
`;

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
    <Flex direction="column" gap={2}>
      {value.specialHours.length === 0 && (
        <Box
          padding={6}
          hasRadius
          background="neutral100"
          style={{ textAlign: 'center' }}
        >
          <Flex direction="column" alignItems="center" gap={2}>
            <IconCircle justifyContent="center" alignItems="center">
              <Calendar width={20} height={20} />
            </IconCircle>
            <Typography variant="omega" fontWeight="bold" textColor="neutral600">
              {formatMessage({
                id: getTrad('specialHours.emptyTitle'),
                defaultMessage: 'No special hours yet',
              })}
            </Typography>
            <Typography variant="pi" textColor="neutral500">
              {formatMessage({
                id: getTrad('specialHours.emptyDescription'),
                defaultMessage: 'Add special hours for holidays, seasonal changes, or one-time events.',
              })}
            </Typography>
          </Flex>
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
