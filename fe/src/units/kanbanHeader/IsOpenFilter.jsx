import CloseIssueButton from '@/base-ui/issueListPage/IssueListHeader/CloseIssueButton';
import OpenIssueButton from '@/base-ui/issueListPage/IssueListHeader/OpenIssueButton';
import styled from 'styled-components';
import useIssuesStore from '@/stores/issuesStore';
import { useApplyQueryParams } from '@/utils/queryParams/useApplyQueryParams';
import useQueryObject from '@/utils/queryParams/useQueryObject';
import { useSearchParams } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  gap: 24px;
`;

export default function IsOpenFilter() {
  const metaData = useIssuesStore((state) => state.metaData);
  const queryObject = useQueryObject();
  const applyQueryParams = useApplyQueryParams();
  const [searchParams] = useSearchParams();
  const isOpen = searchParams.get('isOpen') === 'true' ? true : false;

  function buttonHandler(isOpen) {
    queryObject.page = 1;
    queryObject.isOpen = isOpen;
    applyQueryParams(queryObject);
  }

  return (
    <Container>
      <OpenIssueButton
        isOpen={isOpen}
        onClick={() => buttonHandler(true)}
        number={metaData.openIssueNumber}
      />
      <CloseIssueButton
        isOpen={isOpen}
        onClick={() => buttonHandler(false)}
        number={metaData.closeIssueNumber}
      />
    </Container>
  );
}
