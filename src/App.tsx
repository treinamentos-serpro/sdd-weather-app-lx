import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import { mockWeatherData } from './mocks/weather';
import type { RequestState, Unit, WeatherData } from './types/weather';

interface AppProps {
  initialState?: RequestState<WeatherData>;
}

export default function App({ initialState }: AppProps) {
  const [weather, setWeather] = useState<RequestState<WeatherData>>(
    initialState ?? { status: 'success', data: mockWeatherData },
  );
  const [unit, setUnit] = useState<Unit>('celsius');

  const handleSearch = (city: string) => {
    setWeather(
      city.localeCompare(mockWeatherData.city.name, 'pt-BR', { sensitivity: 'base' }) === 0
        ? { status: 'success', data: mockWeatherData }
        : { status: 'empty' },
    );
  };

  return (
    <div className="min-h-screen bg-night-900 text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-sun">Clima</h1>
            <UnitToggle unit={unit} onChange={setUnit} />
          </div>
          <SearchBar onSearch={handleSearch} />
        </header>

        <main className="space-y-8 py-6">
          {weather.status === 'idle' && <p>Consulte o clima da sua cidade.</p>}
          {weather.status === 'loading' && <LoadingState />}
          {weather.status === 'empty' && <EmptyState />}
          {weather.status === 'error' && <ErrorState onRetry={weather.retry} />}
          {weather.status === 'success' && (
            <>
              <CurrentWeather city={weather.data.city} current={weather.data.current} unit={unit} />
              <ForecastList
                days={weather.data.forecastDays}
                unit={unit}
                incompleteDaily={weather.data.incompleteDaily}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
