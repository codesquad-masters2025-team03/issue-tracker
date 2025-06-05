import { useState, useEffect } from 'react';
import useValidation from '@/hooks/useValidation';
import styled from 'styled-components';
import { radius } from '@/styles/foundation';
import Label from '../utils/Label';
import { SmallOutlineButton } from '../components/OutlineButtons';
import { SmallContainerButton } from '../components/ContainerButtons';
import { GhostButton } from '../components/Button';
import { typography } from '@/styles/foundation';
import { HexColorPicker } from 'react-colorful';

// 랜덤 컬러 유틸
function getRandomColor() {
  const hex = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0');
  return `#${hex.toUpperCase()}`;
}

export default function LabelCreateForm({ isAdd = true, defaultValue = {}, onCancel, onSubmit }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const { isValid, setCurrentInput } = useValidation({ existedString: '' });
  // const isValid = !!name && !!color;

  const handleNameChange = (e) => {
    setName(e.target.value);
    setCurrentInput(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  function handleRandomColor() {
    const randColor = getRandomColor();
    setColor(randColor);
  }

  useEffect(() => {
    setName(defaultValue.name || '');
    setDescription(defaultValue.description || '');
    setColor(defaultValue.color || getRandomColor());
    setCurrentInput(defaultValue.name || '');
  }, []);

  return (
    <Wrapper $isAdd={isAdd}>
      <Title>새로운 레이블 추가</Title>
      <InputContainer>
        <Preview>
          <Label color={color} labelTitle={name || `Label preview`} />
        </Preview>
        <RightInputWrapper>
          <InputWrapper>
            <InputLabel>이름</InputLabel>
            <Input
              placeholder="레이블의 이름을 입력하세요"
              value={name}
              onChange={handleNameChange}
            />
          </InputWrapper>
          <InputWrapper>
            <InputLabel>{`설명(선택)`}</InputLabel>
            <Input
              placeholder="레이블에 대한 설명을 입력하세요"
              value={description}
              onChange={handleDescriptionChange}
            />
          </InputWrapper>
          <ColorInputContainer>
            <ColorInputWrapper>
              <InputLabel>배경 색상</InputLabel>
              <Input value={color} onChange={handleColorChange} />
              <GhostButton onClick={handleRandomColor}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_32631_3303)">
                    <path
                      d="M0.666748 2.6665V6.6665H4.66675"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M15.3333 13.3335V9.3335H11.3333"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M13.6601 5.99989C13.322 5.04441 12.7473 4.19016 11.9898 3.51683C11.2322 2.84351 10.3164 2.37306 9.32789 2.14939C8.33934 1.92572 7.31024 1.95612 6.33662 2.23774C5.363 2.51936 4.47658 3.04303 3.76008 3.75989L0.666748 6.66655M15.3334 9.33322L12.2401 12.2399C11.5236 12.9567 10.6372 13.4804 9.66354 13.762C8.68992 14.0437 7.66082 14.0741 6.67227 13.8504C5.68372 13.6267 4.76795 13.1563 4.01039 12.4829C3.25284 11.8096 2.67819 10.9554 2.34008 9.99989"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_32631_3303">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </GhostButton>
            </ColorInputWrapper>
            <HexColorPicker color={color} onChange={setColor} style={{ width: 150, height: 150 }} />
          </ColorInputContainer>
        </RightInputWrapper>
      </InputContainer>
      <Buttonwrapper>
        <SmallOutlineButton onClick={onCancel}>
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.7999 4.70026L5.20025 11.2999M5.2002 4.7002L11.7999 11.2999"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>취소</span>
        </SmallOutlineButton>
        <SmallContainerButton
          onClick={() => onSubmit({ name, description, color })}
          disabled={!isValid}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.5 3.3335V12.6668"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M3.8335 8H13.1668"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>완료</span>
        </SmallContainerButton>
      </Buttonwrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  border-radius: ${radius.large};
  border: ${({ $isAdd, theme }) => ($isAdd ? `1px solid ${theme.border.default}` : null)};
  background: ${({ theme }) => theme.surface.strong};
  padding: ${({ $isAdd }) => ($isAdd ? '32px' : '0px')};
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h2`
  ${typography.display.bold20}
  color:${({ theme }) => theme.text.strong};
`;

const InputLabel = styled.div`
  ${typography.display.medium12};
  width: 64px;
  color: ${({ theme }) => theme.text.weak};
`;

const InputContainer = styled.div`
  display: flex;
  gap: 24px;
`;

const Input = styled.input`
  ${typography.display.medium16};
  width: 100%;
  color: ${({ theme }) => theme.text.default};
  background: transparent;
  outline: none;
  flex: 1;
`;

const RightInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  flex: 1;
`;
const InputWrapper = styled.div`
  background-color: ${({ theme }) => theme.surface.bold};
  border-radius: ${radius.medium};
  display: flex;
  width: 100%;
  gap: 8px;
  align-items: center;
  padding: 8px 16px;
`;
const ColorInputWrapper = styled(InputWrapper)`
  width: 240px;
  height: 40px;
`;
const ColorInputContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const Preview = styled.div`
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: 11px;
  width: 288px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Buttonwrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 16px;
`;
