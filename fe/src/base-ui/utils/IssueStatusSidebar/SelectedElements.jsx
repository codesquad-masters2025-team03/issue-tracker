import styled from 'styled-components';
import { typography } from '@/styles/foundation';
import UserAvatar from '../UserBadge';
import useIssueDetailStore from '@/stores/IssueDetailStore';
import Label from '../Label';
import MilestoneProgressBar from '@/base-ui/IssuePage/MilestoneProgressBar';

const Container = styled.div`
  display: flex;
`;

const AssigneesWrapper = styled(Container)`
  ${typography.display.medium12}
  color:${({ theme }) => theme.text.strong};
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
`;

const LabelsWrapper = styled(Container)`
  width: 224px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const MilestoneWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 224px;
  gap: 8px;
  align-items: flex-start;
`;

const SelectedAssignee = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const MilestoneLabel = styled.span`
  ${typography.display.medium12}
  color:${({ theme }) => theme.text.strong};
`;

function SelectedAssignees() {
  const selectedAssignees = useIssueDetailStore((state) => state.assignees);
  return (
    <AssigneesWrapper>
      {selectedAssignees.map(({ id, nickName, profileImageUrl }) => {
        return (
          <SelectedAssignee key={id}>
            <UserAvatar avatarUrl={profileImageUrl} />
            <span>{nickName}</span>
          </SelectedAssignee>
        );
      })}
    </AssigneesWrapper>
  );
}
function SelectedLabels() {
  const selectedLabels = useIssueDetailStore((state) => state.labels);
  return (
    <LabelsWrapper>
      {selectedLabels.map(({ id, name, color }) => {
        return <Label key={id} color={color} labelTitle={name} />;
      })}
    </LabelsWrapper>
  );
}
function SelectedMilestone() {
  const { name, processingRate } = useIssueDetailStore((state) => state.milestone);
  return (
    <MilestoneWrapper>
      <MilestoneProgressBar percent={processingRate} />
      <MilestoneLabel>{name}</MilestoneLabel>
    </MilestoneWrapper>
  );
}

const componentMap = {
  label: SelectedLabels,
  assignee: SelectedAssignees,
  milestone: SelectedMilestone,
};

export default function GetSelectedElements({ type }) {
  const Component = componentMap[type];
  return Component ? <Component /> : null;
}
