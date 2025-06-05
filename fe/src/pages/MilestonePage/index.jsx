import { OpenMilestoneButton, CloseMilestoneButton } from '@/base-ui/milestoneDetail';
import styled from 'styled-components';
import MilestoneLabelHeader from '@/units/common/MilestoneLabelHeader';
import useDataFetch from '@/hooks/useDataFetch';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GET_MILESTONE } from '@/api/milestones';
import getOptionWithToken from '@/utils/getOptionWithToken/getOptionWithToken';
import useMilestoneStore from '@/stores/milestoneStore';
import MilestoneCreateForm from '@/base-ui/milestoneDetail/MilestoneCreateForm';
import { getPatchUrl, POST_MILESTONE, DELETE_MILESTONE } from '@/api/milestones';
import MilestoneItem from '@/units/milestone/MilestoneItem';
import parseDateString from '@/utils/common/parseDateString';

export default function MilestonePage() {
  const { response, fetchData } = useDataFetch({ fetchType: 'Milestone' });
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [searchParam, setSearchParam] = useSearchParams();
  const milestone = useMilestoneStore((s) => s.milestone);
  const initMilestones = useMilestoneStore((s) => s.initMilestones);
  const reFetch = useRef(true);
  const accessToken = localStorage.getItem('token');

  function reFetchHandler(boolean) {
    reFetch.current = boolean;
  }

  const GEToptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  async function submitHandler({
    fetchMethod,
    name,
    isOpen,
    milestoneId = null,
    description = null,
    endDate = null,
    setterFn = null,
  }) {
    const isPatch = fetchMethod === 'PATCH';
    const API = isPatch ? getPatchUrl(milestoneId) : POST_MILESTONE;
    const body = { name, description, isOpen, endDate: parseDateString(endDate) };
    const fetchOption = {
      method: fetchMethod,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };
    const { ok } = await fetchData(API, getOptionWithToken(fetchOption, accessToken));
    if (ok) {
      reFetchHandler(true);
      if (setterFn) {
        setterFn(false);
      } else {
        setIsAddTableOpen(false);
      }
    }
  }

  function deleteHandler(milestoneId) {
    fetchData(DELETE_MILESTONE(milestoneId), getOptionWithToken({ method: 'DELETE' }, accessToken));
    reFetchHandler(true);
  }

  function statusHandler({ isOpen, milestoneId, name, description, endDate }) {
    const API = getPatchUrl(milestoneId);
    const fetchOption = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, endDate, isOpen: !isOpen }),
    };
    fetchData(API, getOptionWithToken(fetchOption, accessToken));
    reFetchHandler(true);
  }
  useEffect(() => {
    if (!searchParam.has('isOpen')) {
      setSearchParam({ isOpen: 'true' }); // selectedFilters 초기값이 디폴트 필터임
      return;
    }
    //항상 현재의 쿼리파람을 기준으로 GET 요청
    // 현재의 마일스톤 페이지에서 마일스톤 조작 액션이 일어나면 항상 GET 요청으로 새로운 데이터를 이 스코프에서 받아온다.
    if (!reFetch.current) return;
    fetchData(`${GET_MILESTONE}?${searchParam.toString()}`, getOptionWithToken(GEToptions, accessToken));
    reFetchHandler(false);
  }, [searchParam, response]);

  useEffect(() => {
    //데이터 GET 으로 받아오면 스토어 초기화 하는 로직
    if (!response?.data) return;
    initMilestones(response.data);
  }, [response]);

  return (
    <Container>
      <MilestoneLabelHeader
        isLabel={false}
        isValid={!isAddTableOpen}
        addHandler={() => setIsAddTableOpen(true)}
      />
      {isAddTableOpen && (
        <MilestoneCreateForm
          isAdd={true}
          onCancel={() => setIsAddTableOpen(false)}
          onSubmit={(data) => submitHandler({ ...data, fetchMethod: 'POST' })}
        />
      )}
      <Kanban>
        <KanbanHeader>
          <HeaderLeft>
            <OpenMilestoneButton
              isOpen={searchParam.get('isOpen') === 'true'}
              number={milestone.openCount}
              onClick={() => {
                setSearchParam({ isOpen: 'true' });
                reFetchHandler(true);
              }}
            />
            <CloseMilestoneButton
              isOpen={searchParam.get('isOpen') === 'true'}
              number={milestone.closedCount}
              onClick={() => {
                setSearchParam({ isOpen: 'false' });
                reFetchHandler(true);
              }}
            />
          </HeaderLeft>
        </KanbanHeader>
        {milestone.milestones?.map((m) => {
          return (
            <MilestoneItem
              milestoneObj={m}
              submitHandler={submitHandler}
              statusHandler={statusHandler}
              deleteHandler={deleteHandler}
            />
          );
        })}
      </Kanban>
    </Container>
  );
}

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
  overflow: hidden;
`;

const KanbanHeader = styled.div`
  padding: 16px 32px;
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.surface.bold};
  border-bottom: 1px solid ${({ theme }) => theme.border.default};
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

const HeaderLeft = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
`;
