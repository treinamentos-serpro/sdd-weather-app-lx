import { useEffect, useRef, useState } from 'react';
import { getWeather, searchCities, WeatherServiceError } from '../services/weatherService';
import type { City, WeatherData } from '../types/weather';

type WeatherStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';

type LastOperation = { type: 'search'; name: string } | { type: 'select'; city: City };

export interface UseWeatherResult {
  status: WeatherStatus;
  data: WeatherData | null;
  cities: City[];
  error: string | null;
  query: string;
  search: (name: string) => Promise<void>;
  selectCity: (city: City) => Promise<void>;
  retry: () => Promise<void>;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof WeatherServiceError && error.message) {
    return `Não foi possível concluir a consulta. ${error.message}`;
  }

  return 'Não foi possível concluir a consulta. Verifique sua conexão e tente novamente.';
}

export function useWeather(): UseWeatherResult {
  const [status, setStatus] = useState<WeatherStatus>('idle');
  const [data, setData] = useState<WeatherData | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const operationId = useRef(0);
  const lastOperation = useRef<LastOperation | null>(null);

  useEffect(
    () => () => {
      operationId.current += 1;
    },
    [],
  );

  const loadWeather = async (city: City, currentOperationId: number) => {
    try {
      const weather = await getWeather(city);
      if (operationId.current !== currentOperationId) {
        return;
      }

      setData(weather);
      setStatus('success');
    } catch (loadError) {
      if (operationId.current !== currentOperationId) {
        return;
      }

      setError(getErrorMessage(loadError));
      setStatus('error');
    }
  };

  const search = async (name: string) => {
    const normalizedName = name.trim();
    const currentOperationId = operationId.current + 1;
    operationId.current = currentOperationId;
    setQuery(normalizedName);
    setData(null);
    setCities([]);
    setError(null);

    if (normalizedName.length === 0) {
      lastOperation.current = null;
      setStatus('empty');
      return;
    }

    lastOperation.current = { type: 'search', name: normalizedName };
    setStatus('loading');

    try {
      const foundCities = await searchCities(normalizedName);
      if (operationId.current !== currentOperationId) {
        return;
      }

      setCities(foundCities);
      if (foundCities.length === 0) {
        setStatus('empty');
        return;
      }

      await loadWeather(foundCities[0], currentOperationId);
    } catch (searchError) {
      if (operationId.current !== currentOperationId) {
        return;
      }

      setError(getErrorMessage(searchError));
      setStatus('error');
    }
  };

  const selectCity = async (city: City) => {
    const currentOperationId = operationId.current + 1;
    operationId.current = currentOperationId;
    lastOperation.current = { type: 'select', city };
    setStatus('loading');
    setData(null);
    setError(null);
    await loadWeather(city, currentOperationId);
  };

  const retry = async () => {
    const operation = lastOperation.current;
    if (operation?.type === 'search') {
      await search(operation.name);
      return;
    }

    if (operation?.type === 'select') {
      await selectCity(operation.city);
    }
  };

  return { status, data, cities, error, query, search, selectCity, retry };
}
