import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import UnitToggle from '../../src/components/UnitToggle';

describe('UnitToggle', () => {
  it('marks Celsius as pressed when unit is celsius', () => {
    render(<UnitToggle unit="celsius" onChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: '°C' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '°F' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('marks Fahrenheit as pressed when unit is fahrenheit', () => {
    render(<UnitToggle unit="fahrenheit" onChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: '°F' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '°C' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onChange with the selected unit via keyboard', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<UnitToggle unit="celsius" onChange={onChange} />);

    await user.tab();
    await user.tab();
    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith('fahrenheit');
  });

  it('exposes an accessible group for the toggle', () => {
    render(<UnitToggle unit="celsius" onChange={vi.fn()} />);

    expect(screen.getByRole('group', { name: 'Unidade de temperatura' })).toBeInTheDocument();
  });
});
