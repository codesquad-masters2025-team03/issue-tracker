import styled from 'styled-components';

const AvatarGroup = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: -10px;

  &:first-child {
    margin-left: 0;
  }
`;

const OverflowBadge = styled.div`
  width: 32px;
  height: 32px;
  color: ${({ theme }) => theme.text.default};
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -10px;
`;

export default function OverlappingAvatars({ avatars, maxVisible = 3 }) {
  const visibleAvatars = avatars.slice(0, maxVisible);
  const overflowCount = avatars.length - maxVisible;

  return (
    <>
      {avatars && (
        <AvatarGroup>
          {visibleAvatars.map(({ imgUrl, nickname }, index) => (
            <Avatar key={index} src={imgUrl} alt={`avatar-${nickname}`} />
          ))}
          {overflowCount > 0 && <OverflowBadge>+{overflowCount}</OverflowBadge>}
        </AvatarGroup>
      )}
    </>
  );
}
