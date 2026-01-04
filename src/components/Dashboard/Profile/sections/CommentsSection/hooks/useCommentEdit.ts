import { useState } from "react";

type UseCommentEditReturn = {
  editingCommentId: number | null;
  editText: string;
  originalEditText: string;
  startEdit: (commentId: number, currentText: string) => void;
  cancelEdit: () => void;
  updateEditText: (text: string) => void;
  canSave: boolean;
};

export function useCommentEdit(): UseCommentEditReturn {
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [originalEditText, setOriginalEditText] = useState("");

  const startEdit = (commentId: number, currentText: string) => {
    setEditingCommentId(commentId);
    setEditText(currentText);
    setOriginalEditText(currentText);
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditText("");
    setOriginalEditText("");
  };

  const updateEditText = (text: string) => {
    setEditText(text);
  };

  const canSave = editText.trim() !== "" && editText !== originalEditText;

  return {
    editingCommentId,
    editText,
    originalEditText,
    startEdit,
    cancelEdit,
    updateEditText,
    canSave,
  };
}
