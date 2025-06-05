export default function parseDateString(str) {
  // "1111.11.22" → "1111-11-22"
  const isoString = str.replace(/\./g, '-');
  // new Date("1111-11-22") → 정상적으로 Date 객체 생성
  const date = new Date(isoString);
  // 유효성 검사도 필요하면 아래처럼!
  return isNaN(date.getTime()) ? null : date;
}
