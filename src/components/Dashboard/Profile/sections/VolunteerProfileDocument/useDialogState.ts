import { useState } from "react";
import { DocumentRow } from "./utils";

type DialogType = "delete" | "upload" | "preview";

type DialogState = {
  isOpen: boolean;
  document: DocumentRow | null;
};

type State = {
  delete: DialogState;
  upload: DialogState;
  preview: DialogState;
};

const initialDialogState = { isOpen: false, document: null };

export function useDialogState() {
  const [state, setState] = useState<State>({
    delete: initialDialogState,
    upload: initialDialogState,
    preview: initialDialogState,
  });

  const openDialog = (type: DialogType, document: DocumentRow) => {
    setState((prev) => ({
      ...prev,
      [type]: { isOpen: true, document },
    }));
  };

  const closeDialog = (type: DialogType) => {
    setState((prev) => ({
      ...prev,
      [type]: { isOpen: false, document: null },
    }));
  };

  return {
    deleteDocument: state.delete.document,
    uploadDocument: state.upload.document,
    previewDocument: state.preview.document,
    openDialog,
    closeDialog,
    isDeleteOpen: state.delete.isOpen,
    isUploadOpen: state.upload.isOpen,
    isPreviewOpen: state.preview.isOpen,
  };
}
