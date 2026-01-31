import { useState } from "react";

type UseCommentDeleteReturn = {
  deleteDialogOpen: boolean;
  deleteCommentId: number | null;
  deleteAuthorName: string;
  openDeleteDialog: (commentId: number, authorName: string) => void;
  closeDeleteDialog: () => void;
};

export function useCommentDelete(): UseCommentDeleteReturn {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null);
  const [deleteAuthorName, setDeleteAuthorName] = useState("");

  const openDeleteDialog = (commentId: number, authorName: string) => {
    setDeleteDialogOpen(true);
    setDeleteCommentId(commentId);
    setDeleteAuthorName(authorName);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteCommentId(null);
    setDeleteAuthorName("");
  };

  return {
    deleteDialogOpen,
    deleteCommentId,
    deleteAuthorName,
    openDeleteDialog,
    closeDeleteDialog,
  };
}
