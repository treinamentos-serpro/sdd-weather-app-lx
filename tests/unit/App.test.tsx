import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import App from '../../src/App';
import { mockWeatherData } from '../../src/mocks/weather';

describe('App com dados de exemplo', () => {
  it('apresenta a marca, busca, clima atual e cinco dias por padrão', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Clima' })).toBeInTheDocument();
    expect(screen.getByRole('search', { name: 'Buscar cidade' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Unidade de temperatura' })).toBeInTheDocument();
    expect(
      within(screen.getByRole('region', { name: 'Clima atual' })).getByText('20°C'),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole('region', { name: 'Previsão diária' })).getAllByRole('listitem'),
    ).toHaveLength(5);
  });

  it('converte as temperaturas apenas na apresentação ao alternar a unidade', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '°F' }));
    expect(screen.getByRole('button', { name: '°F' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('69°F')).toBeInTheDocument();
    expect(screen.getByText('Máx 77°F / Mín 61°F')).toBeInTheDocument();
    expect(mockWeatherData.current?.temperatureCelsius).toBe(20.4);

    await user.click(screen.getByRole('button', { name: '°C' }));
    expect(screen.getByText('20°C')).toBeInTheDocument();
    expect(screen.getByText('Máx 25°C / Mín 16°C')).toBeInTheDocument();
  });

  it('permite alternar a unidade e buscar uma cidade pelo teclado', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.tab();
    expect(screen.getByRole('button', { name: '°C' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: '°F' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByText('69°F')).toBeInTheDocument();

    await user.tab();
    expect(screen.getByRole('textbox', { name: 'Nome da cidade' })).toHaveFocus();
    await user.type(screen.getByRole('textbox', { name: 'Nome da cidade' }), 'Outra cidade');
    await user.tab();
    expect(screen.getByRole('button', { name: 'Buscar' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('status')).toHaveTextContent('Nenhuma cidade encontrada');
  });

  it('retira o resultado anterior quando a busca não encontra a cidade no mock', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('textbox', { name: 'Nome da cidade' }), 'Outra cidade');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(screen.getByRole('status')).toHaveTextContent('Nenhuma cidade encontrada');
    expect(screen.queryByRole('region', { name: 'Clima atual' })).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Previsão diária' })).not.toBeInTheDocument();

    await user.clear(screen.getByRole('textbox', { name: 'Nome da cidade' }));
    await user.type(screen.getByRole('textbox', { name: 'Nome da cidade' }), 'são paulo');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(screen.getByRole('region', { name: 'Clima atual' })).toBeInTheDocument();
  });

  it('mostra o estado inicial sem resultados', () => {
    render(<App initialState={{ status: 'idle' }} />);

    expect(screen.getByText('Consulte o clima da sua cidade.')).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Clima atual' })).not.toBeInTheDocument();
  });

  it('anuncia o carregamento quando o estado é loading', () => {
    render(<App initialState={{ status: 'loading' }} />);

    expect(screen.getByRole('status')).toHaveTextContent('Carregando...');
  });

  it('mostra o estado vazio sem dados anteriores', () => {
    render(<App initialState={{ status: 'empty' }} />);

    expect(screen.getByRole('status')).toHaveTextContent('Nenhuma cidade encontrada');
    expect(screen.queryByRole('region', { name: 'Previsão diária' })).not.toBeInTheDocument();
  });

  it('mostra erro e aciona a retentativa fornecida pelo estado', async () => {
    const retry = vi.fn();
    render(<App initialState={{ status: 'error', retry }} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível concluir a consulta');
    await userEvent.setup().click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
