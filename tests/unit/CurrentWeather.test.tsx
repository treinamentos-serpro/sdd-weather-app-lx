import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CurrentWeather from '../../src/components/CurrentWeather';
import type { City } from '../../src/types/weather';

const city: City = {
  name: 'São Paulo',
  admin1: 'São Paulo',
  country: 'Brasil',
  latitude: -23.55,
  longitude: -46.64,
};

describe('CurrentWeather', () => {
  it('renders the city, converted temperature and condition', () => {
    render(
      <CurrentWeather
        city={city}
        current={{ time: '2026-09-30T14:00', temperatureCelsius: 20, weatherCode: 3 }}
        unit="celsius"
      />,
    );

    expect(screen.getByText('Clima atual em São Paulo, São Paulo, Brasil')).toBeInTheDocument();
    expect(screen.getByText('20°C')).toBeInTheDocument();
    expect(screen.getByText('Nublado')).toBeInTheDocument();
  });

  it('converts the temperature to Fahrenheit when unit is fahrenheit', () => {
    render(
      <CurrentWeather
        city={city}
        current={{ time: '2026-09-30T14:00', temperatureCelsius: 20, weatherCode: 0 }}
        unit="fahrenheit"
      />,
    );

    expect(screen.getByText('68°F')).toBeInTheDocument();
  });

  it('shows an unavailable message when current weather is missing', () => {
    render(<CurrentWeather city={city} unit="celsius" />);

    expect(screen.getByRole('status')).toHaveTextContent('Clima atual indisponível no momento.');
  });

  it('uses safe fallbacks for invalid current values', () => {
    render(
      <CurrentWeather
        city={city}
        current={
          {
            time: '2026-09-30T14:00',
            temperatureCelsius: Number.NaN,
            weatherCode: Number.NaN,
          } as never
        }
        unit="celsius"
      />,
    );

    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText('Condição desconhecida')).toBeInTheDocument();
    expect(screen.queryByText(/NaN|undefined/)).not.toBeInTheDocument();
  });
});
