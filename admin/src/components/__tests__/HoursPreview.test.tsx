import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { HoursPreview } from '../HoursPreview';
import { Wrapper } from './test-utils';
import { createDefaultSchedule } from '../../utils/defaults';
import { addSpecialEntry, updateSpecialEntry } from '../../utils/openingHoursActions';

describe('HoursPreview', () => {
  it('renders all 7 day labels', () => {
    const value = createDefaultSchedule();
    render(<HoursPreview value={value} />, { wrapper: Wrapper });

    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
    expect(screen.getByText('Wed')).toBeInTheDocument();
    expect(screen.getByText('Thu')).toBeInTheDocument();
    expect(screen.getByText('Fri')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();
    expect(screen.getByText('Sun')).toBeInTheDocument();
  });

  it('shows Closed badge for closed days', () => {
    const value = createDefaultSchedule();
    render(<HoursPreview value={value} />, { wrapper: Wrapper });

    const closedBadges = screen.getAllByText('Closed');
    expect(closedBadges.length).toBeGreaterThanOrEqual(1);
  });

  it('shows time ranges for open days', () => {
    const value = createDefaultSchedule();
    render(<HoursPreview value={value} />, { wrapper: Wrapper });

    const timeRanges = screen.getAllByText('09:00 – 17:00');
    expect(timeRanges.length).toBeGreaterThanOrEqual(1);
  });

  it('shows "No special hours defined" when none exist', () => {
    const value = createDefaultSchedule();
    render(<HoursPreview value={value} />, { wrapper: Wrapper });

    expect(screen.getByText('No special hours defined')).toBeInTheDocument();
  });

  it('shows special hours entries when they exist', () => {
    let value = createDefaultSchedule();
    value = addSpecialEntry(value);
    value = updateSpecialEntry(value, 0, {
      label: 'Christmas',
      validFrom: '2025-12-25',
      validThrough: '2025-12-25',
      isOpen: false,
    });
    render(<HoursPreview value={value} />, { wrapper: Wrapper });

    expect(screen.getByText('Christmas')).toBeInTheDocument();
    expect(screen.getByText('2025-12-25')).toBeInTheDocument();
  });
});
