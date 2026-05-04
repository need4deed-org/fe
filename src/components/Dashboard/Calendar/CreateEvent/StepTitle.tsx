import { Heading2, Heading3 } from "@/components/styled/text";
import { ActionButton } from "./ActionButton";
import { EventFormData } from "./CreateEvent";
import { ButtonRow, CharCount, FieldGroup, FieldLabel, HelperText, StyledInput, StyledTextarea } from "./styles";

const TITLE_MAX = 128;

interface Props {
  title: string;
  description: string;
  onChange: (fields: Partial<EventFormData>) => void;
  onNext: () => void;
  onCancel: () => void;
  t: (key: string) => string;
  isNextEnabled: boolean;
}

export function StepTitle({ title, description, onChange, onNext, onCancel, t, isNextEnabled }: Props) {
  return (
    <>
      <Heading2>{t("dashboard.calendar.createForm.eventTitle")}</Heading2>

      <FieldGroup>
        <Heading3>{t("dashboard.calendar.createForm.titleLabel")}</Heading3>
        <FieldLabel htmlFor="event-title">{t("dashboard.calendar.createForm.titlePlaceholder")}*</FieldLabel>
        <StyledInput
          id="event-title"
          value={title}
          maxLength={TITLE_MAX}
          placeholder={t("dashboard.calendar.createForm.titlePlaceholder")}
          onChange={(e) => onChange({ title: e.target.value })}
        />
        <HelperText>{t("dashboard.calendar.createForm.titleHelper")}</HelperText>
        <CharCount>
          {title.length}/{TITLE_MAX}
        </CharCount>
      </FieldGroup>

      <FieldGroup>
        <Heading3>{t("dashboard.calendar.createForm.descriptionLabel")}</Heading3>
        <StyledTextarea
          value={description}
          rows={4}
          placeholder={t("dashboard.calendar.createForm.descriptionPlaceholder")}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </FieldGroup>

      <ButtonRow>
        <ActionButton variant="outline" onClick={onCancel}>
          {t("dashboard.calendar.createForm.cancel")}
        </ActionButton>
        <ActionButton variant="primary" onClick={onNext} disabled={!isNextEnabled}>
          {t("dashboard.calendar.createForm.next")}
        </ActionButton>
      </ButtonRow>
    </>
  );
}
