//
/*
# 사용가이드

## 입력
- toggleType -> 어떤 토글 타입 버튼인지 문자열로 입력한다.(ex. 'label' or 'milestone')
- triggerButtonLabel -> 토글의 트리거 버튼에 어떤 문구를 보여줄 건지 입력한다. (ex. "레이블", "마일스톤")_ 주로 유저에게 보여줄 문구를 작성한다.
- itemsArr -> useFilterModalStore의 filterEntry에서 데이터를 입력한다. (ex. 라벨의 객체 배열, 마일스톤의 객체 배열...)
- pageTypeContext -> 어떤 페이지 타입에서 사용되는지 입력한다. (ex. 'detail' 문자열로 입력


## 로직
해당 컴포넌트에서 다음의 로직이 알아서 실행됩니다.
- 이슈 디테일 스토어 업데이트
- 서버에 PATCH 요청

*/

import styled from 'styled-components';
import { useState, useMemo } from 'react';
import React from 'react';
import { typography } from '@/styles/foundation';
import useIssueDetailStore from '@/stores/IssueDetailStore';
import useDataFetch from '@/hooks/useDataFetch';
import { GetToggleButton } from './GetToggleButton';
import getOptionWithToken from '@/utils/getOptionWithToken/getOptionWithToken';
import AuthorInform from '../AuthorInform'; //상세 이슈 페이지에서 사이드바 PATCH요청시 필요
import GetSelectedElements from './SelectedElements';
import { issueDetailStoreSelectorMap, toggleSelectorMap } from './storeMannager';
import getFormData from '@/utils/common/getFormData';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 990;
`;

const ToggleContainer = styled.div`
  padding: 32px;
  display: flex;
  width: 100%;
  flex-direction: column;
  position: relative;
`;

const MenuTriggerButton = styled.button`
  ${typography.available.medium16};
  color: ${({ theme }) => theme.text.default};
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  z-index: 900;

  &::after {
    content: '';
    transition: transform 0.3s;
    border-right: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
    width: 8px;
    height: 8px;
    transform: ${({ $open }) => ($open ? 'rotate(45deg)' : ' rotate(-45deg)')};
    margin-left: auto;
  }
`;

const SubMenuContainer = styled.div`
  display: ${(props) => (props.open ? 'block' : 'none')};
  z-index: 1000;
`;

const SubMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function getFetchBody(toggleType, value) {
  const typeMap = {
    assignee: 'assigneeId',
    label: 'labelId',
    milestone: 'milestoneId',
  };

  const bodyKey = typeMap[toggleType];
  const body = {
    [bodyKey]: Array.isArray(value)
      ? value.filter((selected) => selected && selected.id).map((selected) => selected.id)
      : value.id,
  };
  // return JSON.stringify(body); -> 멀티파트로 BE에 PATCH 요청으로 인해 수정!
  return getFormData(body);
}

//itemsArr는 객체배열을 받는다/
export default function AddStatusToggle({
  toggleType,
  triggerButtonLabel,
  itemsArr,
  pageTypeContext = null,
  issueFetchHandler = null,
}) {
  const [open, setOpen] = useState(false);
  // const { toggleAssignee, toggleLabel, toggleMilestone } = useIssueDetailStore(
  //   (state) => ({
  //     toggleAssignee: state.toggleAssignee,
  //     toggleLabel: state.toggleLabel,
  //     toggleMilestone: state.toggleMilestone,
  //   }),
  //   shallow,
  // );

  const toggleStatus = useIssueDetailStore(toggleSelectorMap[toggleType]);

  // 현재 선택 항목을 항상 구독해 둔다. (detail 이외의 페이지라도 isSelected 계산에 사용)
  const selected = useIssueDetailStore(issueDetailStoreSelectorMap[toggleType]);

  const fetchType = '이슈 상세';
  // const fetchData = useDataFetch({ fetchType });

  // function handleToggleOption(type, item) {
  //   switch (type) {
  //     case 'label':
  //       toggleLabel(item);
  //       break;
  //     case 'milestone':
  //       toggleMilestone(item);
  //       break;

  //     default:
  //       toggleAssignee(item);
  //       break;
  //   }
  // }

  function handleCloseOverlay(context) {
    setOpen((prev) => !prev);
    if (context === 'detail') {
      const PATCHoption = {
        method: 'PATCH',
        body: getFetchBody(toggleType, selected),
      };
      const accessToken = localStorage.getItem('token');
      issueFetchHandler('PATCH', PATCHoption, accessToken);
    }
  }
  function handleToggle() {
    setOpen((prev) => !prev);
  }

  const isEmpty = (value) => {
    if (Array.isArray(value)) return value?.length === 0;
    if (value && typeof value === 'object') return Object.keys(value)?.length === 0;
    return true; // null, undefined, '' 등도 "빈 값"으로 취급
  };
  return (
    <ToggleContainer>
      <MenuTriggerButton $open={open} onClick={handleToggle}>
        {triggerButtonLabel}
      </MenuTriggerButton>
      <SubMenuContainer open={open}>
        <SubMenuWrapper>
          {itemsArr?.map((item) => {
            const isSelected =
              toggleType === 'milestone'
                ? selected?.id === item.id
                : Array.isArray(selected) && selected.some((v) => v.id === item.id);

            return (
              <GetToggleButton
                key={item.id}
                toggleType={toggleType}
                item={item}
                isSelected={isSelected}
                onClick={toggleStatus}
              />
            );
          })}
        </SubMenuWrapper>
      </SubMenuContainer>
      {open && <Overlay onClick={() => handleCloseOverlay(pageTypeContext)} />}
      {!open && !isEmpty(selected) && <GetSelectedElements type={toggleType} />}
    </ToggleContainer>
  );
}
