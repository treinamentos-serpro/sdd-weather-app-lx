interface ErrorStateProps {
  onRetry: () => void;
  message?: string;
}

export default function ErrorState({
  onRetry,
  message = 'Não foi possível concluir a consulta',
}: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-wrap items-center gap-3 py-4 text-white">
      <p>{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg bg-accent-400 px-4 py-2 font-medium text-night-900 transition hover:bg-accent-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-night-900"
      >
        Tentar novamente
      </button>
    </div>
  );
}
