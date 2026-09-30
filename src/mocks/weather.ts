import type { WeatherData } from '../types/weather';

// Dados de exemplo para desenvolver a UI sem depender da Open-Meteo.
export const mockWeatherData: WeatherData = {
  city: {
    id: 3448439,
    name: 'São Paulo',
    admin1: 'São Paulo',
    country: 'Brasil',
    latitude: -23.55,
    longitude: -46.64,
    timezone: 'America/Sao_Paulo',
  },
  timezone: 'America/Sao_Paulo',
  current: {
    time: '2026-09-30T14:00',
    temperatureCelsius: 20.4,
    weatherCode: 3,
  },
  forecastDays: [
    {
      date: '2026-09-30',
      weatherCode: 3,
      minimumCelsius: 16.2,
      maximumCelsius: 25.1,
    },
    {
      date: '2026-10-01',
      weatherCode: 61,
      minimumCelsius: 15.0,
      maximumCelsius: 22.0,
    },
    {
      date: '2026-10-02',
      weatherCode: 2,
      minimumCelsius: 14.5,
      maximumCelsius: 24.3,
    },
    {
      date: '2026-10-03',
      weatherCode: 0,
      minimumCelsius: 13.8,
      maximumCelsius: 26.0,
    },
    {
      date: '2026-10-04',
      weatherCode: 45,
      minimumCelsius: 15.1,
      maximumCelsius: 21.7,
    },
  ],
  unavailable: [],
  incompleteDaily: false,
};
