"use client";

import styled from "styled-components";
import { CommentDisplay, AddComment } from "./index";
import { Paragraph } from "@/components/styled/text";
import SpeechBubbleIcon from "./SpeechBubbleIcon";

interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

interface CommentsListProps {
  comments: Comment[];
  onPatch: (commentId: string, updatedText: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  onAdd: (text: string) => Promise<void>;
  title?: string;
}

export function CommentsList({ comments, onPatch, onDelete, onAdd, title = "Coordinator Comments" }: CommentsListProps) {
  return (
    <CommentsCard>
      <CommentsHeader>
        <SpeechBubbleIconWrapper>
          <SpeechBubbleIcon />
        </SpeechBubbleIconWrapper>
        <Paragraph fontWeight={600} fontSize="16px" lineheight="20px" color="var(--color-midnight)">
          {title} • {comments.length}
        </Paragraph>
      </CommentsHeader>
      <CommentsListContainer>
        {comments.map((comment) => (
          <CommentDisplay
            key={comment.id}
            comment={comment}
            onPatch={onPatch}
            onDelete={onDelete}
          />
        ))}
        <AddComment onSubmit={onAdd} />
      </CommentsListContainer>
    </CommentsCard>
  );
}

export default CommentsList;

/* Styled Components */

const CommentsCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--color-white);
  border-radius: var(--card-border-radius);
  overflow: hidden;
`;

const CommentsHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background-color: #FEF7FF;
`;

const CommentsListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background-color: var(--color-white);
`;

const SpeechBubbleIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

