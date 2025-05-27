/*
설계 방향: 상위에서 prop을 전달 받는게 아니라. 쿼리파람 추출, 조작해서 하위의 컴포넌트에게 prop을 전달한다.
항상 메인페이지 ("/")의 url 상태일 경우에는 디폴트 값으로 isOpen=true인 경우와 똑같이 처리한다.
나머지 필터 조작도 prop을 전달하는게 아니라 쿼리파람을 조작함으로 상태를 변경한다.
*/

import styled from 'styled-components';
import { FilterSearchField } from '@/base-ui/issueListPage/mainPageHeaderTap/FilteredTab';
import { DropdownMenuTemplate } from '@/utils/dropDown/DropdownMenuTemplate';
import useFilterStore from '@/stores/filterStore';
import { useAuthStore } from '@/stores/authStore';
import useQueryObject from '@/utils/queryParams/useQueryObject';
import { useApplyQueryParams } from '@/utils/queryParams/useApplyQueryParams';

const Container = styled.div`
  border: 1px solid ${({ theme }) => theme.border.default};
  padding-left: 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  min-width: 560px;
  max-width: 760px;
  background-color: ${({ theme, $isActive }) =>
    $isActive ? theme.surface.strong : theme.surface.bold};
`;

function getMenuItems(filteredObj, userId, menuClickHandler) {
  const issueFilterItems = [
    {
      label: '열린 이슈',
      isSelected: filteredObj.isOpen === 'true',
      onClick: () => menuClickHandler('isOpen', true),
    },
    {
      label: '내가 작성한 이슈',
      isSelected: filteredObj.author === userId?.toString(),
      onClick: () => menuClickHandler('author', userId), //백엔드와 api 협의 후 추가 구현 필요
    },
    {
      label: '나에게 할당된 이슈',
      isSelected: filteredObj.assignee === userId?.toString(),
      onClick: () => menuClickHandler('assignee', userId), //백엔드와 api 협의 후 추가 구현 필요
    },
    {
      label: '내가 댓글을 남긴 이슈',
      isSelected: filteredObj.commentedBy === userId?.toString(),
      onClick: () => menuClickHandler('commentedBy', userId), //백엔드와 api 협의 후 추가 구현 필요
    },
    {
      label: '닫힌 이슈',
      isSelected: filteredObj.isOpen === 'false',
      onClick: () => menuClickHandler('isOpen', false),
    },
  ];

  return issueFilterItems;
}

export default function FilterBar() {
  const filteredObj = useQueryObject();
  const isActive = Object.keys(filteredObj).length > 0;
  const setFilter = useFilterStore((state) => state.setFilter);
  const initFilter = useFilterStore((state) => state.initFilter);
  const userId = useAuthStore((state) => state.loginId);
  const applyQueryParams = useApplyQueryParams();
  const items = getMenuItems(filteredObj, userId, menuClickHandler);

  function menuClickHandler(key, value) {
    initFilter(filteredObj);
    setFilter(key, value);
    const updated = useFilterStore.getState().selectedFilters;
    applyQueryParams(updated);
  }

  return (
    <Container $isActive={isActive}>
      <DropdownMenuTemplate
        triggerLabel="필터"
        menuWidth="240px"
        label={'이슈 필터'}
        items={items}
      />
      <FilterSearchField selectedFilters={filteredObj} />
    </Container>
  );
}
