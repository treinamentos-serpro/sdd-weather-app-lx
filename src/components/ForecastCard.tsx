import { memo } from 'react';
import { formatDayLabel } from '../lib/format';
import type { ForecastDay, Unit } from '../types/weather';
import { formatTemperatureLabel } from '../utils/temperature';
import { getWeatherCodeInfo } from '../utils/weather-codes';

interface ForecastCardProps {
  day: ForecastDay;
  unit: Unit;
}

function ForecastCard({ day, unit }: ForecastCardProps) {
  const condition = getWeatherCodeInfo(day.weatherCode);
  const probability = day.precipitationProbability;

  return (
    <li className="min-w-0 rounded-lg border border-line/50 bg-panel/75 p-4 text-center text-primary shadow-sm backdrop-blur-md">
      <h3 className="text-sm font-semibold capitalize">{formatDayLabel(day.date)}</h3>
      <span aria-hidden="true" className="my-2 block text-3xl">
        {condition.icon}
      </span>
      <p className="break-words text-sm text-muted">{condition.description}</p>
      <p className="mt-2 font-semibold">
        Máx {formatTemperatureLabel(day.maximumCelsius, unit)} / Mín{' '}
        {formatTemperatureLabel(day.minimumCelsius, unit)}
      </p>
      <p className="mt-2 text-sm text-muted">
        {probability !== undefined &&
        Number.isFinite(probability) &&
        probability >= 0 &&
        probability <= 100
          ? `Chuva: ${Math.round(probability)}%`
          : 'Chuva: —'}
      </p>
    </li>
  );
}

export default memo(ForecastCard);
