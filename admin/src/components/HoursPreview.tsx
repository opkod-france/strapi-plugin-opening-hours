import { Box, Flex, Typography, Badge, Divider } from '@strapi/design-system';
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

const PreviewRow = styled(Flex)`
  &:nth-child(even) {
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
          {value.regularHours.map((day) => {
            const dayLabel = formatMessage({
              id: getTrad(`day.short.${day.dayOfWeek}`),
              defaultMessage: day.dayOfWeek.slice(0, 3),
            });

            return (
              <PreviewRow
                key={day.dayOfWeek}
                justifyContent="space-between"
                alignItems="center"
                paddingTop={2}
                paddingBottom={2}
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
            <Typography variant="pi" textColor="neutral400">
              {formatMessage({
                id: getTrad('preview.noSpecialHours'),
                defaultMessage: 'No special hours defined',
              })}
            </Typography>
          ) : (
            value.specialHours.map((entry, index) => (
              <Flex
                key={index}
                justifyContent="space-between"
                alignItems="center"
                paddingTop={2}
                paddingBottom={2}
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
              </Flex>
            ))
          )}
        </Box>
      </Box>
    </Flex>
  );
};
