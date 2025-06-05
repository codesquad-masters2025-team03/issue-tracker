import styled from 'styled-components';
import UserAvatar from '@/base-ui/utils/UserAvatar';
import { typography } from '@/styles/foundation';
import { GhostButton } from '@/base-ui/components/Button';
import useTimeAgo from '@/hooks/useTimeAgo';
import { radius } from '@/styles/foundation';
import useIssueDetailStore from '@/stores/IssueDetailStore';
import { useAuthStore } from '@/stores/authStore';
import Label from '@/base-ui/utils/Label';

export default function CommentHeader({
  authorNickname,
  authorProfileUrl,
  editTriggerHandler,
  lastModifiedAt,
  commentAuthorId,
}) {
  const gapTime = useTimeAgo(lastModifiedAt);
  const issue = useIssueDetailStore((s) => s.issue);
  const loginId = useAuthStore((s) => s.loginId);
  return (
    <Container>
      <LeftWrapper>
        <UserAvatar avatarUrl={authorProfileUrl} />
        <AuthorName>{authorNickname}</AuthorName>
        <ModifiedTime>{gapTime}</ModifiedTime>
      </LeftWrapper>
      <RightWrapper>
        {issue.authorId === commentAuthorId && <AuthorLabel />}
        {loginId === commentAuthorId ? (
          <EditTriggerBtn onClick={editTriggerHandler} />
        ) : (
          <Label color={'#ff5670'} labelTitle={'Edit access denied'} />
        )}
      </RightWrapper>
    </Container>
  );
}

function AuthorLabel() {
  return <LabelWrapper>작성자</LabelWrapper>;
}

function EditTriggerBtn({ onClick }) {
  return (
    <EditButton onClick={onClick}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_31607_40096)">
          <path
            d="M13.3335 9.77317V13.3332C13.3335 13.6868 13.193 14.0259 12.943 14.276C12.6929 14.526 12.3538 14.6665 12.0002 14.6665H2.66683C2.31321 14.6665 1.97407 14.526 1.72402 14.276C1.47397 14.0259 1.3335 13.6868 1.3335 13.3332V3.99984C1.3335 3.64622 1.47397 3.30708 1.72402 3.05703C1.97407 2.80698 2.31321 2.6665 2.66683 2.6665H6.22683"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.0002 1.3335L14.6668 4.00016L8.00016 10.6668H5.3335V8.00016L12.0002 1.3335Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_31607_40096">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <span>편집</span>
    </EditButton>
  );
}

const BaseStyle = styled.div`
  display: flex;
  align-items: center;
`;

const Container = styled(BaseStyle)`
  width: 100%;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.surface.default};
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border.default};
  padding: 16px 24px;
`;

const LeftWrapper = styled(BaseStyle)`
  gap: 8px;
`;
const RightWrapper = styled(BaseStyle)`
  gap: 24px;
`;
const AuthorName = styled.span`
  ${typography.display.medium16}
  color:${({ theme }) => theme.text.default};
`;
const ModifiedTime = styled.span`
  ${typography.display.medium16}
  color:${({ theme }) => theme.text.weak};
`;
const LabelWrapper = styled.div`
  ${typography.display.medium12}
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: ${radius.large};
  height: 24px;
  padding: 4px 12px;
  color: ${({ theme }) => theme.text.weak};
  background-color: ${({ theme }) => theme.surface.bold};
`;

const EditButton = styled(GhostButton)`
  ${typography.available.medium12}
  gap:4px;
`;
