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

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
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
  z-index: 1000;

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

//itemsArr는 객체배열을 받는다/
export default function AddStatusToggle({
  toggleType,
  triggerButtonLabel,
  itemsArr,
  pageTypeContext = null,
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
      /*
      BE 에서 API 나와야 적용 가능
      - PATCH 할때 구조 협의 후 구현 ***TODO***      
      - fetchData()
      */
    }
  }
  function handleToggle() {
    setOpen((prev) => !prev);
  }

  return (
    <ToggleContainer>
      <MenuTriggerButton $open={open} onClick={handleToggle}>
        {triggerButtonLabel}
      </MenuTriggerButton>
      <SubMenuContainer open={open}>
        <SubMenuWrapper>
          {itemsArr.map((item) => {
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
      {!open && <GetSelectedElements type={toggleType} />}
    </ToggleContainer>
  );
}
