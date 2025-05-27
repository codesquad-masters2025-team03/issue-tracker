export default function getOptionWithToken(options, token) {
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };
  const option = { ...options, headers };
  return option;
}
