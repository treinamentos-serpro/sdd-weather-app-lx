import type { ForecastDay, Unit } from '../types/weather';
import ForecastCard from './ForecastCard';

interface ForecastListProps {
  days: ForecastDay[];
  unit: Unit;
  incompleteDaily?: boolean;
}

export default function ForecastList({ days, unit, incompleteDaily = false }: ForecastListProps) {
  const validDays = days
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

  return (
    <section aria-label="Previsão diária" className="text-white">
      <h2 className="mb-3 text-lg font-semibold">Previsão diária</h2>
      {validDays.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {validDays.map((day) => (
            <ForecastCard key={day.date} day={day} unit={unit} />
          ))}
        </ul>
      ) : (
        <p role="status" className="text-white/80">
          Previsão diária indisponível no momento.
        </p>
      )}
      {validDays.length > 0 && (incompleteDaily || validDays.length < 5) && (
        <p role="status" className="mt-3 text-sm text-white/80">
          Previsão incompleta: alguns dias estão indisponíveis.
        </p>
      )}
    </section>
  );
}
