import { afterEach, describe, expect, it, vi } from 'vitest';
import { getWeather, searchCities, WeatherServiceError } from '../../src/services/weatherService';
import type { City } from '../../src/types/weather';

const fetchMock = vi.fn<typeof fetch>();
vi.stubGlobal('fetch', fetchMock);

afterEach(() => {
  fetchMock.mockReset();
});

describe('searchCities', () => {
  it('returns an empty list for blank input without calling the network', async () => {
    await expect(searchCities('   ')).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('requests an encoded name and maps valid results to cities', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          results: [
            {
              id: 3448439,
              name: 'São Paulo',
              admin1: 'São Paulo',
              country: 'Brasil',
              latitude: -23.55,
              longitude: -46.64,
              timezone: 'America/Sao_Paulo',
            },
          ],
        }),
      ),
    );

    await expect(searchCities('São Paulo')).resolves.toEqual([
      {
        id: 3448439,
        name: 'São Paulo',
        admin1: 'São Paulo',
        country: 'Brasil',
        latitude: -23.55,
        longitude: -46.64,
        timezone: 'America/Sao_Paulo',
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://geocoding-api.open-meteo.com/v1/search?name=S%C3%A3o%20Paulo&count=10&language=pt&format=json',
      { signal: expect.any(AbortSignal) },
    );
  });

  it('ignores results that cannot be mapped to City', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          results: [
            { name: 'Sem país', latitude: 1, longitude: 2 },
            { name: 'Sem longitude', country: 'Brasil', latitude: 1 },
          ],
        }),
      ),
    );

    await expect(searchCities('inválida')).resolves.toEqual([]);
  });

  it('throws WeatherServiceError when the response is not ok', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 503 }));

    await expect(searchCities('Recife')).rejects.toBeInstanceOf(WeatherServiceError);
  });

  it('converts network failures to WeatherServiceError', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(searchCities('Recife')).rejects.toEqual(
      expect.objectContaining({
        name: 'WeatherServiceError',
        message: 'Falha de rede.',
      }),
    );
  });

  it('aborts after ten seconds and clears the timeout', async () => {
    vi.useFakeTimers();
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    fetchMock.mockImplementation(
      (_input, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'));
          });
        }),
    );

    const requestExpectation = expect(searchCities('Recife')).rejects.toEqual(
      expect.objectContaining({
        name: 'WeatherServiceError',
        message: 'A requisição demorou demais.',
      }),
    );
    await vi.advanceTimersByTimeAsync(10_000);

    await requestExpectation;
    expect(clearTimeoutSpy).toHaveBeenCalledOnce();
    clearTimeoutSpy.mockRestore();
    vi.useRealTimers();
  });
});

describe('getWeather', () => {
  const city: City = {
    name: 'Recife',
    country: 'Brasil',
    latitude: -8.05,
    longitude: -34.88,
  };

  const forecastPayload = {
    timezone: 'America/Recife',
    current: {
      time: '2026-09-30T12:00',
      temperature_2m: 28.5,
      weather_code: 1,
    },
    daily: {
      time: ['2026-09-30', '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'],
      weather_code: [1, 2, 3, 61, 80],
      temperature_2m_min: [23, 22, 22, 21, 23],
      temperature_2m_max: [29, 30, 28, 27, 29],
    },
  };

  it('requests current and daily data and maps five forecast days', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify(forecastPayload)));

    const weather = await getWeather(city);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.open-meteo.com/v1/forecast?latitude=-8.05&longitude=-34.88&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&temperature_unit=celsius&forecast_days=5',
      { signal: expect.any(AbortSignal) },
    );
    expect(weather).toEqual({
      city,
      timezone: 'America/Recife',
      current: {
        time: '2026-09-30T12:00',
        temperatureCelsius: 28.5,
        weatherCode: 1,
      },
      forecastDays: [
        {
          date: '2026-09-30',
          weatherCode: 1,
          minimumCelsius: 23,
          maximumCelsius: 29,
        },
        {
          date: '2026-10-01',
          weatherCode: 2,
          minimumCelsius: 22,
          maximumCelsius: 30,
        },
        {
          date: '2026-10-02',
          weatherCode: 3,
          minimumCelsius: 22,
          maximumCelsius: 28,
        },
        {
          date: '2026-10-03',
          weatherCode: 61,
          minimumCelsius: 21,
          maximumCelsius: 27,
        },
        {
          date: '2026-10-04',
          weatherCode: 80,
          minimumCelsius: 23,
          maximumCelsius: 29,
        },
      ],
      unavailable: [],
      incompleteDaily: false,
    });
  });

  it.each([
    'current',
    'daily',
  ] as const)('throws WeatherServiceError when %s is missing', async (section) => {
    const incompletePayload = { ...forecastPayload, [section]: undefined };
    fetchMock.mockResolvedValue(new Response(JSON.stringify(incompletePayload)));

    await expect(getWeather(city)).rejects.toBeInstanceOf(WeatherServiceError);
  });
});
