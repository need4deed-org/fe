import styled from "styled-components";

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const Card = styled.div`
  background: var(--color-white);
`;

export const ProfileContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--spacing-24);
  align-items: center;
`;

export const AvatarContainer = styled.div`
  position: relative;
  height: 280px;
  width: 280px;
  border-radius: var(--percent-50);
  overflow: hidden;
  flex-shrink: 0;
`;

export const ProfileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
`;

export const NameSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-12);
`;

export const Name = styled.h2`
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  line-height: 36px;
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-blue-700);
  margin: 0;
`;

export const VolunteerSince = styled.p`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-regular);
  line-height: 24px;
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-blue-700);
  margin: 0;
`;

export const StatusSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0;
`;

export const StatusRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-16) 0;
  border-bottom: var(--border-width-thin) solid var(--color-blue-50);

  h4 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    line-height: 28px;
    letter-spacing: var(--letter-spacing-tight);
    color: var(--color-blue-700);
    margin: 0;
    width: 214px;
    flex-shrink: 0;
  }
`;

export const FieldContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-8);
  align-items: center;
  flex: 1;
`;

export const TextAndChip = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-32);
  flex: 1;
`;

export const ReturnDateText = styled.span`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-base);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-blue-700);
`;

export const EditButton = styled.button`
  background: transparent;
  color: var(--color-midnight-bright);
  border: none;
  padding: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: 24px;
  letter-spacing: var(--letter-spacing-tight);
  cursor: pointer;
  text-decoration: none;
  transition: var(--transition-all);
  flex-shrink: 0;

  &:hover {
    color: var(--color-blue-700);
    opacity: var(--opacity-hover);
  }
`;
