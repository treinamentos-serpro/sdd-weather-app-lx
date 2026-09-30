import { type FormEvent, useId, useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export default function SearchBar({ onSearch, disabled = false }: SearchBarProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();
  const errorId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = value.trim();

    if (!trimmed) {
      setError('Informe o nome de uma cidade.');
      return;
    }

    setError(null);
    onSearch(trimmed);
  };

  return (
    <form
      role="search"
      aria-label="Buscar cidade"
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md sm:flex-row sm:items-start"
    >
      <div className="flex-1">
        <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-white/80">
          Nome da cidade
        </label>
        <input
          id={inputId}
          type="text"
          value={value}
          disabled={disabled}
          onChange={(event) => {
            setValue(event.target.value);
            if (error) {
              setError(null);
            }
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          placeholder="Ex.: São Paulo"
          className="w-full rounded-xl border border-white/10 bg-night-900/60 px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {error && (
          <p id={errorId} role="alert" className="mt-1 text-sm text-red-400">
            {error}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={disabled}
        className="rounded-xl bg-accent-500 px-4 py-2 font-medium text-white transition hover:bg-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-6"
      >
        Buscar
      </button>
    </form>
  );
}
