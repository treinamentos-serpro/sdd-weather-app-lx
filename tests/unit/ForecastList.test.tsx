import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ForecastList from '../../src/components/ForecastList';
import type { ForecastDay } from '../../src/types/weather';

const days: ForecastDay[] = [
  {
    date: '2026-09-30',
    weatherCode: 3,
    minimumCelsius: 16,
    maximumCelsius: 25,
    precipitationProbability: 0,
  },
  {
    date: '2026-10-01',
    weatherCode: 61,
    minimumCelsius: 15,
    maximumCelsius: 22,
    precipitationProbability: 75,
  },
  { date: '2026-10-02', weatherCode: 2, minimumCelsius: 14, maximumCelsius: 24 },
  { date: '2026-10-03', weatherCode: 0, minimumCelsius: 13, maximumCelsius: 26 },
  { date: '2026-10-04', weatherCode: 45, minimumCelsius: 15, maximumCelsius: 21 },
];

describe('ForecastList', () => {
  it('shows five local dates in order with condition, temperatures and rainfall probability', () => {
    render(<ForecastList days={[...days].reverse()} unit="celsius" />);

    const cards = screen.getAllByRole('listitem');
    expect(cards).toHaveLength(5);
    expect(cards.map((card) => within(card).getByRole('heading').textContent)).toEqual([
      'qua., 30/09',
      'qui., 01/10',
      'sex., 02/10',
      'sáb., 03/10',
      'dom., 04/10',
    ]);
    expect(within(cards[0]).getByText('Nublado')).toBeInTheDocument();
    expect(within(cards[0]).getByText('Máx 25°C / Mín 16°C')).toBeInTheDocument();
    expect(within(cards[0]).getByText('Chuva: 0%')).toBeInTheDocument();
    expect(within(cards[1]).getByText('Chuva: 75%')).toBeInTheDocument();
    expect(within(cards[2]).getByText('Chuva: indisponível')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('converts both temperatures without changing the daily data', () => {
    const { rerender } = render(<ForecastList days={days} unit="fahrenheit" />);
    expect(
      within(screen.getAllByRole('listitem')[0]).getByText('Máx 77°F / Mín 61°F'),
    ).toBeInTheDocument();

    rerender(<ForecastList days={days} unit="celsius" />);
    expect(
      within(screen.getAllByRole('listitem')[0]).getByText('Máx 25°C / Mín 16°C'),
    ).toBeInTheDocument();
  });

  it('shows only complete unique days and reports an incomplete forecast', () => {
    render(
      <ForecastList
        days={[days[1], days[0], days[0], { ...days[2], minimumCelsius: Number.NaN }]}
        unit="celsius"
        incompleteDaily
      />,
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('status')).toHaveTextContent('Previsão incompleta');
  });

  it('reports unavailable forecast when there are no valid days', () => {
    render(<ForecastList days={[]} unit="celsius" />);

    expect(screen.getByRole('status')).toHaveTextContent('Previsão diária indisponível');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
