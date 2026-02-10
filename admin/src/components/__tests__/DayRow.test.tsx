import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DayRow } from '../DayRow';
import { Wrapper } from './test-utils';
import type { DaySchedule } from '../../types';

const makeDay = (overrides?: Partial<DaySchedule>): DaySchedule => ({
  dayOfWeek: 'Monday',
  isOpen: true,
  timeSlots: [{ opens: '09:00', closes: '17:00' }],
  ...overrides,
});

describe('DayRow', () => {
  const defaultProps = {
    dayIndex: 0,
    disabled: false,
    onToggle: jest.fn(),
    onUpdateSlot: jest.fn(),
    onAddSlot: jest.fn(),
    onRemoveSlot: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders day label', () => {
    render(<DayRow day={makeDay()} {...defaultProps} />, { wrapper: Wrapper });
    expect(screen.getByText('Mon')).toBeInTheDocument();
  });

  it('shows "Closed" badge when day is closed', () => {
    render(
      <DayRow day={makeDay({ isOpen: false, timeSlots: [] })} {...defaultProps} />,
      { wrapper: Wrapper }
    );
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });

  it('renders time pickers when day is open', () => {
    render(<DayRow day={makeDay()} {...defaultProps} />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Opens 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Closes 1')).toBeInTheDocument();
  });

  it('renders add slot button when not disabled', () => {
    render(<DayRow day={makeDay()} {...defaultProps} />, { wrapper: Wrapper });
    expect(screen.getByRole('button', { name: 'Add time slot' })).toBeInTheDocument();
  });

  it('hides add slot button when disabled', () => {
    render(
      <DayRow day={makeDay()} {...defaultProps} disabled={true} />,
      { wrapper: Wrapper }
    );
    expect(screen.queryByRole('button', { name: 'Add time slot' })).not.toBeInTheDocument();
  });

  it('calls onToggle when checkbox is clicked', async () => {
    const user = userEvent.setup();
    render(<DayRow day={makeDay()} {...defaultProps} />, { wrapper: Wrapper });

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(defaultProps.onToggle).toHaveBeenCalledWith(0, false);
  });

  it('calls onAddSlot when add button is clicked', async () => {
    const user = userEvent.setup();
    render(<DayRow day={makeDay()} {...defaultProps} />, { wrapper: Wrapper });

    await user.click(screen.getByRole('button', { name: 'Add time slot' }));
    expect(defaultProps.onAddSlot).toHaveBeenCalledWith(0);
  });

  it('renders multiple time slots', () => {
    const day = makeDay({
      timeSlots: [
        { opens: '09:00', closes: '12:00' },
        { opens: '14:00', closes: '18:00' },
      ],
    });
    render(<DayRow day={day} {...defaultProps} />, { wrapper: Wrapper });

    expect(screen.getByLabelText('Opens 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Opens 2')).toBeInTheDocument();
  });

  it('does not show remove button with single slot', () => {
    render(<DayRow day={makeDay()} {...defaultProps} />, { wrapper: Wrapper });
    expect(screen.queryByRole('button', { name: 'Remove time slot' })).not.toBeInTheDocument();
  });

  it('shows remove buttons when multiple slots exist', () => {
    const day = makeDay({
      timeSlots: [
        { opens: '09:00', closes: '12:00' },
        { opens: '14:00', closes: '18:00' },
      ],
    });
    render(<DayRow day={day} {...defaultProps} />, { wrapper: Wrapper });
    expect(screen.getAllByRole('button', { name: 'Remove time slot' })).toHaveLength(2);
  });
});
