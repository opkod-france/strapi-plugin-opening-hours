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
  isWeekend: boolean;
  onToggle: (dayIndex: number, isOpen: boolean) => void;
  onUpdateSlot: (dayIndex: number, slotIndex: number, field: keyof TimeSlot, time: string) => void;
  onAddSlot: (dayIndex: number) => void;
  onRemoveSlot: (dayIndex: number, slotIndex: number) => void;
}

const DayRowContainer = styled(Flex)<{ $isOpen: boolean; $isWeekend: boolean }>`
  transition: opacity 0.15s ease, background-color 0.15s ease;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0.55)};
  border-left: 3px solid ${({ $isOpen, theme }) =>
    $isOpen ? theme.colors.success500 : theme.colors.neutral300};
  background-color: ${({ $isWeekend, theme }) =>
    $isWeekend ? theme.colors.neutral100 : 'transparent'};

  &:hover {
    opacity: 1;
    background-color: ${({ $isWeekend, theme }) =>
      $isWeekend ? theme.colors.neutral200 : theme.colors.neutral100};
  }
`;

const DayLabel = styled(Typography)`
  min-width: 32px;
  user-select: none;
`;

export const DayRow = ({
  day,
  dayIndex,
  disabled,
  isWeekend,
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
      $isWeekend={isWeekend}
      gap={3}
      alignItems="center"
      paddingTop={1}
      paddingBottom={1}
      paddingLeft={2}
      paddingRight={2}
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
