import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../src/App';
import { type UseWeatherResult, useWeather } from '../../src/hooks/useWeather';
import { mockWeatherData } from '../../src/mocks/weather';

vi.mock('../../src/hooks/useWeather', () => ({
  useWeather: vi.fn(),
}));

const useWeatherMock = vi.mocked(useWeather);
const search = vi.fn(async () => undefined);
const selectCity = vi.fn(async () => undefined);
const retry = vi.fn(async () => undefined);

function weatherState(overrides: Partial<UseWeatherResult> = {}): UseWeatherResult {
  return {
    status: 'idle',
    data: null,
    cities: [],
    error: null,
    query: '',
    search,
    selectCity,
    retry,
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  useWeatherMock.mockReturnValue(weatherState());
});

describe('App', () => {
  it('apresenta tema claro, busca, unidade e orientação no estado inicial', () => {
    const { container } = render(<App />);

    expect(container.firstElementChild).toHaveAttribute('data-theme', 'light');
    expect(screen.getByRole('button', { name: 'Claro' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('heading', { name: 'Clima' })).toBeInTheDocument();
    expect(screen.getByRole('search', { name: 'Buscar cidade' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Unidade de temperatura' })).toBeInTheDocument();
    expect(screen.getByText('Consulte o clima da sua cidade.')).toBeInTheDocument();
  });

  it('permite alternar entre os temas claro e escuro', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.click(screen.getByRole('button', { name: 'Escuro' }));
    expect(container.firstElementChild).toHaveAttribute('data-theme', 'dark');
    expect(screen.getByRole('button', { name: 'Escuro' })).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('button', { name: 'Claro' }));
    expect(container.firstElementChild).toHaveAttribute('data-theme', 'light');
  });

  it('envia a busca ao hook pelo teclado', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('textbox', { name: 'Nome da cidade' }), '  Recife  ');
    await user.keyboard('{Enter}');

    expect(search).toHaveBeenCalledWith('Recife');
  });

  it('anuncia loading e desabilita a busca', () => {
    useWeatherMock.mockReturnValue(weatherState({ status: 'loading' }));
    render(<App />);

    expect(screen.getByRole('status')).toHaveTextContent('Carregando...');
    expect(screen.getByRole('textbox', { name: 'Nome da cidade' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeDisabled();
  });

  it('mostra o estado vazio sem dados meteorológicos', () => {
    useWeatherMock.mockReturnValue(weatherState({ status: 'empty' }));
    render(<App />);

    expect(screen.getByRole('status')).toHaveTextContent('Nenhuma cidade encontrada');
    expect(screen.queryByRole('region', { name: 'Clima atual' })).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Previsão de 5 dias' })).not.toBeInTheDocument();
  });

  it('mostra o erro do hook e aciona retry', async () => {
    useWeatherMock.mockReturnValue(weatherState({ status: 'error', error: 'Falha de rede.' }));
    render(<App />);

    expect(screen.getByRole('alert')).toHaveTextContent('Falha de rede.');
    await userEvent.setup().click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(retry).toHaveBeenCalledOnce();
  });

  it('apresenta o sucesso e converte apenas a unidade da UI', async () => {
    useWeatherMock.mockReturnValue(weatherState({ status: 'success', data: mockWeatherData }));
    const user = userEvent.setup();
    render(<App />);

    expect(
      within(screen.getByRole('region', { name: 'Clima atual' })).getByText('20°C'),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole('region', { name: 'Previsão de 5 dias' })).getAllByRole('listitem'),
    ).toHaveLength(5);

    await user.click(screen.getByRole('button', { name: '°F' }));
    expect(screen.getByText('69°F')).toBeInTheDocument();
    expect(screen.getByText('Máx 77°F / Mín 61°F')).toBeInTheDocument();
    expect(search).not.toHaveBeenCalled();
  });
});
