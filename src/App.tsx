import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import { useWeather } from './hooks/useWeather';
import type { Unit } from './types/weather';

export default function App() {
  const { status, data, error, search, retry } = useWeather();
  const [unit, setUnit] = useState<Unit>('celsius');

  return (
    <div className="min-h-screen bg-night-900 text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-sun">Clima</h1>
            <UnitToggle unit={unit} onChange={setUnit} />
          </div>
          <SearchBar onSearch={search} disabled={status === 'loading'} />
        </header>

        <main className="space-y-8 py-6">
          {status === 'idle' && <p>Consulte o clima da sua cidade.</p>}
          {status === 'loading' && <LoadingState />}
          {status === 'empty' && <EmptyState />}
          {status === 'error' && <ErrorState onRetry={retry} message={error ?? undefined} />}
          {status === 'success' && data && (
            <>
              <CurrentWeather city={data.city} current={data.current} unit={unit} />
              <ForecastList
                days={data.forecastDays}
                unit={unit}
                incompleteDaily={data.incompleteDaily}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
