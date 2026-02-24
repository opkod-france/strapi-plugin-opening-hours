import { Flex, TimePicker, IconButton, Typography } from '@strapi/design-system';
import { Trash } from '@strapi/icons';
import { useIntl } from 'react-intl';

import type { TimeSlot } from '../types';
import { getTrad } from '../utils/getTrad';

interface TimeSlotRowProps {
  slot: TimeSlot;
  slotIndex: number;
  disabled?: boolean;
  onUpdate: (slotIndex: number, field: keyof TimeSlot, time: string) => void;
  onRemove: (slotIndex: number) => void;
  showRemove: boolean;
}

export const TimeSlotRow = ({
  slot,
  slotIndex,
  disabled,
  onUpdate,
  onRemove,
  showRemove,
}: TimeSlotRowProps) => {
  const { formatMessage } = useIntl();

  return (
    <Flex gap={1} alignItems="center">
      <TimePicker
        aria-label={`${formatMessage({ id: getTrad('opens'), defaultMessage: 'Opens' })} ${slotIndex + 1}`}
        value={slot.opens}
        step={15}
        onChange={(value?: string) => onUpdate(slotIndex, 'opens', value ?? '')}
        disabled={disabled}
        size="S"
      />
      <Typography variant="pi" textColor="neutral500">
        {formatMessage({ id: getTrad('timeSlot.to'), defaultMessage: 'to' })}
      </Typography>
      <TimePicker
        aria-label={`${formatMessage({ id: getTrad('closes'), defaultMessage: 'Closes' })} ${slotIndex + 1}`}
        value={slot.closes}
        step={15}
        onChange={(value?: string) => onUpdate(slotIndex, 'closes', value ?? '')}
        disabled={disabled}
        size="S"
      />
      {showRemove && (
        <IconButton
          label={formatMessage({ id: getTrad('removeTimeSlot'), defaultMessage: 'Remove time slot' })}
          onClick={() => onRemove(slotIndex)}
          disabled={disabled}
          variant="ghost"
          size="S"
          withTooltip={false}
        >
          <Trash />
        </IconButton>
      )}
    </Flex>
  );
};
