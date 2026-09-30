import type { City, CurrentWeather, ForecastDay, WeatherData } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const REQUEST_TIMEOUT_MS = 10_000;

export class WeatherServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { signal: controller.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new WeatherServiceError(
        'A consulta demorou mais de 10 segundos. Verifique sua conexão e tente novamente.',
      );
    }

    throw new WeatherServiceError(
      'Não foi possível conectar ao serviço de clima. Verifique sua conexão e tente novamente.',
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    throw new WeatherServiceError('A resposta do serviço é inválida.');
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

function mapCurrentWeather(value: unknown): CurrentWeather | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const { time, temperature_2m: temperature, weather_code: weatherCode } = value;
  if (
    typeof time !== 'string' ||
    typeof temperature !== 'number' ||
    !Number.isFinite(temperature) ||
    typeof weatherCode !== 'number' ||
    !Number.isFinite(weatherCode)
  ) {
    return undefined;
  }

  return { time, temperatureCelsius: temperature, weatherCode };
}

function mapForecastDays(value: unknown): ForecastDay[] {
  if (!isRecord(value)) {
    return [];
  }

  const {
    time,
    weather_code: weatherCodes,
    temperature_2m_min: minimumTemperatures,
    temperature_2m_max: maximumTemperatures,
    precipitation_probability_max: precipitationProbabilities,
  } = value;

  if (
    !Array.isArray(time) ||
    !Array.isArray(weatherCodes) ||
    !Array.isArray(minimumTemperatures) ||
    !Array.isArray(maximumTemperatures) ||
    (precipitationProbabilities !== undefined && !Array.isArray(precipitationProbabilities))
  ) {
    return [];
  }

  const forecastDays: ForecastDay[] = [];
  for (let index = 0; index < 5; index += 1) {
    const date = time[index];
    const weatherCode = weatherCodes[index];
    const minimumCelsius = minimumTemperatures[index];
    const maximumCelsius = maximumTemperatures[index];
    const precipitationProbability = Array.isArray(precipitationProbabilities)
      ? precipitationProbabilities[index]
      : undefined;

    if (
      typeof date !== 'string' ||
      typeof weatherCode !== 'number' ||
      !Number.isFinite(weatherCode) ||
      typeof minimumCelsius !== 'number' ||
      !Number.isFinite(minimumCelsius) ||
      typeof maximumCelsius !== 'number' ||
      !Number.isFinite(maximumCelsius) ||
      (precipitationProbability !== undefined &&
        precipitationProbability !== null &&
        (typeof precipitationProbability !== 'number' ||
          !Number.isFinite(precipitationProbability)))
    ) {
      continue;
    }

    forecastDays.push({
      date,
      weatherCode,
      minimumCelsius,
      maximumCelsius,
      ...(precipitationProbability !== undefined
        ? { precipitationProbability: precipitationProbability ?? 0 }
        : {}),
    });
  }

  return forecastDays;
}

export async function searchCities(name: string): Promise<City[]> {
  if (name.trim().length === 0) {
    return [];
  }

  const url = `${GEOCODING_URL}?name=${encodeURIComponent(name)}&count=10&language=pt&format=json`;
  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw new WeatherServiceError(
      'O serviço de busca de cidades está indisponível no momento. Tente novamente.',
    );
  }

  const payload = await readJson(response);
  if (!isRecord(payload) || !Array.isArray(payload.results)) {
    return [];
  }

  return payload.results.flatMap((result) => {
    const city = mapCity(result);
    return city ? [city] : [];
  });
}

export async function getWeather(city: City): Promise<WeatherData> {
  const url = `${FORECAST_URL}?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&temperature_unit=celsius&forecast_days=5`;
  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw new WeatherServiceError(
      'O serviço de previsão está indisponível no momento. Tente novamente.',
    );
  }

  const payload = await readJson(response);
  if (!isRecord(payload)) {
    throw new WeatherServiceError('A resposta da previsão está incompleta.');
  }

  const current = mapCurrentWeather(payload.current);
  const forecastDays = mapForecastDays(payload.daily);
  const unavailable: Array<'current' | 'daily'> = [];
  if (!current) {
    unavailable.push('current');
  }
  if (forecastDays.length === 0) {
    unavailable.push('daily');
  }

  if (unavailable.length === 2 || typeof payload.timezone !== 'string') {
    throw new WeatherServiceError('A resposta da previsão está incompleta.');
  }

  return {
    city,
    timezone: payload.timezone,
    ...(current ? { current } : {}),
    forecastDays,
    unavailable,
    incompleteDaily: forecastDays.length < 5,
  };
}
