import { afterEach, describe, expect, it, vi } from 'vitest';
import { searchCities, WeatherServiceError } from '../../src/services/weatherService';

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
});
