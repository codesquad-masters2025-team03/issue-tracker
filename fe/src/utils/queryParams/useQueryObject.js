// 현재의 쿼리파람을 js 객체로 전환

import { useSearchParams } from 'react-router-dom';

export default function useQueryObject() {
  const [searchParams] = useSearchParams();
  return Object.fromEntries([...searchParams.entries()]);
}
