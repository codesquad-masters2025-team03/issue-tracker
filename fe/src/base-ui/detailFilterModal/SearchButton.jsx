import styled from 'styled-components';
import { typography } from '@/styles/foundation';
import { LargeContainerButton } from '../components/ContainerButtons';
import useFilterStore from '@/stores/filterStore';
import { useApplyQueryParams } from '@/utils/queryParams/useApplyQueryParams';
import useFilterModalStore from '@/stores/detailFilterModalStore';

const StyledButton = styled(LargeContainerButton)`
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
`;

export default function SearchButton({ children }) {
  const selectedFilters = useFilterStore((state) => state.selectedFilters);
  const setFilter = useFilterStore((state) => state.setFilter);
  const resetFilters = useFilterStore((state) => state.resetFilters);

  const closeModal = useFilterModalStore((state) => state.closeModal);
  const applyQueryParams = useApplyQueryParams();

  function searchHandler() {
    closeModal();
    setFilter('page', 1);
    setFilter('isOpen', true);
    applyQueryParams(selectedFilters);
    resetFilters();
  }
  return <StyledButton onClick={() => searchHandler()}>{children}</StyledButton>;
}
