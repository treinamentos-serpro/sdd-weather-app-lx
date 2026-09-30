import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SearchBar from '../../src/components/SearchBar';

describe('SearchBar', () => {
  it('calls onSearch with the trimmed city name', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByLabelText('Nome da cidade'), '  São Paulo  ');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).toHaveBeenCalledOnce();
    expect(onSearch).toHaveBeenCalledWith('São Paulo');
  });

  it('does not call onSearch for an empty or whitespace-only input', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByLabelText('Nome da cidade'), '   ');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Informe o nome de uma cidade.');
  });

  it('does not call onSearch for an empty input', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar onSearch={onSearch} />);

    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Informe o nome de uma cidade.');
  });

  it('preserves accents, apostrophes and internal spaces when searching', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByLabelText('Nome da cidade'), "  São José d'Água  ");
    await user.keyboard('{Enter}');

    expect(onSearch).toHaveBeenCalledWith("São José d'Água");
  });

  it('disables the input and button when disabled prop is true', () => {
    render(<SearchBar onSearch={vi.fn()} disabled />);

    expect(screen.getByLabelText('Nome da cidade')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeDisabled();
  });

  it('exposes a search landmark for the form', () => {
    render(<SearchBar onSearch={vi.fn()} />);

    expect(screen.getByRole('search', { name: 'Buscar cidade' })).toBeInTheDocument();
  });
});
