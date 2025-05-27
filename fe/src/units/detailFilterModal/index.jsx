import React from 'react';
import styled from 'styled-components';
import { ScrollFilterList, SearchButton } from '@/base-ui/detailFilterModal';
import { typography } from '@/styles/foundation';
import useFilterModalStore from '@/stores/detailFilterModalStore';
import useFilterStore from '@/stores/filterStore';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* 배경 어두움 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Container = styled.div`
  padding: 16px;
  background-color: ${({ theme }) => theme.surface.default};
  position: relative;
  color: ${({ theme }) => theme.text.default};
  border-radius: 8px;
  z-index: 1000;

  animation: slideDown 0.2s ease-out forwards;

  @keyframes slideDown {
    0% {
      transform: translateY(-20px);
      opacity: 0;
    }
    60% {
      transform: translateY(5px);
      opacity: 1;
    }
    100% {
      transform: translateY(0px);
      opacity: 1;
    }
  }
`;

const Header = styled.div`
  ${typography.display.bold32};
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100px;
`;

const Body = styled.div`
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border.default};
  display: flex;
  overflow: hidden;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 120px;
  padding: 30px 0px;
`;

const CloseIcon = styled.svg`
  fill: ${({ theme }) => theme.text.default};

  &:hover {
    fill: ${({ theme }) => theme.danger.border};
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
`;

const SearchIcon = styled.svg`
  fill: ${({ theme }) => theme.surface.default};
`;

const Title = styled.div`
  position: absolute;
  top: 24px;
  left: 30px;
`;

// 외부에서 prop을 받는게 아니라 전역의 store를 끌고 와서 상태를 변경한다.
export default function DetailFilterModal() {
  const filterEntry = useFilterModalStore((state) => state.filterEntry);
  const closeModal = useFilterModalStore((state) => state.closeModal);

  const resetFilters = useFilterStore((state) => state.resetFilters); //검색 버튼의 콜백함수에 사용
  const titleLabel = '상세필터';
  const searchButton = '필터 적용';

  function closeModalHandler() {
    resetFilters();
    closeModal();
  }
  return (
    <Overlay onClick={closeModalHandler}>
      <Container onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{titleLabel}</Title>
          <CloseButton onClick={closeModalHandler}>
            <CloseIcon
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </CloseIcon>
          </CloseButton>
        </Header>
        <Body>
          {Object.entries(filterEntry).map((entryArr) => {
            return (
              //row방향 필터 4개 스크롤 렌더 로직
              <React.Fragment key={entryArr[0]}>
                <ScrollFilterList title={entryArr[0]} itemsArr={entryArr[1]} />
              </React.Fragment>
            );
          })}
        </Body>
        <Footer>
          <SearchButton>
            <SearchIcon
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </SearchIcon>
            <span>{searchButton}</span>
          </SearchButton>
        </Footer>
      </Container>
    </Overlay>
  );
}
