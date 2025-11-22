import { ReactNode } from "react";
import styled from "styled-components";

import { Tag } from "@/components/styled/tags";
import { ActivitySpan } from "@/components/styled/text";

interface Props {
  tags: string[];
  backgroundColor?: TagBackgroundKeys;
  icon?: ReactNode;
}

const defaultBGColor = "var(--color-papaya)";

const bgTextColorMap = {
  [defaultBGColor]: "var(--color-white)",
  "var(--color-white)": "var(--color-midnight)",
};

type TagBackgroundKeys = keyof typeof bgTextColorMap;

export function Tags({ tags, backgroundColor = defaultBGColor, icon }: Props) {
  return (
    <TagsContainer>
      {tags.filter(Boolean).map((tag) => (
        <Tag key={tag} $backgroundColor={backgroundColor}>
          {icon}
          <ActivitySpan color={bgTextColorMap[backgroundColor]}>
            {tag}
          </ActivitySpan>
        </Tag>
      ))}
    </TagsContainer>
  );
}

export default Tags;

/** Styles */
export const TagsContainer = styled.div`
  display: flex;
  width: fit-content;
  justify-content: left;
  flex-wrap: wrap;
  gap: var(--activities-container-gap);
`;
