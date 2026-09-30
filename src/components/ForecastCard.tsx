import { formatDayLabel } from '../lib/format';
import type { ForecastDay, Unit } from '../types/weather';
import { formatTemperature, unitSymbol } from '../utils/temperature';
import { getWeatherCodeInfo } from '../utils/weather-codes';

interface ForecastCardProps {
  day: ForecastDay;
  unit: Unit;
}

export default function ForecastCard({ day, unit }: ForecastCardProps) {
  const condition = getWeatherCodeInfo(day.weatherCode);
  const probability = day.precipitationProbability;

  return (
    <li className="min-w-0 rounded-lg border border-white/10 bg-white/5 p-4 text-center text-white backdrop-blur-md">
      <h3 className="text-sm font-semibold capitalize">{formatDayLabel(day.date)}</h3>
      <span aria-hidden="true" className="my-2 block text-3xl">
        {condition.icon}
      </span>
      <p className="break-words text-sm text-white/80">{condition.description}</p>
      <p className="mt-2 font-semibold">
        Máx {formatTemperature(day.maximumCelsius, unit)}
        {unitSymbol(unit)} / Mín {formatTemperature(day.minimumCelsius, unit)}
        {unitSymbol(unit)}
      </p>
      <p className="mt-2 text-sm text-white/80">
        {probability !== undefined &&
        Number.isFinite(probability) &&
        probability >= 0 &&
        probability <= 100
          ? `Chuva: ${Math.round(probability)}%`
          : 'Chuva: indisponível'}
      </p>
    </li>
  );
}
