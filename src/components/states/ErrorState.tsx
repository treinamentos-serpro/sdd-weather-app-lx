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
        className="rounded-lg bg-accent-500 px-4 py-2 font-medium text-white transition hover:bg-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400"
      >
        Tentar novamente
      </button>
    </div>
  );
}
