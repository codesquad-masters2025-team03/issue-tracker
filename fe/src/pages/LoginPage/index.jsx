import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/base-ui/loginPage/Logo';
import GitHubLoginButton from '@/base-ui/loginPage/GitHubLoginButton';
import OrLabel from '@/base-ui/loginPage/OrLabel';
import InputForm from '@/utils/InputForm';
import SubButton from '@/base-ui/loginPage/SubButton';
import ToggleTheme from '@/base-ui/utils/ToggleTheme';
import useDataFetch from '@/hooks/useDataFetch';
import { LOGIN_API } from '@/api/auth';
import tokenDecoder from '@/utils/token/decoder';
import { useAuthStore } from '@/stores/authStore';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

export default function LoginPage() {
  const [Id, setId] = useState('');
  const [pw, setPw] = useState('');
  const { response, isLoading, fetchData } = useDataFetch({
    fetchType: 'Login',
  });
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();
  const mainButtonLabel = '아이디로 로그인';
  const buttonLabelText = '회원가입';
  function onSubmit(event) {
    event.preventDefault();
    fetchData(LOGIN_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loginId: Id, password: pw }),
    });
  }

  function moveToSignUp() {
    navigate('/signUp');
  }

  useEffect(() => {
    if (response && response.data.accessToken) {
      const token = response.data.accessToken;
      const { loginId, imgUrl } = tokenDecoder(token);
      setUser(loginId, imgUrl, token);
      localStorage.setItem('token', token);
      navigate('/');
    }
  }, [response]);
  return (
    <Container>
      {isLoading && <h1>로딩중입니다.</h1>}
      <ToggleTheme />
      <Logo />
      <GitHubLoginButton />
      <OrLabel />
      <InputForm
        setId={setId}
        setPw={setPw}
        mainButtonLabel={mainButtonLabel}
        onSubmit={onSubmit}
        isDisabled={isLoading}
      />
      <SubButton buttonLabelText={buttonLabelText} onClick={moveToSignUp} />
    </Container>
  );
}
