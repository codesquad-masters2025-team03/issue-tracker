import styled from 'styled-components';
import { useState } from 'react';
import { MilestoneInfo, MilestoneController, ProgressIndicator } from '@/base-ui/milestoneDetail';
import MilestoneCreateForm from '@/base-ui/milestoneDetail/MilestoneCreateForm';
import parseDateString from '@/utils/common/parseDateString';

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background-color: ${({ theme }) => theme.surface.strong};
  border-bottom: 1px solid ${({ theme }) => theme.border.default};
  &:last-child {
    border-bottom: none;
  }
`;

const ItemRightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
`;

export default function MilestoneItem({
  milestoneObj,
  submitHandler,
  statusHandler,
  deleteHandler,
}) {
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);

  return (
    <Item key={milestoneObj.milestoneId}>
      {isAddTableOpen ? (
        <MilestoneCreateForm
          name={milestoneObj.name}
          endDate={milestoneObj.endDate}
          description={milestoneObj.description}
          isOpen={milestoneObj.isOpen}
          isAdd={false}
          onCancel={() => setIsAddTableOpen(false)}
          onSubmit={(data) =>
            submitHandler({
              ...data,
              milestoneId: milestoneObj.milestoneId,
              fetchMethod: 'PATCH',
              isOpen: milestoneObj.isOpen,
              setterFn: setIsAddTableOpen,
            })
          }
        />
      ) : (
        <>
          <MilestoneInfo
            milestoneName={milestoneObj.name}
            endDate={milestoneObj.endDate}
            description={milestoneObj.description}
          />
          <ItemRightWrapper>
            <MilestoneController
              isOpen={milestoneObj.isOpen}
              statusHandler={() =>
                statusHandler({
                  isOpen: milestoneObj.isOpen,
                  milestoneId: milestoneObj.milestoneId,
                  name: milestoneObj.name,
                  description: milestoneObj.description,
                  endDate: milestoneObj.endDate,
                })
              }
              editHandler={() => setIsAddTableOpen(true)}
              deleteHandler={() => deleteHandler(milestoneObj.milestoneId)}
            />
            <ProgressIndicator
              processingRate={milestoneObj.processingRate}
              openIssueCount={milestoneObj.openIssue}
              closeIssueCount={milestoneObj.closeIssue}
            />
          </ItemRightWrapper>
        </>
      )}
    </Item>
  );
}
