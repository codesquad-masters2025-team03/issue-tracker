/*
- 라벨의 스타일 속성은 실게 깃헙의 라벨 스타일을 분석해 적용했습니다.
- HEX 색상 코드 입력 시 색 변환해주는 로직 포함하는 base-ui
- 입력: 16진수 색 코드, 라벨 텍스트
- 출력: 입력받은 숫자 코드를 각 스타일로 적용한 라벨 렌더링
*/

import styled from 'styled-components';
import { typography } from '@/styles/foundation';
import { radius } from '@/styles/foundation';
import { getBorder } from '@/styles/foundation';

const LabelWrapper = styled.div`
  ${typography.display.medium12}
  border-radius:${radius.large};
  color: ${({ $textColor }) => $textColor};
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  border: ${({ $borderColor }) => getBorder($borderColor).default};
  height: 24px;
  padding: 4px 12px;
  display: flex;
`;

function generateLabelStyle(hexColor) {
  // HEX → RGB 변환
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // GitHub 스타일 계산 규칙 적용
  const textColor = `rgb(${r - 1}, ${g - 3}, ${b - 1})`;
  const backgroundColor = `rgba(${r}, ${g}, ${b}, 0.18)`;
  const borderColor = `rgba(${r - 1}, ${g - 3}, ${b - 1}, 0.3)`;

  return { textColor, backgroundColor, borderColor };
}

export default function Label({ color, labelTitle }) {
  const { textColor, backgroundColor, borderColor } = generateLabelStyle(color);

  return (
    <LabelWrapper
      $textColor={textColor}
      $backgroundColor={backgroundColor}
      $borderColor={borderColor}
    >
      {labelTitle}
    </LabelWrapper>
  );
}
