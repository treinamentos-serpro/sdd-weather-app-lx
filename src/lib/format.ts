const dayFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
  day: '2-digit',
  month: '2-digit',
  timeZone: 'UTC',
});

export function formatDayLabel(date: string): string {
  return dayFormatter.format(new Date(`${date}T00:00:00Z`));
}
