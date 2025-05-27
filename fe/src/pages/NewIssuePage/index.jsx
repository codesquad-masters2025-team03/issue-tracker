import styled from 'styled-components';
import NewIssueTile from '@/base-ui/IssuePage/NewIssueTile';
import SideBar from '@/units/SideBar';

const Body = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px 80px 80px 80px;
  gap: 24px;
`;
const Main = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;
  border-top: 1px solid ${({ theme }) => theme.border.default};
`;

export default function NewIssuePage() {
  const titleText = '새로운 이슈 작성';
  return (
    <Body>
      <NewIssueTile title={titleText} />
      <Main>
        <SideBar />
      </Main>
    </Body>
  );
}
