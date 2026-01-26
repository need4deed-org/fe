import styled from "styled-components";

interface TagProps {
  $backgroundColor?: string;
}

export const Tag = styled.div<TagProps>`
  display: flex;
  flex-direction: row;
  border-radius: var(--border-radius-xs);
  padding: var(--activity-tag-padding);
  background-color: ${(props) => props["$backgroundColor"]};
  gap: var(--spacing-8);
`;

export const ATag = styled.a`
  text-decoration: none;
`;
