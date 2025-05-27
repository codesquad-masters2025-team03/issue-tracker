/*
itemsArr의 구조
const itemsArr = [{ imgUrl: '~~~', label: 'XXX' isSelect: boolean }, ...];

*/

import styled from 'styled-components';
import { typography } from '@/styles/foundation';
import React from 'react';
import useFilterStore from '@/stores/filterStore';

const ScrollContainer = styled.div`
  height: 350px;
  width: 240px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  ${typography.selected.bold16};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border.default};
  background-color: ${({ theme }) => theme.surface.default};
`;

const Content = styled.button`
  ${typography.available.medium16};
  color: ${({ theme }) => theme.text.default};
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 10px 16px;
  background-color: ${({ theme, $isSelect }) =>
    $isSelect ? theme.surface.bold : theme.surface.default};
  &:hover {
    background-color: ${({ theme }) => theme.surface.bold};
  }
  img {
    width: 20px;
    height: 20px;
  }
`;

const Separator = styled.hr`
  width: 80%;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.border.default};
`;

function getFilterLabel(key) {
  const map = {
    author: '작성자',
    label: '레이블',
    milestone: '마일스톤',
    assignee: '담당자',
  };

  return map[key] || key;
}

// 맵의 콜백 함수
function getDropdownItem(title, item, selectedFilters, onClick) {
  switch (title) {
    case 'label':
      return (
        <Content
          id={item.id}
          $isSelect={selectedFilters[title] === item.id}
          onClick={() => onClick(title, item.id)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="10" cy="10" r="10" fill={item.color} />
          </svg>

          <span>{item.name}</span>
        </Content>
      );
    case 'milestone':
      return (
        <Content
          id={item.id}
          $isSelect={selectedFilters[title] === item.id}
          onClick={() => onClick(title, item.id)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7.75 0C7.94891 0 8.13968 0.0790176 8.28033 0.21967C8.42098 0.360322 8.5 0.551088 8.5 0.75V3H12.134C12.548 3 12.948 3.147 13.264 3.414L15.334 5.164C15.5282 5.32828 15.6842 5.53291 15.7912 5.76364C15.8982 5.99437 15.9537 6.24566 15.9537 6.5C15.9537 6.75434 15.8982 7.00563 15.7912 7.23636C15.6842 7.46709 15.5282 7.67172 15.334 7.836L13.264 9.586C12.9481 9.85325 12.5478 9.99993 12.134 10H8.5V15.25C8.5 15.4489 8.42098 15.6397 8.28033 15.7803C8.13968 15.921 7.94891 16 7.75 16C7.55109 16 7.36032 15.921 7.21967 15.7803C7.07902 15.6397 7 15.4489 7 15.25V10H2.75C2.28587 10 1.84075 9.81563 1.51256 9.48744C1.18437 9.15925 1 8.71413 1 8.25V4.75C1 3.784 1.784 3 2.75 3H7V0.75C7 0.551088 7.07902 0.360322 7.21967 0.21967C7.36032 0.0790176 7.55109 0 7.75 0ZM7.75 8.5H12.134C12.1931 8.49965 12.2501 8.47839 12.295 8.44L14.365 6.69C14.3924 6.66653 14.4145 6.63739 14.4296 6.60459C14.4447 6.57179 14.4525 6.53611 14.4525 6.5C14.4525 6.46389 14.4447 6.42821 14.4296 6.39541C14.4145 6.36261 14.3924 6.33347 14.365 6.31L12.295 4.56C12.2501 4.52161 12.1931 4.50035 12.134 4.5H2.75C2.6837 4.5 2.62011 4.52634 2.57322 4.57322C2.52634 4.62011 2.5 4.6837 2.5 4.75V8.25C2.5 8.388 2.612 8.5 2.75 8.5H7.75Z"
              fill="currentColor"
            />
          </svg>

          <span>{item.name}</span>
        </Content>
      );
    case 'author':
      return (
        <Content
          id={item.id}
          $isSelect={selectedFilters[title] === item.id}
          onClick={() => onClick(title, item.id)}
        >
          <img src={item.imgUrl} alt={item.nickname} />
          <span>{item.nickname}</span>
        </Content>
      );

    default:
      return (
        <Content
          id={item.id}
          $isSelect={selectedFilters[title] === item.id}
          onClick={() => onClick(title, item.id)}
        >
          <img src={item.imgUrl} alt={item.nickname} />
          <span>{item.nickname}</span>
        </Content>
      );
  }
}

// 입력 받은 itemsArr(= 모달 전용 필터 엔트리 아이템들)을 순환하면서 리스트에 보여줘야한다.
// 이때 각 엔트라의 key가 다른데 이걸 로직으로 통합해줘야한다.
// 필터 스크롤을 구성할 떄 필요한건 이미지, 이름, 필터 선택 여부( 이거는 filterStore에서 해당하는 key에 필터 아이템이랑 같은지 비교해야한다)

// 이제 아이템 클릭시 필터 스토어에 업데이트 하는 로직 엮어야한다.
export default function ScrollFilterList({ title, itemsArr }) {
  const selectedFilters = useFilterStore((state) => state.selectedFilters);
  const setFilter = useFilterStore((state) => state.setFilter);

  function clickHandler(key, id) {
    setFilter(key, id);
  }
  return (
    <ScrollContainer>
      <Title>{getFilterLabel(title)}</Title>
      {itemsArr.map((item, idx, arr) => {
        return (
          <React.Fragment key={item.id}>
            {getDropdownItem(title, item, selectedFilters, clickHandler)}
            {idx !== arr.length - 1 && <Separator />}
          </React.Fragment>
        );
      })}
    </ScrollContainer>
  );
}
