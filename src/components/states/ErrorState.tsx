interface ErrorStateProps {
  onRetry: () => void;
  message?: string;
}

export default function ErrorState({
  onRetry,
  message = 'Não foi possível concluir a consulta',
}: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-wrap items-center gap-3 py-4 text-primary">
      <p>{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg bg-action px-4 py-2 font-medium text-action-contrast transition hover:bg-action-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-app"
      >
        Tentar novamente
      </button>
    </div>
  );
}
