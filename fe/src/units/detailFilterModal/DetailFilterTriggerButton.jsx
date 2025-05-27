import styled from 'styled-components';
import { GhostButton } from '@/base-ui/components/Button';
import useFilterModalStore from '@/stores/detailFilterModalStore';

const TriggerButton = styled(GhostButton)`
  width: 80px;
  height: 32px;
  justify-content: space-between;
`;

export default function DetailFilterTriggerButton() {
  const openModal = useFilterModalStore((state) => state.openModal);
  const buttonLabel = '상세필터';
  return (
    <TriggerButton onClick={() => openModal()}>
      <span>{buttonLabel}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="20px"
        viewBox="0 -960 960 960"
        width="20px"
        fill="currentColor"
      >
        <path d="M456.18-192Q446-192 439-198.9t-7-17.1v-227L197-729q-9-12-2.74-25.5Q200.51-768 216-768h528q15.49 0 21.74 13.5Q772-741 763-729L528-443v227q0 10.2-6.88 17.1-6.89 6.9-17.06 6.9h-47.88ZM480-498l162-198H317l163 198Zm0 0Z" />
      </svg>
    </TriggerButton>
  );
}
