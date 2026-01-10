import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-24);
  width: 100%;
  margin-top: var(--spacing-24);
`;

export const CommentItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0;
  gap: var(--spacing-16);
  width: 100%;
  align-self: stretch;
`;

export const CommentContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: var(--profile-section-gap);
  flex-grow: 1;
`;

export const TopInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  gap: var(--spacing-16);
`;

export const AuthorName = styled.div`
  font-family: "Figtree";
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.005em;
  color: var(--color-midnight);
`;

export const Timestamp = styled.div`
  font-family: "Figtree";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0.005em;
  color: var(--color-grey-500);
`;

export const CommentText = styled.div`
  width: 100%;
  font-family: "Figtree";
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.005em;
  color: var(--color-midnight);
  align-self: stretch;
`;

export const MenuAction = styled.button`
  width: 44px;
  height: 44px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-midnight);
  padding: var(--spacing-8);

  &:hover {
    opacity: 0.7;
  }
`;

export const NewCommentSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 0;
  gap: var(--spacing-16);
  width: 100%;
  align-self: stretch;
`;

export const TextArea = styled.textarea`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: var(--spacing-16);
  gap: var(--spacing-8);
  width: 100%;
  min-height: 112px;
  background: var(--color-white);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-small);
  font-family: "Figtree";
  font-style: normal;
  font-weight: 400;
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  letter-spacing: 0.005em;
  color: var(--color-midnight);
  resize: vertical;
  align-self: stretch;

  &::placeholder {
    color: var(--color-grey-500);
  }

  &:focus {
    outline: none;
    border-color: var(--color-midnight);
  }
`;

export const AddCommentButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-16) var(--spacing-24);
  gap: var(--spacing-8);
  height: 56px;
  background: var(--color-aubergine);
  border-radius: var(--button-border-radius);
  border: none;
  cursor: pointer;
  font-family: "Figtree";
  font-style: normal;
  font-weight: 600;
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  text-align: center;
  letter-spacing: 0.005em;
  color: var(--color-white);
  opacity: 1;
  transition: background-color 0.2s ease, opacity 0.2s ease;

  &:disabled {
    background: var(--color-grey-200);
    cursor: not-allowed;
    color: var(--color-grey-500);
    opacity: 0.6;
  }

  &:hover:not(:disabled) {
    background: var(--color-aubergine-light);
  }
`;

export const CommentEditButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: var(--spacing-16);
  width: 100%;
`;

export const EditCancelButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-16) var(--spacing-24);
  gap: var(--spacing-8);
  height: 56px;
  background: transparent;
  border: 2px solid var(--color-aubergine);
  border-radius: var(--button-border-radius);
  cursor: pointer;
  font-family: "Figtree";
  font-style: normal;
  font-weight: 600;
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  text-align: center;
  letter-spacing: 0.005em;
  color: var(--color-aubergine);
  transition: background-color 0.2s ease;

  &:hover {
    background: var(--color-aubergine-subtle);
  }
`;

export const EditSaveButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-16) var(--spacing-24);
  gap: var(--spacing-8);
  height: 56px;
  background: var(--color-aubergine);
  border-radius: var(--button-border-radius);
  border: none;
  cursor: pointer;
  font-family: "Figtree";
  font-style: normal;
  font-weight: 600;
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  text-align: center;
  letter-spacing: 0.005em;
  color: var(--color-white);
  opacity: 1;
  transition: background-color 0.2s ease, opacity 0.2s ease;

  &:disabled {
    background: var(--color-grey-200);
    cursor: not-allowed;
    color: var(--color-grey-500);
    opacity: 0.6;
  }

  &:hover:not(:disabled) {
    background: var(--color-aubergine-light);
  }
`;
