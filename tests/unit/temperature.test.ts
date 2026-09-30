import { describe, expect, it } from 'vitest';
import { formatTemperature } from '../../src/utils/temperature';

describe('formatTemperature', () => {
  it('returns the Celsius value unrounded away from the original when unit is celsius', () => {
    expect(formatTemperature(20.4, 'celsius')).toBe(20);
  });

  it('converts 20°C to 68°F', () => {
    expect(formatTemperature(20, 'fahrenheit')).toBe(68);
  });

  it('converts -40°C to -40°F', () => {
    expect(formatTemperature(-40, 'fahrenheit')).toBe(-40);
  });

  it('rounds ties away from zero, including negatives', () => {
    expect(formatTemperature(0.5, 'celsius')).toBe(1);
    expect(formatTemperature(-0.5, 'celsius')).toBe(-1);
  });
});
