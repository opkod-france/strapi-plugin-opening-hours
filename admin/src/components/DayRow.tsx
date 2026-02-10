import { Flex, Box, Checkbox, Badge, Typography, IconButton } from '@strapi/design-system';
import { Plus } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { styled } from 'styled-components';

import type { DaySchedule, TimeSlot } from '../types';
import { getTrad } from '../utils/getTrad';
import { TimeSlotRow } from './TimeSlotRow';

interface DayRowProps {
  day: DaySchedule;
  dayIndex: number;
  disabled?: boolean;
  onToggle: (dayIndex: number, isOpen: boolean) => void;
  onUpdateSlot: (dayIndex: number, slotIndex: number, field: keyof TimeSlot, time: string) => void;
  onAddSlot: (dayIndex: number) => void;
  onRemoveSlot: (dayIndex: number, slotIndex: number) => void;
}

const DayRowContainer = styled(Flex)<{ $isOpen: boolean }>`
  transition: opacity 0.15s ease;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0.55)};

  &:hover {
    opacity: 1;
  }
`;

const DayLabel = styled(Typography)`
  min-width: 36px;
  user-select: none;
`;

export const DayRow = ({
  day,
  dayIndex,
  disabled,
  onToggle,
  onUpdateSlot,
  onAddSlot,
  onRemoveSlot,
}: DayRowProps) => {
  const { formatMessage } = useIntl();

  const shortLabel = formatMessage({
    id: getTrad(`day.short.${day.dayOfWeek}`),
    defaultMessage: day.dayOfWeek.slice(0, 3),
  });

  return (
    <DayRowContainer
      $isOpen={day.isOpen}
      gap={3}
      alignItems="center"
      paddingTop={2}
      paddingBottom={2}
      paddingLeft={3}
      paddingRight={3}
      wrap="wrap"
    >
      <Checkbox
        checked={day.isOpen}
        onCheckedChange={(checked: boolean) => onToggle(dayIndex, checked)}
        disabled={disabled}
      />

      <DayLabel variant="omega" fontWeight="bold" textColor={day.isOpen ? 'neutral800' : 'neutral500'}>
        {shortLabel}
      </DayLabel>

      {day.isOpen ? (
        <Flex gap={2} alignItems="center" wrap="wrap" style={{ flex: 1 }}>
          {day.timeSlots.map((slot, slotIndex) => (
            <TimeSlotRow
              key={slotIndex}
              slot={slot}
              slotIndex={slotIndex}
              disabled={disabled}
              onUpdate={(si, field, time) => onUpdateSlot(dayIndex, si, field, time)}
              onRemove={(si) => onRemoveSlot(dayIndex, si)}
              showRemove={day.timeSlots.length > 1}
            />
          ))}
          {!disabled && (
            <IconButton
              label={formatMessage({
                id: getTrad('addTimeSlot'),
                defaultMessage: 'Add time slot',
              })}
              onClick={() => onAddSlot(dayIndex)}
              variant="ghost"
              size="S"
              withTooltip={false}
            >
              <Plus />
            </IconButton>
          )}
        </Flex>
      ) : (
        <Badge variant="neutral" size="S">
          {formatMessage({ id: getTrad('closed'), defaultMessage: 'Closed' })}
        </Badge>
      )}
    </DayRowContainer>
  );
};
