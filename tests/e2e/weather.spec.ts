import { expect, test } from '@playwright/test';

const city = {
  id: 3448439,
  name: 'São Paulo',
  admin1: 'São Paulo',
  country: 'Brasil',
  latitude: -23.55,
  longitude: -46.64,
  timezone: 'America/Sao_Paulo',
};

const forecast = {
  timezone: 'America/Sao_Paulo',
  current: {
    time: '2026-09-30T12:00',
    temperature_2m: 0,
    weather_code: 0,
  },
  daily: {
    time: ['2026-09-30', '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'],
    weather_code: [0, 1, 2, 3, 61],
    temperature_2m_max: [8, 9, 10, 11, 12],
    temperature_2m_min: [-2, -1, 0, 1, 2],
    precipitation_probability_max: [0, 10, 20, 30, 70],
  },
};

test('busca uma cidade, mostra cinco dias e converte para Fahrenheit', async ({ page }) => {
  await page.route('**://geocoding-api.open-meteo.com/**', async (route) => {
    await route.fulfill({ json: { results: [city] } });
  });
  await page.route('**://api.open-meteo.com/**', async (route) => {
    await route.fulfill({ json: forecast });
  });

  await page.goto('/');
  await page.getByRole('textbox', { name: 'Nome da cidade' }).fill('São Paulo');
  await page.getByRole('button', { name: 'Buscar' }).click();

  const currentWeather = page.getByRole('region', { name: 'Clima atual' });
  await expect(currentWeather).toContainText('São Paulo, São Paulo, Brasil');
  await expect(currentWeather).toContainText('0°C');

  const fiveDayForecast = page.getByRole('region', { name: 'Previsão de 5 dias' });
  await expect(fiveDayForecast.getByRole('listitem')).toHaveCount(5);

  await page.getByRole('button', { name: '°F' }).click();
  await expect(currentWeather).toContainText('32°F');
});
