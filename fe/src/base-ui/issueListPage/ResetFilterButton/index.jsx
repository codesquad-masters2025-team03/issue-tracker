import useFilterStore from '@/stores/filterStore';
import styled from 'styled-components';
import { typography } from '@/styles/foundation';
import { useApplyQueryParams } from '@/utils/queryParams/useApplyQueryParams';

const TriggerButton = styled.button`
  ${typography.available.medium16}
  width:180px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.text.default};
  svg {
    fill: ${({ theme }) => theme.text.default};
  }
  &:hover {
    opacity: 0.8;
  }
`;
export default function ResetFilterButton() {
  const resetFilters = useFilterStore((state) => state.resetFilters);
  const applyQueryParams = useApplyQueryParams();
  const buttonLabel = '현재의 검색 필터 초기화';

  function resetHandler() {
    resetFilters();
    applyQueryParams({ isOpen: 'true', page: '1' });
  }
  return (
    <TriggerButton onClick={resetHandler}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="20px"
        viewBox="0 -960 960 960"
        width="20px"
        fill="currentColor"
      >
        <path d="M480-192q-120 0-204-84t-84-204q0-120 84-204t204-84q65 0 120.5 27t95.5 72v-99h72v240H528v-72h131q-29-44-76-70t-103-26q-90 0-153 63t-63 153q0 90 63 153t153 63q84 0 144-55.5T693-456h74q-9 112-91 188t-196 76Z" />
      </svg>
      <span>{buttonLabel}</span>
    </TriggerButton>
  );
}
