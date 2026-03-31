export type AccordionActionProps =
  | { onMatch: () => void; onNotAMatch: () => void; onMarkAsActive: () => void; onMarkAsPast: () => void }
  | { onMatch?: never; onNotAMatch?: never; onMarkAsActive?: never; onMarkAsPast?: never };

export type EditableSectionRef = {
  handleEditClick: () => void;
};

export type EditableSectionProps = {
  onEditingChange?: (isEditing: boolean) => void;
};
