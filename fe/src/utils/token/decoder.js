// export default function tokenDecoder(token) {
//   const payload = token.split('.')[1];
//   const decoded = JSON.parse(atob(payload));
//   return decoded;
// }

export default function tokenDecoder(token) {
  const payload = token.split('.')[1];

  // base64url → base64 변환
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');

  const decoded = JSON.parse(atob(padded));
  return decoded;
}
