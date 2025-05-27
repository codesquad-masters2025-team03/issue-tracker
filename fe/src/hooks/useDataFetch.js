/*
설계 목표: 데이터 패치 관련 커스텀 훅 만들기 -> 에러핸들링, 로딩, 데이터 처리 기능 구현 목표
API를 호출해서 데이터를 가져오는 커스텀 훅을 만든다.
서버와 통신하는 동안 로딩 상태와 에러 상태를 관리한다.

1. 입력 : api, fetch 옵션 객체
2. 반환 : 서버 응답값(response), isLoading, error 데이터 통신 상태를 반환한다.
*/
import { useState, useCallback } from 'react';
import { useErrorStore } from '@/stores/errorStore';

export default function useDataFetch({ fetchType }) {
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null); -> 에러 전용 스토어로 대체
  const setError = useErrorStore((state) => state.setError);
  const [response, setResponse] = useState(null);

  //응답 자체를 reponse 상태로 업데이트!
  const fetchData = useCallback(
    async (apiUrl, optionObj = null) => {
      setIsLoading(true);
      try {
        const res = await fetch(apiUrl, optionObj);
        const data = await res.json(); //JSON 파싱 실패시 catch로 감 -> 서버로부터 아예 응답이 안 온 경우에 해당.
        // 서버에서 응답이 왔을 경우?(200번대~500번대) -> 제이슨 파싱 성공  -> 아래 로직 실행
        if (!res.ok) throw new Error(`오류: ${data.message}`);
        if (!data.success) throw new Error(data.message || '요청 실패'); // 서버에서 응답으로 보내주는 에러 메세지 렌더링
        setResponse(data);
      } catch (err) {
        if (err.name === 'TypeError') {
          setError(fetchType, '서버와 연결할 수 없습니다.'); // 네트워크 문제(서버 꺼짐, DNS 오류, CORS 실패 등)
        } else {
          setError(fetchType, err.message);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [fetchType],
  );

  return { response, isLoading, fetchData };
}
