import { typography } from '@/styles/foundation';
import styled from 'styled-components';
import { GhostButton } from '../components/Button';

export function PrevButton({ onClick, disabled }) {
  return (
    <GhostButton disabled={disabled} onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="currentColor"
      >
        <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
      </svg>
      <span>Prev</span>
    </GhostButton>
  );
}
export function NextButton({ onClick, disabled }) {
  return (
    <GhostButton disabled={disabled} onClick={onClick}>
      <span>Next</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="currentColor"
      >
        <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
      </svg>
    </GhostButton>
  );
}
