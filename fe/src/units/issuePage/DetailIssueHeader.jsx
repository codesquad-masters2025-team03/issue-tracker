import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { typography } from '@/styles/foundation';
import { LargeIssueTitle } from '@/base-ui/utils/IssueTitle';
import { LargeIssueNumber } from '@/base-ui/issueListPage/issueItem';
import {
  EditTitleBtn,
  CancelEditBtn,
  CloseIssueBtn,
  CompleteEditBtn,
  OpenIssueBtn,
} from '@/base-ui/IssuePage/IssueControllButtons';
import IssueStatusLabel from '@/base-ui/IssuePage/IssueStatusLabel';
import AuthorInform from '@/base-ui/utils/AuthorInform';
import useIssueDetailStore from '@/stores/IssueDetailStore';
import { IssueTitleInput } from '@/base-ui/IssuePage/IssueTitleInput';
import useValidation from '@/hooks/useValidation';
import getFormData from '@/utils/common/getFormData';

export default function DetailIssueHeader({ issueFetchHandler }) {
  const [isEdit, setIsEdit] = useState(false);
  const issue = useIssueDetailStore((s) => s.issue);
  const [editTitle, setEditTitle] = useState(issue.title);
  const commentCount = useIssueDetailStore((s) => s.comments)?.length;
  const { isValid, setCurrentInput } = useValidation({ existedString: issue.title });
  const accessToken = localStorage.getItem('token');

  function getTitleComponent() {
    if (isEdit) {
      return (
        <IssueTitleInput
          titleLabel="제목"
          titleType="detail"
          titleValue={editTitle}
          isValid={isValid}
          changeHandler={(e) => {
            setEditTitle(e.target.value);
            setCurrentInput(e.target.value);
          }}
        />
      );
    } else {
      return (
        <>
          <LargeIssueTitle title={issue.title} />
          <LargeIssueNumber issueNumber={issue.issueId} />
        </>
      );
    }
  }

  function getLeftBtn() {
    if (isEdit)
      return (
        <CancelEditBtn
          onClick={() => {
            setIsEdit(false);
            setEditTitle(issue.title);
          }}
        />
      );
    return <EditTitleBtn onClick={() => setIsEdit(true)} />;
  }
  function getRightBtn() {
    if (isEdit) {
      const PATCHoptions = {
        method: 'PATCH',
        body: getFormData({ title: editTitle }),
      };

      return (
        <CompleteEditBtn
          onClick={() => {
            issueFetchHandler('PATCH', PATCHoptions, accessToken);
            setIsEdit(false);
          }}
          isValid={isValid}
        />
      );
    } else {
      function getPATCHoptions(isOpen) {
        return {
          method: 'PATCH',
          body: getFormData({ isOpen }),
        };
      }
      return issue.isOpen ? (
        <CloseIssueBtn onClick={() => issueFetchHandler('PATCH', getPATCHoptions(false), accessToken)} />
      ) : (
        <OpenIssueBtn onClick={() => issueFetchHandler('PATCH', getPATCHoptions(true), accessToken)} />
      );
    }
  }

  useEffect(() => {
    setEditTitle(issue.title);
  }, [issue.title]);

  return (
    <Container>
      <TitleAndButtons>
        <Title>{getTitleComponent()}</Title>
        <Buttons>{[getLeftBtn(), getRightBtn()]}</Buttons>
      </TitleAndButtons>
      <StatesInfo>
        <IssueStatusLabel isOpen={issue.isOpen} />
        {issue.lastModifiedAt && (
          <AuthorInform lastModifiedAt={issue.lastModifiedAt} author={issue.authorNickname} />
        )}
        <CommentsCount>{`코멘트 ${commentCount}개`}</CommentsCount>
      </StatesInfo>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
  padding-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border.default};
`;

const TitleAndButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

const Title = styled.div`
  display: flex;
  width: 100%;
  gap: 8px;
  align-items: center;
`;

const Buttons = styled.div`
  display: flex;
  gap: 16px;
`;

const StatesInfo = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const CommentsCount = styled.div`
  ${typography.display.medium16}
  color:${({ theme }) => theme.text.weak};
  margin-left: 24px;
`;
