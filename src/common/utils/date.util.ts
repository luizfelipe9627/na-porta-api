export function formatDateTimeWithTimezone(date: Date): string {
  return (
    new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    })
      .format(date)
      .replace(' ', 'T') + '-03:00'
  );
}
