import styled from 'styled-components';
import { IssueBadge, IssueNumber } from '@/base-ui/issueListPage/issueItem';
import CheckBox from '@/base-ui/utils/CheckBox';
import IssueTitle from '@/base-ui/utils/IssueTitle';
import Label from '@/base-ui/utils/Label';
import MileStoneTitle from '@/base-ui/utils/MileStoneTitle';
import AuthorInform from '@/base-ui/utils/AuthorInform';
import UserAvatar from '@/base-ui/utils/UserBadge';
import ItemLabels from './ItemLabels';
import OverlappingAvatars from './OverlappingAvatars';
import useCheckBoxStore from '@/stores/useCheckBoxStore';

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 16px 54px 16px 32px;
`;

const LetfWrapper = styled.div`
  display: flex;
  gap: 32px;
`;
const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 20px;
`;

const Icon = styled.div`
  padding-top: 8px;
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;
const Header = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Information = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

export default function IssueItem({ issue }) {
  const { id, isOpen, title, labels, lastModifiedAt, author, milestone, assignees } = issue;
  const toggleCheckBox = useCheckBoxStore((state) => state.toggleCheckBox);
  const checkBoxEntry = useCheckBoxStore((state) => state.checkBoxEntry);

  return (
    <Container id={id}>
      <LetfWrapper>
        <Icon>
          <CheckBox
            isDisabled={false}
            isActive={checkBoxEntry[id]}
            onClick={() => toggleCheckBox(id)}
          />
        </Icon>
        <Main>
          <Header>
            <IssueBadge isOpen={isOpen} />
            <IssueTitle title={title} />
            <ItemLabels labels={labels} />
          </Header>
          <Information>
            <IssueNumber issueNumber={id} />
            <AuthorInform lastModifiedAt={lastModifiedAt} author={author.nickname} />
            <MileStoneTitle mileStoneTitle={milestone?.name} />
          </Information>
        </Main>
      </LetfWrapper>
      <RightWrapper>
        <OverlappingAvatars avatars={assignees} />
      </RightWrapper>
    </Container>
  );
}
