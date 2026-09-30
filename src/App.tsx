import { useEffect, useRef, useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import CursorSparkle from './components/CursorSparkle';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import ThemeToggle, { type Theme } from './components/ThemeToggle';
import UnitToggle from './components/UnitToggle';
import { useWeather } from './hooks/useWeather';
import type { Unit } from './types/weather';

export default function App() {
  const { status, data, error, search, retry } = useWeather();
  const [unit, setUnit] = useState<Unit>('celsius');
  const [theme, setTheme] = useState<Theme>('light');
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (status === 'success') {
      mainRef.current?.focus();
    }
  }, [status]);

  return (
    <div
      data-theme={theme}
      className="relative isolate min-h-screen overflow-hidden bg-app text-primary transition-colors"
    >
      <CursorSparkle />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-line/40 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-highlight">Clima</h1>
            <div className="flex flex-wrap items-center gap-2">
              <ThemeToggle theme={theme} onChange={setTheme} />
              <UnitToggle unit={unit} onChange={setUnit} />
            </div>
          </div>
          <SearchBar onSearch={search} disabled={status === 'loading'} />
        </header>

        <main ref={mainRef} tabIndex={-1} className="space-y-8 py-6 outline-none">
          <div aria-live="polite" aria-atomic="true" className="sr-only">
            {status === 'success' && data ? `Clima carregado para ${data.city.name}.` : ''}
          </div>
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
