const dayFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
  day: '2-digit',
  month: '2-digit',
  timeZone: 'UTC',
});

const weekdayFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
  timeZone: 'UTC',
});

const shortDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  timeZone: 'UTC',
});

function parseLocalDate(date: string): Date {
  return new Date(`${date}T00:00:00Z`);
}

export function formatDayLabel(date: string, index?: number): string {
  if (index === 0) {
    return 'Hoje';
  }

  if (index === 1) {
    return 'Amanhã';
  }

  const localDate = parseLocalDate(date);
  return index === undefined ? dayFormatter.format(localDate) : weekdayFormatter.format(localDate);
}

export function getShortDate(date: string): string {
  return shortDateFormatter.format(parseLocalDate(date));
}
