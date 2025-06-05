import styled from 'styled-components';
import { typography } from '@/styles/foundation';
import MilestoneProgressBar from '../IssuePage/MilestoneProgressBar';

export default function ProgressIndicator({ processingRate, openIssueCount, closeIssueCount }) {
  return (
    <Contianer>
      <MilestoneProgressBar percent={processingRate} />
      <InfoWrapper>
        <span>{`${processingRate}%`}</span>
        <CounterWrapper>
          <span>{`열린 이슈 ${openIssueCount}`}</span>
          <span>{`닫힌 이슈 ${closeIssueCount}`}</span>
        </CounterWrapper>
      </InfoWrapper>
    </Contianer>
  );
}

const Contianer = styled.div`
  display: flex;
  width: 244px;
  height: 32px;
  flex-direction: column;
  justify-content: space-between;
`;

const InfoWrapper = styled.div`
  ${typography.display.medium12}
  display: flex;
  justify-content: space-between;
`;

const CounterWrapper = styled.div`
  display: flex;
  gap: 8px;
`;
