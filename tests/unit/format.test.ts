import { describe, expect, it } from 'vitest';
import { formatDayLabel, getShortDate } from '../../src/lib/format';

describe('formatDayLabel', () => {
  it('usa Hoje para o primeiro dia', () => {
    expect(formatDayLabel('2026-10-01', 0)).toBe('Hoje');
  });

  it('usa Amanhã para o segundo dia', () => {
    expect(formatDayLabel('2026-10-02', 1)).toBe('Amanhã');
  });

  it('usa o dia da semana para os demais índices', () => {
    expect(formatDayLabel('2026-10-03', 2)).toBe('sáb.');
  });
});

describe('getShortDate', () => {
  it.each([
    ['2026-10-01', '01/10'],
    ['2026-12-31', '31/12'],
    ['2027-01-01', '01/01'],
  ])('formata %s como %s', (date, expected) => {
    expect(getShortDate(date)).toBe(expected);
  });
});
