import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWeather } from '../../src/hooks/useWeather';
import { getWeather, searchCities, WeatherServiceError } from '../../src/services/weatherService';
import type { City, WeatherData } from '../../src/types/weather';

vi.mock('../../src/services/weatherService', () => ({
  getWeather: vi.fn(),
  searchCities: vi.fn(),
  WeatherServiceError: class WeatherServiceError extends Error {},
}));

const searchCitiesMock = vi.mocked(searchCities);
const getWeatherMock = vi.mocked(getWeather);

const city: City = {
  name: 'Recife',
  country: 'Brasil',
  latitude: -8.05,
  longitude: -34.88,
};

const weather: WeatherData = {
  city,
  timezone: 'America/Recife',
  current: {
    time: '2026-09-30T12:00',
    temperatureCelsius: 28,
    weatherCode: 1,
  },
  forecastDays: [],
  unavailable: [],
  incompleteDaily: true,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useWeather', () => {
  it('normalizes a search and loads weather for the first city', async () => {
    searchCitiesMock.mockResolvedValue([city]);
    getWeatherMock.mockResolvedValue(weather);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('  Recife  ');
    });

    expect(searchCitiesMock).toHaveBeenCalledWith('Recife');
    expect(getWeatherMock).toHaveBeenCalledWith(city);
    expect(result.current).toMatchObject({
      status: 'success',
      data: weather,
      cities: [city],
      query: 'Recife',
      error: null,
    });
  });

  it('uses empty status without requesting a blank search', async () => {
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('   ');
    });

    expect(searchCitiesMock).not.toHaveBeenCalled();
    expect(result.current.status).toBe('empty');
  });

  it('selects a city and retries the same selection after failure', async () => {
    const error = new WeatherServiceError('Falha de rede.');
    getWeatherMock.mockRejectedValueOnce(error).mockResolvedValueOnce(weather);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.selectCity(city);
    });
    expect(result.current).toMatchObject({ status: 'error', error: 'Falha de rede.' });

    await act(async () => {
      await result.current.retry();
    });
    expect(getWeatherMock).toHaveBeenCalledTimes(2);
    expect(getWeatherMock).toHaveBeenLastCalledWith(city);
    expect(result.current.status).toBe('success');
  });

  it('ignores an obsolete search response', async () => {
    let resolveFirstSearch: (cities: City[]) => void = () => undefined;
    searchCitiesMock
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveFirstSearch = resolve;
          }),
      )
      .mockResolvedValueOnce([]);
    const { result } = renderHook(() => useWeather());
    let firstSearch: Promise<void> = Promise.resolve();

    act(() => {
      firstSearch = result.current.search('Recife antiga');
    });
    await act(async () => {
      await result.current.search('Recife nova');
    });
    await act(async () => {
      resolveFirstSearch([city]);
      await firstSearch;
    });

    expect(result.current).toMatchObject({
      status: 'empty',
      query: 'Recife nova',
      cities: [],
      data: null,
    });
    expect(getWeatherMock).not.toHaveBeenCalled();
  });
});
