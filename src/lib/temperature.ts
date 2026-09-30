import type { Unit } from '../types/weather';
import {
  celsiusToFahrenheit,
  formatTemperature as roundTemperature,
  unitSymbol,
} from '../utils/temperature';

export const toFahrenheit = celsiusToFahrenheit;

export function convertTemperature(celsius: number, unit: Unit): number {
  return unit === 'fahrenheit' ? toFahrenheit(celsius) : celsius;
}

export function formatTemperature(celsius: number, unit: Unit): string {
  return `${roundTemperature(celsius, unit)}${unitSymbol(unit)}`;
}

export function unitLabel(unit: Unit): string {
  return unit === 'fahrenheit' ? 'Fahrenheit' : 'Celsius';
}
