import { useState } from "react";
import { DocumentRow } from "./utils";

type DialogType = "delete" | "upload" | "preview";

type DialogState = {
  delete: { isOpen: boolean; document: DocumentRow | null };
  upload: { isOpen: boolean; document: DocumentRow | null };
  preview: { isOpen: boolean; document: DocumentRow | null };
};

export function useDialogState() {
  const [state, setState] = useState<DialogState>({
    delete: { isOpen: false, document: null },
    upload: { isOpen: false, document: null },
    preview: { isOpen: false, document: null },
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
