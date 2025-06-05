import styled from 'styled-components';
import PageHeader from '@/units/PageHeader';
import { Outlet } from 'react-router-dom';
import FadeInWrapper from '@/utils/FadeInWrapper';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function MainLayout() {
  return (
    <Container>
      <FadeInWrapper>
        <PageHeader />
        <Outlet />
      </FadeInWrapper>
    </Container>
  );
}
