import * as React from 'react';

import { Field, Flex, Tabs, Box } from '@strapi/design-system';
import { type InputProps, useField } from '@strapi/strapi/admin';
import { useIntl } from 'react-intl';
import { styled } from 'styled-components';

import type { OpeningHoursValue } from '../types';
import { createDefaultSchedule } from '../utils/defaults';
import { getTrad } from '../utils/getTrad';
import { HoursPreview } from './HoursPreview';
import { RegularHoursSection } from './RegularHoursSection';
import { SpecialHoursSection } from './SpecialHoursSection';

type OpeningHoursInputProps = InputProps & {
  labelAction?: React.ReactNode;
};

const InputContainer = styled(Box)`
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme }) => theme.colors.neutral0};
  overflow: hidden;
`;

export const OpeningHoursInput = React.forwardRef<HTMLDivElement, OpeningHoursInputProps>(
  ({ hint, disabled, labelAction, label, name, required }, forwardedRef) => {
    const { formatMessage } = useIntl();
    const field = useField<OpeningHoursValue | null>(name);

    const value: OpeningHoursValue = React.useMemo(() => {
      if (field.value && typeof field.value === 'object' && 'regularHours' in field.value) {
        return field.value;
      }
      return createDefaultSchedule();
    }, [field.value]);

    const hasInitialized = React.useRef(false);
    React.useEffect(() => {
      if (!hasInitialized.current && !field.value) {
        const defaultValue = createDefaultSchedule();
        field.onChange(name, defaultValue);
        hasInitialized.current = true;
      }
    }, [field, name]);

    const handleChange = React.useCallback(
      (newValue: OpeningHoursValue) => {
        field.onChange(name, newValue);
      },
      [field, name]
    );

    return (
      <Field.Root
        name={name}
        id={name}
        error={field.error}
        hint={hint}
        required={required}
        ref={forwardedRef}
      >
        <Flex direction="column" alignItems="stretch" gap={1}>
          <Field.Label action={labelAction}>{label}</Field.Label>

          <InputContainer>
            <Tabs.Root defaultValue="regular">
              <Box
                paddingLeft={3}
                paddingRight={3}
                background="neutral100"
                borderColor="neutral200"
                style={{ borderBottom: '1px solid' }}
              >
                <Tabs.List>
                  <Tabs.Trigger value="regular">
                    {formatMessage({ id: getTrad('tab.regular'), defaultMessage: 'Regular Hours' })}
                  </Tabs.Trigger>
                  <Tabs.Trigger value="special">
                    {formatMessage({ id: getTrad('tab.special'), defaultMessage: 'Special Hours' })}
                  </Tabs.Trigger>
                  <Tabs.Trigger value="preview">
                    {formatMessage({ id: getTrad('tab.preview'), defaultMessage: 'Preview' })}
                  </Tabs.Trigger>
                </Tabs.List>
              </Box>

              <Box padding={3}>
                <Tabs.Content value="regular">
                  <RegularHoursSection
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                  />
                </Tabs.Content>

                <Tabs.Content value="special">
                  <SpecialHoursSection
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                  />
                </Tabs.Content>

                <Tabs.Content value="preview">
                  <HoursPreview value={value} />
                </Tabs.Content>
              </Box>
            </Tabs.Root>
          </InputContainer>

          <Field.Hint />
          <Field.Error />
        </Flex>
      </Field.Root>
    );
  }
);
