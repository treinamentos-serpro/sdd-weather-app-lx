export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  id?: number; // Identificador do resultado de geocoding, quando disponível.
  name: string; // Nome da cidade.
  admin1?: string; // Estado ou região, quando disponível.
  country: string; // País da cidade.
  latitude: number; // Latitude usada na consulta meteorológica.
  longitude: number; // Longitude usada na consulta meteorológica.
  timezone?: string; // Fuso informado pelo geocoding, quando disponível.
}

export interface CurrentWeather {
  time: string; // Horário local da medição, retornado pela API.
  temperatureCelsius: number; // Temperatura atual em °C.
  weatherCode: number; // Código WMO da condição atual.
}

export interface ForecastDay {
  date: string; // Data local YYYY-MM-DD retornada pela API.
  weatherCode: number; // Código WMO da condição diária.
  minimumCelsius: number; // Mínima do dia em °C.
  maximumCelsius: number; // Máxima do dia em °C.
  precipitationProbability?: number; // Probabilidade de chuva em %, quando disponível.
}

export interface WeatherData {
  city: City; // Cidade selecionada no geocoding.
  timezone: string; // Fuso retornado pela Forecast API para as datas locais.
  current?: CurrentWeather; // Clima atual validado; ausente se indisponível.
  forecastDays: ForecastDay[]; // Dias completos entre hoje e os quatro seguintes.
  unavailable: Array<'current' | 'daily'>; // Seções indisponíveis para aviso na UI.
  incompleteDaily: boolean; // Indica falta de um ou mais dos cinco dias.
}

export type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'empty' }
  | { status: 'error'; retry: () => void };
