import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import EmptyState from '../../src/components/states/EmptyState';
import ErrorState from '../../src/components/states/ErrorState';
import LoadingState from '../../src/components/states/LoadingState';

describe('Estados de consulta', () => {
  it('anuncia o carregamento em uma região de status', () => {
    render(<LoadingState />);

    expect(screen.getByRole('status')).toHaveTextContent('Carregando...');
  });

  it('permite personalizar a mensagem de carregamento', () => {
    render(<LoadingState message="Buscando previsão..." />);

    expect(screen.getByRole('status')).toHaveTextContent('Buscando previsão...');
  });

  it('anuncia a falha e chama onRetry pelo botão', async () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível concluir a consulta');
    await userEvent.setup().click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('mostra a mensagem de erro informada', () => {
    render(<ErrorState onRetry={vi.fn()} message="Conexão indisponível" />);

    expect(screen.getByRole('alert')).toHaveTextContent('Conexão indisponível');
  });

  it('anuncia o resultado vazio com título e dica', () => {
    render(<EmptyState />);

    const status = screen.getByRole('status');
    expect(screen.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeInTheDocument();
    expect(status).toHaveTextContent('Tente buscar por outro nome de cidade.');
  });

  it('permite personalizar o título e a dica do estado vazio', () => {
    render(<EmptyState title="Nenhuma previsão" hint="Escolha outra cidade." />);

    expect(screen.getByRole('heading', { name: 'Nenhuma previsão' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Escolha outra cidade.');
  });
});
