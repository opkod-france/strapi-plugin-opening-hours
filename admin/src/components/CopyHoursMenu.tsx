import { Flex, Box, SingleSelect, SingleSelectOption, Button, Divider, Typography } from '@strapi/design-system';
import * as React from 'react';
import { useIntl } from 'react-intl';

import type { DaySchedule } from '../types';
import { DAYS_OF_WEEK } from '../types';
import { getTrad } from '../utils/getTrad';

interface CopyHoursMenuProps {
  regularHours: DaySchedule[];
  disabled?: boolean;
  onCopy: (sourceDayIndex: number, target: 'weekdays' | 'all') => void;
}

export const CopyHoursMenu = ({ regularHours, disabled, onCopy }: CopyHoursMenuProps) => {
  const { formatMessage } = useIntl();
  const [sourceDay, setSourceDay] = React.useState<string>('0');
  const [expanded, setExpanded] = React.useState(false);

  if (disabled) return null;

  return (
    <Box paddingTop={2}>
      <Divider />
      {!expanded ? (
        <Box paddingTop={2}>
          <Button variant="tertiary" onClick={() => setExpanded(true)} size="S">
            {formatMessage({ id: getTrad('copyHours'), defaultMessage: 'Copy hours from' })}...
          </Button>
        </Box>
      ) : (
        <Box paddingTop={2}>
          <Typography variant="pi" fontWeight="bold" textColor="neutral600">
            {formatMessage({ id: getTrad('copyHours'), defaultMessage: 'Copy hours from' })}
          </Typography>
          <Flex gap={2} alignItems="flex-end" paddingTop={2} wrap="wrap">
            <Box style={{ minWidth: '140px' }}>
              <SingleSelect
                value={sourceDay}
                onChange={(value: string) => setSourceDay(value)}
                size="S"
              >
                {DAYS_OF_WEEK.map((day, index) => (
                  <SingleSelectOption key={day} value={String(index)}>
                    {formatMessage({ id: getTrad(`day.short.${day}`), defaultMessage: day.slice(0, 3) })}
                  </SingleSelectOption>
                ))}
              </SingleSelect>
            </Box>
            <Button
              variant="secondary"
              onClick={() => { onCopy(Number(sourceDay), 'weekdays'); setExpanded(false); }}
              size="S"
            >
              {formatMessage({ id: getTrad('applyToWeekdays'), defaultMessage: 'Apply to weekdays' })}
            </Button>
            <Button
              variant="secondary"
              onClick={() => { onCopy(Number(sourceDay), 'all'); setExpanded(false); }}
              size="S"
            >
              {formatMessage({ id: getTrad('applyToAll'), defaultMessage: 'Apply to all days' })}
            </Button>
            <Button
              variant="tertiary"
              onClick={() => setExpanded(false)}
              size="S"
            >
              {formatMessage({ id: getTrad('cancel'), defaultMessage: 'Cancel' })}
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};
