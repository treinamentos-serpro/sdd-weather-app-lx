interface EmptyStateProps {
  title?: string;
  hint?: string;
}

export default function EmptyState({
  title = 'Nenhuma cidade encontrada',
  hint = 'Tente buscar por outro nome de cidade.',
}: EmptyStateProps) {
  return (
    <div role="status" className="py-4 text-primary">
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted">{hint}</p>
    </div>
  );
}
