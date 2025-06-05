import styled from 'styled-components';
import { useEffect, useState } from 'react';

const Wrapper = styled.div`
  opacity: 0;
  transition: opacity 0.3s ease-in;

  &.loaded {
    opacity: 1;
  }
`;

export default function FadeInWrapper({ children }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return <Wrapper className={loaded ? 'loaded' : ''}>{children}</Wrapper>;
}
