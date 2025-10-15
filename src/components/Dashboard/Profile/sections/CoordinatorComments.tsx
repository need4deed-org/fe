"use client";

import { useState } from "react";
import styled from "styled-components";
import { ChatCircleDots, DotsThreeOutline } from "@phosphor-icons/react";
import type { Comment } from "../types/types";

const Card = styled.div`
  background: white;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3b87;
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CommentCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const CommentAuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

const CommentAuthor = styled.p`
  font-weight: 500;
  color: #2d3b87;
  font-size: 0.875rem;
`;

const CommentDate = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
`;

const MenuButton = styled.button`
  height: 2rem;
  width: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: background 0.2s;

  &:hover {
    background: #f3f4f6;
  }
`;

const CommentContent = styled.p`
  font-size: 0.875rem;
  color: #111827;
  line-height: 1.5;
`;

const NewCommentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Textarea = styled.textarea`
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: inherit;
  resize: none;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #2d3b87;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const AddButton = styled.button`
  padding: 0.5rem 1rem;
  background: #7b2d8e;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #6b2578;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface CoordinatorCommentsProps {
  comments: Comment[];
  onAddComment?: (content: string) => void;
}

export function CoordinatorComments({ comments }: CoordinatorCommentsProps) {
  const [newComment, setNewComment] = useState("");

  console.log("comments", comments);

  return (
    <Card>
      <Header>
        <ChatCircleDots size={20} style={{ color: "#E85D75" }} />
        <Title>Coordinator Comments • {comments?.length}</Title>
      </Header>

      <CommentsList>
        {comments.map((comment) => (
          <CommentCard key={comment.id}>
            <CommentHeader>
              <CommentAuthorInfo>
                <CommentAuthor>{comment.author}</CommentAuthor>
                <CommentDate>{comment.date}</CommentDate>
              </CommentAuthorInfo>
              <MenuButton>
                <DotsThreeOutline size={16} />
              </MenuButton>
            </CommentHeader>
            <CommentContent>{comment.content}</CommentContent>
          </CommentCard>
        ))}
      </CommentsList>

      <NewCommentSection>
        <Textarea placeholder="Comment" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
        <ButtonContainer>
          {/* <AddButton onClick={handleSubmit} disabled={!newComment.trim()}>
            Add comment
          </AddButton> */}
        </ButtonContainer>
      </NewCommentSection>
    </Card>
  );
}
