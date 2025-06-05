export default function formatDateToDotYMD(str) {
  if (!str) return '';
  const datePart = str.split('T')[0]; // "2025-09-30"
  const [year, month, day] = datePart.split('-');
  return `${year}.${month}.${day}`;
}
