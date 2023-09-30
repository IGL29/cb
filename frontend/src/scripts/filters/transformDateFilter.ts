export function transformDateFilter(dateValue: string): string {
  const date = new Date(dateValue);
  const result = date
    .toLocaleString('ru', { day: 'numeric', month: 'long', year: 'numeric' })
    .match(/^\d+\s+[а-яёА-ЯЁ]+\s+\d+/);

  if (result) {
    return result[0];
  }
  return dateValue;
}
