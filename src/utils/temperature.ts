import type { Unit } from '../types/weather';

// Arredonda afastando-se de zero (0.5 -> 1, -0.5 -> -1).
function roundHalfAwayFromZero(value: number): number {
  return value >= 0 ? Math.round(value) : -Math.round(-value);
}

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function formatTemperature(celsius: number, unit: Unit): number {
  const value = unit === 'fahrenheit' ? celsiusToFahrenheit(celsius) : celsius;
  return roundHalfAwayFromZero(value);
}

export function formatTemperatureLabel(value: unknown, unit: Unit): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return '—';
  }

  return `${formatTemperature(value, unit)}${unitSymbol(unit)}`;
}

export function unitSymbol(unit: Unit): string {
  return unit === 'fahrenheit' ? '°F' : '°C';
}
