import type { City } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export class WeatherServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function mapCity(value: unknown): City | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const { id, name, admin1, country, latitude, longitude, timezone } = value;

  if (
    typeof name !== 'string' ||
    name.length === 0 ||
    typeof country !== 'string' ||
    country.length === 0 ||
    typeof latitude !== 'number' ||
    !Number.isFinite(latitude) ||
    typeof longitude !== 'number' ||
    !Number.isFinite(longitude)
  ) {
    return undefined;
  }

  return {
    name,
    country,
    latitude,
    longitude,
    ...(typeof id === 'number' && Number.isFinite(id) ? { id } : {}),
    ...(typeof admin1 === 'string' ? { admin1 } : {}),
    ...(typeof timezone === 'string' ? { timezone } : {}),
  };
}

export async function searchCities(name: string): Promise<City[]> {
  if (name.trim().length === 0) {
    return [];
  }

  const url = `${GEOCODING_URL}?name=${encodeURIComponent(name)}&count=10&language=pt&format=json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new WeatherServiceError('Não foi possível buscar cidades.');
  }

  const payload: unknown = await response.json();
  if (!isRecord(payload) || !Array.isArray(payload.results)) {
    return [];
  }

  return payload.results.flatMap((result) => {
    const city = mapCity(result);
    return city ? [city] : [];
  });
}
