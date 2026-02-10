import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { IntlProvider } from 'react-intl';
import { lightTheme } from '@strapi/design-system';

export const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={{}}>
    <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
  </IntlProvider>
);
