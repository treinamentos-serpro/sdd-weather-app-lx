import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import CurrentWeather from '../../src/components/CurrentWeather';
import UnitToggle from '../../src/components/UnitToggle';
import type { City, Unit } from '../../src/types/weather';

const city: City = {
  name: 'Recife',
  country: 'Brasil',
  latitude: -8.05,
  longitude: -34.88,
};

function WeatherUnitHarness() {
  const [unit, setUnit] = useState<Unit>('celsius');

  return (
    <>
      <UnitToggle unit={unit} onChange={setUnit} />
      <CurrentWeather
        city={city}
        current={{ time: '2026-09-30T12:00', temperatureCelsius: 0, weatherCode: 0 }}
        unit={unit}
      />
    </>
  );
}

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

  it('converte 0°C para 32°F ao selecionar Fahrenheit', async () => {
    const user = userEvent.setup();
    render(<WeatherUnitHarness />);

    expect(screen.getByRole('region', { name: 'Clima atual' })).toHaveTextContent('0°C');
    await user.click(screen.getByRole('button', { name: '°F' }));

    expect(screen.getByRole('region', { name: 'Clima atual' })).toHaveTextContent('32°F');
  });
});
