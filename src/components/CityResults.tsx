import type { City } from '../types/weather';

interface CityResultsProps {
  cities: City[];
  onSelect: (city: City) => void;
}

function cityLabel(city: City): string {
  return [city.name, city.admin1, city.country]
    .filter((part): part is string => typeof part === 'string' && part.trim().length > 0)
    .join(', ');
}

export default function CityResults({ cities, onSelect }: CityResultsProps) {
  const labels = cities.map(cityLabel);
  const hasDuplicateLabels = new Set(labels).size !== labels.length;

  return (
    <section aria-label="Resultados de cidades" className="space-y-2">
      <h2 className="text-lg font-semibold">Selecione uma cidade</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {cities.map((city, index) => (
          <li key={`${city.id ?? city.name}-${city.latitude}-${city.longitude}`}>
            <button
              type="button"
              onClick={() => onSelect(city)}
              className="w-full rounded-lg border border-line/50 bg-panel/75 px-4 py-3 text-left text-primary shadow-sm transition hover:border-focus hover:bg-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-app"
            >
              <span className="block font-medium">{labels[index]}</span>
              {hasDuplicateLabels && (
                <span className="mt-1 block text-sm text-muted">
                  Coordenadas: {city.latitude.toFixed(4)}, {city.longitude.toFixed(4)}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
