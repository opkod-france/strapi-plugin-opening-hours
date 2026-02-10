import {
  Flex,
  Box,
  TextInput,
  DatePicker,
  Checkbox,
  Button,
  IconButton,
  Typography,
  Badge,
  Divider,
} from '@strapi/design-system';
import { Trash, Plus } from '@strapi/icons';
import { useIntl } from 'react-intl';

import type { SpecialHoursEntry as SpecialHoursEntryType, TimeSlot } from '../types';
import { getTrad } from '../utils/getTrad';
import { TimeSlotRow } from './TimeSlotRow';

interface SpecialHoursEntryProps {
  entry: SpecialHoursEntryType;
  entryIndex: number;
  disabled?: boolean;
  onUpdate: (entryIndex: number, updates: Partial<SpecialHoursEntryType>) => void;
  onRemove: (entryIndex: number) => void;
  onUpdateSlot: (entryIndex: number, slotIndex: number, field: keyof TimeSlot, time: string) => void;
  onAddSlot: (entryIndex: number) => void;
  onRemoveSlot: (entryIndex: number, slotIndex: number) => void;
}

export const SpecialHoursEntryComponent = ({
  entry,
  entryIndex,
  disabled,
  onUpdate,
  onRemove,
  onUpdateSlot,
  onAddSlot,
  onRemoveSlot,
}: SpecialHoursEntryProps) => {
  const { formatMessage } = useIntl();

  return (
    <Box
      padding={4}
      hasRadius
      background="neutral0"
      borderColor="neutral200"
      shadow="filterShadow"
    >
      <Flex direction="column" gap={3}>
        {/* Header */}
        <Flex justifyContent="space-between" alignItems="center">
          <Flex gap={2} alignItems="center">
            <Badge variant={entry.isOpen ? 'success' : 'neutral'} size="S">
              {entry.isOpen
                ? formatMessage({ id: getTrad('open'), defaultMessage: 'Open' })
                : formatMessage({ id: getTrad('closed'), defaultMessage: 'Closed' })}
            </Badge>
            <Typography variant="omega" fontWeight="bold">
              {entry.label || formatMessage({ id: getTrad('specialHours.label.placeholder'), defaultMessage: 'e.g. Christmas Eve' })}
            </Typography>
          </Flex>
          {!disabled && (
            <IconButton
              label={formatMessage({ id: getTrad('removeSpecialHours'), defaultMessage: 'Remove' })}
              onClick={() => onRemove(entryIndex)}
              variant="ghost"
              size="S"
              withTooltip={false}
            >
              <Trash />
            </IconButton>
          )}
        </Flex>

        <Divider />

        {/* Label + dates on same row */}
        <Flex gap={3} wrap="wrap">
          <Box style={{ flex: 2, minWidth: '160px' }}>
            <TextInput
              label={formatMessage({ id: getTrad('specialHours.label'), defaultMessage: 'Label' })}
              value={entry.label}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onUpdate(entryIndex, { label: e.target.value })
              }
              placeholder={formatMessage({
                id: getTrad('specialHours.label.placeholder'),
                defaultMessage: 'e.g. Christmas Eve',
              })}
              disabled={disabled}
              size="S"
            />
          </Box>
          <Box style={{ flex: 1, minWidth: '130px' }}>
            <DatePicker
              label={formatMessage({ id: getTrad('specialHours.validFrom'), defaultMessage: 'From' })}
              value={entry.validFrom ? new Date(entry.validFrom) : undefined}
              onChange={(date: Date | undefined) =>
                onUpdate(entryIndex, {
                  validFrom: date ? date.toISOString().split('T')[0] : '',
                })
              }
              disabled={disabled}
            />
          </Box>
          <Box style={{ flex: 1, minWidth: '130px' }}>
            <DatePicker
              label={formatMessage({ id: getTrad('specialHours.validThrough'), defaultMessage: 'Through' })}
              value={entry.validThrough ? new Date(entry.validThrough) : undefined}
              onChange={(date: Date | undefined) =>
                onUpdate(entryIndex, {
                  validThrough: date ? date.toISOString().split('T')[0] : '',
                })
              }
              disabled={disabled}
            />
          </Box>
        </Flex>

        {/* Open toggle + time slots */}
        <Flex gap={3} alignItems="center" wrap="wrap">
          <Checkbox
            checked={entry.isOpen}
            onCheckedChange={(checked: boolean) => {
              const updates: Partial<SpecialHoursEntryType> = { isOpen: checked };
              if (checked) {
                if (entry.timeSlots.length === 0) {
                  updates.timeSlots = [{ opens: '09:00', closes: '17:00' }];
                }
              } else {
                updates.timeSlots = [];
              }
              onUpdate(entryIndex, updates);
            }}
            disabled={disabled}
          >
            <Typography variant="omega" textColor="neutral600">
              {formatMessage({ id: getTrad('specialHours.isOpen'), defaultMessage: 'Open' })}
            </Typography>
          </Checkbox>

          {entry.isOpen && (
            <Flex gap={2} alignItems="center" wrap="wrap" style={{ flex: 1 }}>
              {entry.timeSlots.map((slot, slotIndex) => (
                <TimeSlotRow
                  key={slotIndex}
                  slot={slot}
                  slotIndex={slotIndex}
                  disabled={disabled}
                  onUpdate={(si, field, time) => onUpdateSlot(entryIndex, si, field, time)}
                  onRemove={(si) => onRemoveSlot(entryIndex, si)}
                  showRemove={entry.timeSlots.length > 1}
                />
              ))}
              {!disabled && (
                <IconButton
                  label={formatMessage({
                    id: getTrad('addTimeSlot'),
                    defaultMessage: 'Add time slot',
                  })}
                  onClick={() => onAddSlot(entryIndex)}
                  variant="ghost"
                  size="S"
                  withTooltip={false}
                >
                  <Plus />
                </IconButton>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};
