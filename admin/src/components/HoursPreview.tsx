import { Box, Flex, Typography, Badge, Divider } from '@strapi/design-system';
import { Information } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { styled } from 'styled-components';

import type { OpeningHoursValue, TimeSlot } from '../types';
import { getTrad } from '../utils/getTrad';

interface HoursPreviewProps {
  value: OpeningHoursValue;
}

const formatSlots = (slots: TimeSlot[]): string => {
  return slots.map((slot) => `${slot.opens} – ${slot.closes}`).join(', ');
};

const PreviewRow = styled(Flex)<{ $isOpen: boolean; $isWeekend: boolean }>`
  border-left: 3px solid ${({ $isOpen, theme }) =>
    $isOpen ? theme.colors.success500 : theme.colors.neutral300};
  background-color: ${({ $isWeekend, theme }) =>
    $isWeekend ? theme.colors.neutral100 : 'transparent'};
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ $isWeekend, theme }) =>
      $isWeekend ? theme.colors.neutral200 : theme.colors.neutral100};
  }
`;

const SpecialPreviewRow = styled(Flex)<{ $isOpen: boolean }>`
  border-left: 3px solid ${({ $isOpen, theme }) =>
    $isOpen ? theme.colors.success500 : theme.colors.danger500};
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral100};
  }
`;

export const HoursPreview = ({ value }: HoursPreviewProps) => {
  const { formatMessage } = useIntl();

  return (
    <Flex direction="column" gap={4}>
      {/* Regular Hours */}
      <Box>
        <Typography variant="sigma" textColor="neutral600" textTransform="uppercase">
          {formatMessage({ id: getTrad('preview.regularHours'), defaultMessage: 'Regular Hours' })}
        </Typography>

        <Box paddingTop={2} hasRadius overflow="hidden">
          {value.regularHours.map((day, index) => {
            const dayLabel = formatMessage({
              id: getTrad(`day.short.${day.dayOfWeek}`),
              defaultMessage: day.dayOfWeek.slice(0, 3),
            });
            const isWeekend = index >= 5;

            return (
              <PreviewRow
                key={day.dayOfWeek}
                $isOpen={day.isOpen}
                $isWeekend={isWeekend}
                justifyContent="space-between"
                alignItems="center"
                paddingTop={1}
                paddingBottom={1}
                paddingLeft={3}
                paddingRight={3}
              >
                <Flex gap={2} alignItems="center" style={{ minWidth: '100px' }}>
                  <Typography fontWeight="bold" variant="omega">
                    {dayLabel}
                  </Typography>
                </Flex>
                {day.isOpen ? (
                  <Flex gap={2} alignItems="center">
                    <Typography variant="omega">{formatSlots(day.timeSlots)}</Typography>
                    <Badge variant="success" size="S">
                      {formatMessage({ id: getTrad('open'), defaultMessage: 'Open' })}
                    </Badge>
                  </Flex>
                ) : (
                  <Badge variant="neutral" size="S">
                    {formatMessage({ id: getTrad('closed'), defaultMessage: 'Closed' })}
                  </Badge>
                )}
              </PreviewRow>
            );
          })}
        </Box>
      </Box>

      {/* Special Hours */}
      <Box>
        <Typography variant="sigma" textColor="neutral600" textTransform="uppercase">
          {formatMessage({ id: getTrad('preview.specialHours'), defaultMessage: 'Special Hours' })}
        </Typography>

        <Box paddingTop={2}>
          {value.specialHours.length === 0 ? (
            <Flex gap={2} alignItems="center" paddingLeft={3} paddingTop={1}>
              <Information width={16} height={16} />
              <Typography variant="pi" textColor="neutral400">
                {formatMessage({
                  id: getTrad('preview.noSpecialHours'),
                  defaultMessage: 'No special hours defined',
                })}
              </Typography>
            </Flex>
          ) : (
            value.specialHours.map((entry, index) => (
              <SpecialPreviewRow
                key={index}
                $isOpen={entry.isOpen}
                justifyContent="space-between"
                alignItems="center"
                paddingTop={1}
                paddingBottom={1}
                paddingLeft={3}
                paddingRight={3}
              >
                <Flex gap={2} alignItems="center">
                  <Typography fontWeight="bold" variant="omega">
                    {entry.label || '—'}
                  </Typography>
                  {entry.validFrom && (
                    <Typography variant="pi" textColor="neutral500">
                      {entry.validFrom === entry.validThrough
                        ? entry.validFrom
                        : `${entry.validFrom} → ${entry.validThrough}`}
                    </Typography>
                  )}
                </Flex>
                {entry.isOpen ? (
                  <Flex gap={2} alignItems="center">
                    <Typography variant="omega">{formatSlots(entry.timeSlots)}</Typography>
                    <Badge variant="success" size="S">
                      {formatMessage({ id: getTrad('open'), defaultMessage: 'Open' })}
                    </Badge>
                  </Flex>
                ) : (
                  <Badge variant="neutral" size="S">
                    {formatMessage({ id: getTrad('closed'), defaultMessage: 'Closed' })}
                  </Badge>
                )}
              </SpecialPreviewRow>
            ))
          )}
        </Box>
      </Box>
    </Flex>
  );
};
