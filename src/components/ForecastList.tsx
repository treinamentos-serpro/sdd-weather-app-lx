import type { ForecastDay, Unit } from '../types/weather';
import ForecastCard from './ForecastCard';

function addDays(date: string, days: number): string {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

interface ForecastListProps {
  days: ForecastDay[];
  unit: Unit;
  incompleteDaily?: boolean;
}

export default function ForecastList({ days, unit, incompleteDaily = false }: ForecastListProps) {
  const sortedDays = days
    .filter((day) => {
      const date = new Date(`${day.date}T00:00:00Z`);
      return (
        /^\d{4}-\d{2}-\d{2}$/.test(day.date) &&
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === day.date &&
        Number.isFinite(day.minimumCelsius) &&
        Number.isFinite(day.maximumCelsius) &&
        day.minimumCelsius <= day.maximumCelsius
      );
    })
    .filter(
      (day, index, allDays) => allDays.findIndex((other) => other.date === day.date) === index,
    )
    .sort((first, second) => first.date.localeCompare(second.date));
  const validDays = sortedDays;
  const hasDateGap = sortedDays.some(
    (day, index) => index > 0 && day.date !== addDays(sortedDays[index - 1].date, 1),
  );
  const hasIncompleteForecast = incompleteDaily || validDays.length < 5 || hasDateGap;

  return (
    <section aria-label="Previsão de 5 dias" className="text-primary">
      <h2 className="mb-3 text-lg font-semibold">Previsão de 5 dias</h2>
      {validDays.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {validDays.map((day) => (
            <ForecastCard key={day.date} day={day} unit={unit} />
          ))}
        </ul>
      ) : (
        <p role="status" className="text-muted">
          Previsão diária indisponível no momento.
        </p>
      )}
      {validDays.length > 0 && hasIncompleteForecast && (
        <p role="status" className="mt-3 text-sm text-muted">
          Previsão incompleta: alguns dias estão indisponíveis.
        </p>
      )}
    </section>
  );
}
