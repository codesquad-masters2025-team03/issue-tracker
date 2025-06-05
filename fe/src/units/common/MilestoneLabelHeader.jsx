import styled from 'styled-components';
import { LabelButton, MilestoneButton } from '@/base-ui/issueListPage/mainPageHeaderTap/taps';
import { SmallContainerButton } from '@/base-ui/components/ContainerButtons';
import useFilterModalStore from '@/stores/detailFilterModalStore';
import { radius } from '@/styles/foundation';

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NewIssueButton = styled(SmallContainerButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const ButtonWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: ${radius.medium};
  display: inline-flex;
  width: fit-content;
  overflow: hidden;
`;

export default function MilestoneLabelHeader({ isLabel, isValid, addHandler }) {
  const milestoneNumber = useFilterModalStore((s) => s.filterEntry.milestone)?.length;
  const labelNumber = useFilterModalStore((s) => s.filterEntry.label)?.length;
  const buttonLabel = isLabel ? '레이블 추가' : '마일스톤 추가';
  return (
    <Container>
      <ButtonWrapper>
        <LabelButton number={labelNumber} />
        <MilestoneButton number={milestoneNumber} />
      </ButtonWrapper>
      <NewIssueButton disabled={!isValid} onClick={addHandler}>
        <svg
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.5 3.33337V12.6667"
            stroke="#FEFEFE"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.8335 8H13.1668"
            stroke="#FEFEFE"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>{buttonLabel}</span>
      </NewIssueButton>
    </Container>
  );
}
