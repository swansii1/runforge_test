const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });
const timeFormatter = new Intl.DateTimeFormat("en", { timeStyle: "short" });

export function formatDateTimeParts(value: string) {
  const timestamp = new Date(value);
  return { date: dateFormatter.format(timestamp), time: timeFormatter.format(timestamp) };
}

export function formatDateTime(value: string): string {
  const { date, time } = formatDateTimeParts(value);
  return `${date}, ${time}`;
}
