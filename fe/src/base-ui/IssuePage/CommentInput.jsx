import styled from 'styled-components';
import { typography } from '@/styles/foundation';
import useTypingStatus from '@/hooks/useTypingStatus';
import FileDropzone from './FileDropzone';

const Container = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 16px;
  border: ${({ theme, $isEmpty }) => !$isEmpty && `1px solid ${theme.border.active}`};
  background-color: ${({ $isEmpty, theme }) =>
    $isEmpty ? theme.surface.bold : theme.surface.strong};
  width: 100%;
`;

const CommentGuideLabel = styled.div`
  ${typography.display.medium12};
  color: ${({ theme }) => theme.text.weak};
  padding: 16px 16px 8px 16px;
`;

const TextArea = styled.textarea`
  ${typography.display.medium16};
  color: ${({ theme }) => theme.text.default};
  padding: 16px;
  min-height: ${({ $type }) => ($type === 'new' ? '500px' : '92px')};
  width: 100%;
  border-bottom: 1px dashed ${({ theme }) => theme.border.default};
  resize: vertical;
`;

const TypingCount = styled.span`
  position: absolute;
  right: 44px;
  bottom: 68px;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  color: ${({ theme }) => theme.text.weak};
`;

const Bottom = styled.div`
  min-height: 52px;
  padding-left: 16px;
  display: flex;
  align-items: center;
`;

function countNumber(str) {
  const number = Array.from(str)?.length;
  return number;
}

export default function CommentInput({
  commentLabel,
  commentType,
  commentValue,
  changeHandler,
  setFile,
  files,
  headerComponent = null,
}) {
  const isDebounce = useTypingStatus(commentValue);
  const isEmpty = !commentValue;

  return (
    <Container $isEmpty={isEmpty}>
      {headerComponent}
      {commentValue && <CommentGuideLabel>{commentLabel}</CommentGuideLabel>}
      <TextArea
        placeholder="코멘트를 입력하세요."
        value={commentValue}
        onChange={changeHandler}
        $type={commentType}
      />
      {isDebounce && <TypingCount>{`띄어쓰기 포함 ${countNumber(commentValue)}자`}</TypingCount>}
      <Bottom>
        <FileDropzone onFiles={setFile} files={files} />
      </Bottom>
    </Container>
  );
}
