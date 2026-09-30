import { describe, expect, it } from 'vitest';
import { getWeatherCodeInfo } from '../../src/lib/weatherCodes';

describe('getWeatherCodeInfo', () => {
  it('retorna descrição e ícone para um código conhecido', () => {
    expect(getWeatherCodeInfo(0)).toEqual({ description: 'Céu limpo', icon: '☀️' });
  });

  it('retorna o fallback para um código desconhecido', () => {
    expect(getWeatherCodeInfo(9999)).toEqual({
      description: 'Condição desconhecida',
      icon: '❓',
    });
  });
});
