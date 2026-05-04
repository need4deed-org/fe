import { Heading2 } from "@/components/styled/text";
import { EventFormData } from "./CreateEvent";
import { ButtonRow, FieldGroup, FieldRow, FieldRowLabel, StyledInput } from "./styles";
import { ActionButton } from "./ActionButton";

interface Props {
  date: string;
  time: string;
  onChange: (fields: Partial<EventFormData>) => void;
  onBack: () => void;
  t: (key: string) => string;
  isNextEnabled: boolean;
}

export function StepDateTime({ date, time, onChange, onBack, t, isNextEnabled }: Props) {
  return (
    <>
      <Heading2>{t("dashboard.calendar.createForm.dateTime")}</Heading2>

      <FieldGroup>
        <FieldRow>
          <FieldRowLabel>{t("dashboard.calendar.createForm.date")}</FieldRowLabel>
          <StyledInput type="date" value={date} onChange={(e) => onChange({ date: e.target.value })} />
        </FieldRow>

        <FieldRow>
          <FieldRowLabel>{t("dashboard.calendar.createForm.time")}</FieldRowLabel>
          <StyledInput type="time" value={time} onChange={(e) => onChange({ time: e.target.value })} />
        </FieldRow>
      </FieldGroup>

      <ButtonRow>
        <ActionButton variant="outline" onClick={onBack}>
          {t("dashboard.calendar.createForm.back")}
        </ActionButton>
        <ActionButton variant="primary" onClick={() => {}} disabled={!isNextEnabled}>
          {t("dashboard.calendar.createForm.submit")}
        </ActionButton>
      </ButtonRow>
    </>
  );
}
