import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.surface.bold};
  overflow: hidden;
  border-radius: 12px;
`;

const ProgressBar = styled.div`
  transform-origin: left;
  background-color: ${({ theme }) => theme.brand.surface.default};
  width: 100%;
  height: 100%;
  transform: ${({ $ratio }) => `scaleX(${$ratio})`};
`;

export default function MilestoneProgressBar({ percent }) {
  const ratio = percent / 100;
  return (
    <Container>
      <ProgressBar $ratio={ratio} />
    </Container>
  );
}
