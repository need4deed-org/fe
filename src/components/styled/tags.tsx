import styled from "styled-components";

interface TagProps {
  $backgroundColor?: string;
}

export const Tag = styled.div<TagProps>`
  display: flex;
  flex-direction: row;
  border-radius: var(--activity-tag-border-radius);
  padding: var(--activity-tag-padding);
  background-color: ${(props) => props["$backgroundColor"]};
  gap: var(--activity-tag-gap);
`;

export const ATag = styled.a`
  text-decoration: none;
`;
