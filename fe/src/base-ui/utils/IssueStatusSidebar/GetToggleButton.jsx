//이 버튼을 구성하는 아이템들은 초기에 서버로부터 받아온 테이터에서 업데이트한 filterStore의 프로퍼티를 가져온다.
//selected는 이슈디테일 스토어의 프로퍼티(배열)을 입력 받는다.
import styled from 'styled-components';
import { typography } from '@/styles/foundation';

const SubMenuButton = styled.button`
  ${typography.available.medium16};
  color: ${({ theme, $isSelect }) => ($isSelect ? theme.text.strong : theme.text.default)};
  background-color: ${({ theme, $isSelect }) => ($isSelect ? theme.surface.bold : 'transparant')};
  width: 100%;
  display: flex;
  align-items: center;
  height: 50px;
  display: flex;
  gap: 8px;
  z-index: 1000;

  &:hover {
    color: ${({ theme }) => theme.text.strong};
  }
  img {
    width: 20px;
    height: 20px;
  }
`;

//버튼 한개 생성
export function GetToggleButton({ toggleType, item, onClick, isSelected }) {
  switch (toggleType) {
    case 'label':
      return (
        <SubMenuButton id={item.id} $isSelect={isSelected} onClick={() => onClick(item)}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="10" cy="10" r="10" fill={item.color} />
          </svg>
          <span>{item.name}</span>
        </SubMenuButton>
      );
    case 'milestone':
      return (
        <SubMenuButton id={item.id} $isSelect={isSelected} onClick={() => onClick(item)}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7.75 0C7.94891 0 8.13968 0.0790176 8.28033 0.21967C8.42098 0.360322 8.5 0.551088 8.5 0.75V3H12.134C12.548 3 12.948 3.147 13.264 3.414L15.334 5.164C15.5282 5.32828 15.6842 5.53291 15.7912 5.76364C15.8982 5.99437 15.9537 6.24566 15.9537 6.5C15.9537 6.75434 15.8982 7.00563 15.7912 7.23636C15.6842 7.46709 15.5282 7.67172 15.334 7.836L13.264 9.586C12.9481 9.85325 12.5478 9.99993 12.134 10H8.5V15.25C8.5 15.4489 8.42098 15.6397 8.28033 15.7803C8.13968 15.921 7.94891 16 7.75 16C7.55109 16 7.36032 15.921 7.21967 15.7803C7.07902 15.6397 7 15.4489 7 15.25V10H2.75C2.28587 10 1.84075 9.81563 1.51256 9.48744C1.18437 9.15925 1 8.71413 1 8.25V4.75C1 3.784 1.784 3 2.75 3H7V0.75C7 0.551088 7.07902 0.360322 7.21967 0.21967C7.36032 0.0790176 7.55109 0 7.75 0ZM7.75 8.5H12.134C12.1931 8.49965 12.2501 8.47839 12.295 8.44L14.365 6.69C14.3924 6.66653 14.4145 6.63739 14.4296 6.60459C14.4447 6.57179 14.4525 6.53611 14.4525 6.5C14.4525 6.46389 14.4447 6.42821 14.4296 6.39541C14.4145 6.36261 14.3924 6.33347 14.365 6.31L12.295 4.56C12.2501 4.52161 12.1931 4.50035 12.134 4.5H2.75C2.6837 4.5 2.62011 4.52634 2.57322 4.57322C2.52634 4.62011 2.5 4.6837 2.5 4.75V8.25C2.5 8.388 2.612 8.5 2.75 8.5H7.75Z"
              fill="currentColor"
            />
          </svg>
          <span>{item.name}</span>
        </SubMenuButton>
      );
    default:
      return (
        <SubMenuButton id={item.id} $isSelect={isSelected} onClick={() => onClick(item)}>
          <img src={item.profileImageUrl} alt={item.nickName} />

          <span>{item.nickName}</span>
        </SubMenuButton>
      );
  }
}
