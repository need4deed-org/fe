export type EditableSectionRef = {
  handleEditClick: () => void;
};

export type EditableSectionProps = {
  onEditingChange?: (isEditing: boolean) => void;
};
