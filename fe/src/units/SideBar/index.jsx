import styled from 'styled-components';
import useIssuesStore from '@/stores/issuesStore';
import useFilterModalStore from '@/stores/detailFilterModalStore';
import useIssueDetailStore from '@/stores/IssueDetailStore';
import AddStatusToggle from '@/base-ui/utils/IssueStatusSidebar/AddStatusToggle';

const Container = styled.div`
  display: flex;
  width: 288px;
  flex-direction: column;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: 16px;
  background-color: ${({ theme }) => theme.surface.strong};
`;

export default function SideBar({ pageType = null }) {
  //   const { assignee, label, milestone } = useFilterModalStore((state) => ({
  //     assignee: state.filterEntry.assignee,
  //     label: state.filterEntry.label,
  //     milestone: state.filterEntry.milestone,
  //   }));

  const assignee = useFilterModalStore((state) => state.filterEntry.assignee);
  const label = useFilterModalStore((state) => state.filterEntry.label);
  const milestone = useFilterModalStore((state) => state.filterEntry.milestone);

  const toggleTypes = [
    { type: 'assignee', label: '담당자', items: assignee },
    { type: 'label', label: '레이블', items: label },
    { type: 'milestone', label: '마일스톤', items: milestone },
  ];

  return (
    <Container>
      {toggleTypes.map(({ type, label, items }) => {
        return (
          <AddStatusToggle
            key={type}
            toggleType={type}
            triggerButtonLabel={label}
            itemsArr={items}
            pageTypeContext={pageType}
          />
        );
      })}
    </Container>
  );
}
