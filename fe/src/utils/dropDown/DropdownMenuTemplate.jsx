/**
 * DropdownMenuTemplate 컴포넌트
 * ----------------------------------------
 * 커스텀 드롭다운 메뉴 UI 컴포넌트입니다.
 * 주로 필터 영역 (ex. 담당자 필터, 레이블 필터 등)에 사용됩니다.
 *
 * ✅ props
 * - triggerLabel (string): 드롭다운 버튼에 표시될 텍스트 (기본값: 'Select')
 * - menuWidth (string): 드롭다운 메뉴 너비 (기본값: '12rem')
 * - label (string): 드롭다운 상단에 표시되는 라벨 텍스트 (예: '담당자 필터')
 * - items (array): 드롭다운 항목 리스트
 *    - label (string): 항목 이름
 *    - leftSlot (ReactNode): 항목 왼쪽에 표시될 커스텀 요소 (ex. 아바타)
 *    - rightSlot (ReactNode): 항목 오른쪽에 표시될 커스텀 요소 (ex. 체크 아이콘 등)
 *    - isSelected (boolean): 선택 여부에 따라 CheckedOnCircle 또는 CheckedOffCircle 렌더링
 *    - onClick (function): 항목 클릭 시 실행할 함수
 *    - disabled (boolean): 항목 비활성화 여부 (선택사항)
 *
 * ✅ 사용 예시
 * <DropdownMenuTemplate
 *   triggerLabel="셀렉트 버튼 텍스트 라벨"
 *   label="드랍다운 상위 안내 라벨"
 *   items=[
 *     {
 *       label: '홍길동',
 *       leftSlot: <img src="/avatar.png" width={20} />,
 *       isSelected: true,
 *       onClick: () => handleClick('홍길동')
 *     },
 *     {
 *       label: '담당자가 없는 이슈',
 *       isSelected: false,
 *       onClick: () => handleClick(null)
 *     }
 *   ]
 * />
 */

import { useState } from 'react';
import * as S from './DropdownMenuTemplate.styles.js';
import CheckedOnCircle from '@/assets/CheckedOnCircle.jsx';
import CheckedOffCircle from '@/assets/CheckedOffCircle.jsx';

export function DropdownMenuTemplate({
  triggerLabel = 'Select',
  menuWidth = '12rem',
  label,
  items = [],
}) {
  const [open, setOpen] = useState(false);

  return (
    <S.Container>
      <S.TriggerButton onClick={() => setOpen((prev) => !prev)}>
        {triggerLabel}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </S.TriggerButton>

      {open && (
        <>
          <S.Menu $width={menuWidth}>
            {label && <S.Label>{label}</S.Label>}
            {label && <S.Separator />}
            {items.map((item, idx) => (
              <div key={idx}>
                <S.Item onClick={item.onClick} disabled={item.disabled}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {item.leftSlot}
                    {item.label}
                  </div>
                  {item.isSelected ? <CheckedOnCircle /> : <CheckedOffCircle />}
                </S.Item>
                {idx < items?.length - 1 && <S.Separator />}
              </div>
            ))}
          </S.Menu>
          <S.Overlay onClick={() => setOpen(false)} />
        </>
      )}
    </S.Container>
  );
}
