import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';
import { formatTemperature, unitSymbol } from '../utils/temperature';
import { getWeatherCodeInfo } from '../utils/weather-codes';

interface CurrentWeatherProps {
  city: City;
  current?: CurrentWeatherData;
  unit: Unit;
}

export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const location = [city.name, city.admin1, city.country].filter(Boolean).join(', ');

  return (
    <section
      aria-label="Clima atual"
      className="flex min-w-0 flex-col items-center gap-2 rounded-lg border border-line/50 bg-panel/75 p-6 text-center text-primary shadow-sm backdrop-blur-md sm:items-start sm:text-left"
    >
      <h2 className="max-w-full break-words text-sm font-medium text-muted">
        Clima atual em {location}
      </h2>

      {current ? (
        <div className="flex min-w-0 flex-col items-center gap-2 sm:flex-row sm:gap-4">
          <span aria-hidden="true" className="text-5xl">
            {getWeatherCodeInfo(current.weatherCode).icon}
          </span>
          <div className="min-w-0 break-words">
            <p className="text-5xl font-bold text-highlight sm:text-6xl">
              {formatTemperature(current.temperatureCelsius, unit)}
              {unitSymbol(unit)}
            </p>
            <p className="text-muted">{getWeatherCodeInfo(current.weatherCode).description}</p>
          </div>
        </div>
      ) : (
        <p role="status" className="text-muted">
          Clima atual indisponível no momento.
        </p>
      )}
    </section>
  );
}
