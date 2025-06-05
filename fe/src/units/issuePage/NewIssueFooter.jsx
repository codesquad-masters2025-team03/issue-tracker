import styled from 'styled-components';
import { LargeContainerButton } from '@/base-ui/components/ContainerButtons';
import { GhostButton } from '@/base-ui/components/Button';
import { useNavigate } from 'react-router-dom';
import useDataFetch from '@/hooks/useDataFetch';
import useIssueDetailStore from '@/stores/IssueDetailStore';
import { NEW_ISSUE } from '@/api/newIssue';
import { useAuthStore } from '@/stores/authStore';
import getOptionWithToken from '@/utils/getOptionWithToken/getOptionWithToken';
import { useEffect } from 'react';
import getFormData from '@/utils/common/getFormData';

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  height: 80px;
  border-top: 1px solid ${({ theme }) => theme.border.default};
  margin-top: 16px;
`;

const Wrapper = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;
`;

const ClearBtn = styled(LargeContainerButton)`
  display: flex;
  justify-content: center;
`;

export default function NewIssueFooter({ isValid }) {
  const { response, isLoading, fetchData } = useDataFetch({ fetchType: 'New_Issue' });
  const token = useAuthStore((s) => s.accessToken);
  const issue = useIssueDetailStore((s) => s.issue);
  const assignees = useIssueDetailStore((s) => s.assignees);
  const labels = useIssueDetailStore((s) => s.labels);
  const milestone = useIssueDetailStore((s) => s.milestone);
  const navigator = useNavigate();

  const dataObj = {
    title: issue.title,
    content: issue.content,
    assigneeIds: assignees.map((n) => n.id),
    labelIds: labels.map((n) => n.id),
    milestoneId: milestone.id,
  };
  const POSToption = {
    method: 'POST',
    body: getFormData(dataObj, issue.issueFileUrl),
  };

  function submitHandler() {
    fetchData(NEW_ISSUE, getOptionWithToken(POSToption, token));
  }

  useEffect(() => {
    if (!response?.data?.issue?.issueId) return;
    navigator(`/issue/${response.data.issue.issueId}`);
  }, [response]);
  return (
    <Container>
      <Wrapper>
        <GhostButton onClick={() => navigator('/')}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.2999 4.70026L4.70025 11.2999M4.7002 4.7002L11.2999 11.2999"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>작성취소</span>
        </GhostButton>
        <ClearBtn onClick={submitHandler} disabled={!isValid}>
          완료
        </ClearBtn>
      </Wrapper>
    </Container>
  );
}
