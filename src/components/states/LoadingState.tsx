interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Carregando...' }: LoadingStateProps) {
  return (
    <p role="status" className="py-4 text-sm text-muted">
      {message}
    </p>
  );
}
