import { describe, expect, it } from 'vitest';
import {
  convertTemperature,
  formatTemperature,
  toFahrenheit,
  unitLabel,
} from '../../src/lib/temperature';

describe('toFahrenheit', () => {
  it.each([
    [0, 32],
    [100, 212],
    [-40, -40],
  ])('converte %d°C para %d°F', (celsius, fahrenheit) => {
    expect(toFahrenheit(celsius)).toBe(fahrenheit);
  });
});

describe('convertTemperature', () => {
  it('mantém o valor canônico ao usar Celsius', () => {
    expect(convertTemperature(20.4, 'celsius')).toBe(20.4);
  });

  it('converte o valor canônico ao usar Fahrenheit', () => {
    expect(convertTemperature(20, 'fahrenheit')).toBe(68);
  });
});

describe('formatTemperature', () => {
  it('arredonda e inclui o símbolo da unidade', () => {
    expect(formatTemperature(20.4, 'celsius')).toBe('20°C');
    expect(formatTemperature(20, 'fahrenheit')).toBe('68°F');
  });

  it('arredonda empates afastando-se de zero', () => {
    expect(formatTemperature(0.5, 'celsius')).toBe('1°C');
    expect(formatTemperature(-0.5, 'celsius')).toBe('-1°C');
  });
});

describe('unitLabel', () => {
  it('retorna o rótulo legível de cada unidade', () => {
    expect(unitLabel('celsius')).toBe('Celsius');
    expect(unitLabel('fahrenheit')).toBe('Fahrenheit');
  });
});
