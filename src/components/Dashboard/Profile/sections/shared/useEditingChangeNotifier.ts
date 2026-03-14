import { useEffect } from "react";

export const useEditingChangeNotifier = (
  isEditing: boolean,
  onEditingChange?: (isEditing: boolean) => void,
) => {
  useEffect(() => {
    onEditingChange?.(isEditing);
  }, [isEditing, onEditingChange]);
};
