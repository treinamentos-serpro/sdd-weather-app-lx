import { describe, expect, it } from 'vitest';
import { getWeatherCodeInfo } from '../../src/utils/weather-codes';

describe('getWeatherCodeInfo', () => {
  it('returns a known description for a supported code', () => {
    expect(getWeatherCodeInfo(0).description).toBe('Céu limpo');
  });

  it('returns the unknown fallback for an unsupported code', () => {
    expect(getWeatherCodeInfo(9999).description).toBe('Condição desconhecida');
  });
});
