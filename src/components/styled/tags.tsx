import styled from "styled-components";

interface TagProps {
  $backgroundColor?: string;
}

interface ActivityTagProps {
  "background-color": string;
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

export const ActivityTag = styled.div<ActivityTagProps>`
  border-radius: var(--activity-tag-border-radius);
  padding: var(--activity-tag-padding);
  background-color: ${(props) => props["background-color"]};
`;
