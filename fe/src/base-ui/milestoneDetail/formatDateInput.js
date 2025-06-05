export default function formatDateInput(value) {
  // 숫자만 추출
  const numbers = value.replace(/\D/g, '').slice(0, 8); // 최대 8자리
  const parts = [];

  if (numbers?.length > 4) {
    parts.push(numbers.slice(0, 4)); // YYYY
    if (numbers?.length > 6) {
      parts.push(numbers.slice(4, 6)); // MM
      parts.push(numbers.slice(6, 8)); // DD
    } else {
      parts.push(numbers.slice(4, 6)); // MM
    }
  } else {
    parts.push(numbers);
  }

  return parts.join('.');
}
