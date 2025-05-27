import CloseIssueButton from '@/base-ui/issueListPage/IssueListHeader/CloseIssueButton';
import OpenIssueButton from '@/base-ui/issueListPage/IssueListHeader/OpenIssueButton';
import styled from 'styled-components';
import useIssuesStore from '@/stores/issuesStore';
import { useApplyQueryParams } from '@/utils/queryParams/useApplyQueryParams';
import useQueryObject from '@/utils/queryParams/useQueryObject';

const Container = styled.div`
  display: flex;
  gap: 24px;
`;

export default function IsOpenFilter() {
  const metaData = useIssuesStore((state) => state.metaData);
  const queryObject = useQueryObject();
  const applyQueryParams = useApplyQueryParams();

  function buttonHandler(isOpen) {
    queryObject.page = 1;
    queryObject.isOpen = isOpen;
    applyQueryParams(queryObject);
  }

  return (
    <Container>
      <OpenIssueButton onClick={() => buttonHandler(true)} number={metaData.openIssueNumber} />
      <CloseIssueButton onClick={() => buttonHandler(false)} number={metaData.closeIssueNumber} />
    </Container>
  );
}
