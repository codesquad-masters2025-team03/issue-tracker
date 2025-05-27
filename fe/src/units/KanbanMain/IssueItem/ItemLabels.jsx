import styled from 'styled-components';
import Label from '@/base-ui/utils/Label';
import useLabelStore from '@/stores/labelStore';
import { typography } from '@/styles/foundation';

const Labels = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;

  &:hover > span {
    visibility: visible;
    opacity: 1;
  }
`;

const Tooltip = styled.span`
  ${typography.display.medium12}
  visibility: hidden;
  opacity: 0;
  background-color: ${({ theme }) => theme.text.strong};
  color: ${({ theme }) => theme.surface.strong};
  text-align: center;
  padding: 4px 8px;
  border-radius: 4px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  transition: opacity 0.2s ease-in-out;
  white-space: nowrap;
`;

function getLabelDescription(labelId, labelsArr) {
  let targetLabelDescription = '';
  labelsArr.forEach(({ id, description }) => {
    if (id !== labelId) return;
    targetLabelDescription = description;
  });
  return targetLabelDescription;
}

export default function ItemLabels({ labels }) {
  const labelsArr = useLabelStore((state) => state.labels);

  return (
    <>
      {labels && (
        <Labels>
          {labels.map(({ id, color, name }) => (
            <TooltipWrapper key={id}>
              <Label id={id} color={color} labelTitle={name} />
              <Tooltip>{getLabelDescription(id, labelsArr)}</Tooltip>
            </TooltipWrapper>
          ))}
        </Labels>
      )}
    </>
  );
}
