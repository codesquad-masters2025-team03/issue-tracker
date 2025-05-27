import styled from 'styled-components';
import { useEffect, useState } from 'react';
import useIssuesStore from '@/stores/issuesStore';
import useDataFetch from '@/hooks/useDataFetch';
import { ISSUES_URL } from '@/api/issues';
import MainPageHeaderTap from '@/units/mainPageHeaderTap';
import IsOpenFilter from '@/units/kanbanHeader/IsOpenFilter';
import useFilterModalStore from '@/stores/detailFilterModalStore';
import useFilterStore from '@/stores/filterStore';
import DetailFilterModal from '@/units/detailFilterModal';
import { useRef } from 'react';
import DetailFilterTriggerButton from '@/units/detailFilterModal/DetailFilterTriggerButton';
import { useLocation } from 'react-router-dom';
import { useApplyQueryParams } from '@/utils/queryParams/useApplyQueryParams';
import KanbanMain from '@/units/KanbanMain';
import ResetFilterButton from '@/base-ui/issueListPage/ResetFilterButton';
import useCheckBoxStore from '@/stores/useCheckBoxStore';
import TotalCheckBox from '@/units/kanbanHeader/TotalCheckBox';
import SelectDisplayer from '@/base-ui/issueListPage/IssueListHeader/SelectDisplayer';
import StatusEditDropDown from '@/units/kanbanHeader/StatusEditDropDown';
import deepEqualFast from '@/units/deepEqualFast/deepEqualFast';
import useLabelStore from '@/stores/labelStore';
import getOptionWithToken from '@/utils/getOptionWithToken/getOptionWithToken';
import { useAuthStore } from '@/stores/authStore';
import { mapToUnifiedId } from '@/utils/mapToUnifiedId/mapToUnifiedId';
import { mapIssueListToUnifiedId } from '@/utils/mapToUnifiedId/mapIssueListToUnifiedId';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px 80px;
`;
const Kanban = styled.div`
  border: 1px solid ${({ theme }) => theme.border.default};
  display: flex;
  flex-direction: column;
  border-radius: 16px;
`;

const KanbanHeader = styled.div`
  padding: 16px 32px;
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.surface.bold};
  border-bottom: 1px solid ${({ theme }) => theme.border.default};
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

const HeaderLeft = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;
`;
const HeaderRight = styled.div`
  display: flex;
  gap: 32px;
`;

function selectedCounter(idObject) {
  return Object.values(idObject).reduce((acc, value) => {
    if (!value) return acc;
    acc += 1;
    return acc;
  }, 0);
}

function getIsSelected(idObject) {
  return Object.values(idObject).some((value) => value === true);
}

export default function IssueListPage() {
  const fetchType = '메인 페이지';
  // 이슈 선택 로직 추후에 구현
  const { response, isLoading, fetchData } = useDataFetch({ fetchType });

  const issues = useIssuesStore((state) => state.issues);
  const setIssues = useIssuesStore((state) => state.setIssues);
  const toggleIssues = useIssuesStore((state) => state.toggleIssues);
  const setMetaData = useIssuesStore((state) => state.setMetaData);
  const metaData = useIssuesStore((state) => state.metaData); // 페이지네이션에 필요
  const setFilterData = useFilterModalStore((state) => state.setFilterData);
  const isActive = useFilterModalStore((state) => state.isActive);
  const selectedFilters = useFilterStore((state) => state.selectedFilters);
  const prevDataRef = useRef(null);
  const location = useLocation(); // location.search → '?label=1&milestone=2&page=1'
  const applyQueryParams = useApplyQueryParams();
  const queryParams = new URLSearchParams(location.search);
  const hasActiveFilter = Object.keys(Object.fromEntries(queryParams)).some(
    (key) => key !== 'isOpen' && key !== 'page',
  );
  const setEntry = useCheckBoxStore((state) => state.setEntry);
  const checkBoxEntry = useCheckBoxStore((state) => state.checkBoxEntry);
  const isSelected = getIsSelected(checkBoxEntry);
  const setLabels = useLabelStore((state) => state.setLabels);
  const accessToken = useAuthStore((state) => state.accessToken);
  const GEToptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  useEffect(() => {
    if (!location.search || location.search === '?') {
      // location.search가 비어있다면 디폴트 필터 적용
      applyQueryParams(selectedFilters); // selectedFilters 초기값이 디폴트 필터임
    }

    fetchData(`${ISSUES_URL}${location.search}`, getOptionWithToken(GEToptions, accessToken));
  }, [location.search]);

  useEffect(() => {
    if (!response?.data) return;
    // const fetchedData = response.data;
    const {
      issues: rawIssues,
      users,
      labels: rawLabels,
      milestones: rawMilestones,
      metaData,
    } = response.data;

    const labels = mapToUnifiedId(rawLabels);
    const milestones = mapToUnifiedId(rawMilestones);
    const issues = mapIssueListToUnifiedId(rawIssues);

    const currentData = issues;
    const prevData = prevDataRef.current;
    // 객체 내용이 진짜로 바뀐 경우에만 실행

    const hasChanged = !deepEqualFast(currentData, prevData);

    if (!hasChanged) return;
    prevDataRef.current = currentData; // 현재 값을 기억해둠

    setIssues(currentData); // ✅ 상태 변화 감지해서 후처리
    setMetaData(metaData);
    setFilterData(users, labels, milestones);
    setLabels(labels);
    setEntry(issues); //체크 박스 엔트리 초기화
  }, [response?.data]);

  return (
    <Container>
      <MainPageHeaderTap />
      {hasActiveFilter && <ResetFilterButton />}
      <Kanban>
        <KanbanHeader>
          <HeaderLeft>
            <TotalCheckBox />
            {isSelected ? (
              <SelectDisplayer count={selectedCounter(checkBoxEntry)} />
            ) : (
              <IsOpenFilter />
            )}
          </HeaderLeft>
          <HeaderRight>
            {isSelected ? (
              <StatusEditDropDown
                onPatchSuccess={() =>
                  fetchData(
                    `${ISSUES_URL}${location.search}`,
                    getOptionWithToken(GEToptions, accessToken),
                  )
                }
              />
            ) : (
              <DetailFilterTriggerButton />
            )}
          </HeaderRight>
        </KanbanHeader>
        <KanbanMain />
      </Kanban>
      {isActive && <DetailFilterModal />}
    </Container>
  );
}
