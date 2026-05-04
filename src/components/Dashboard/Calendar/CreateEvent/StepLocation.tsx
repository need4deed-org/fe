import { Heading2 } from "@/components/styled/text";
import { ActionButton } from "./ActionButton";
import { EventFormData } from "./CreateEvent";
import { ButtonRow, CharCount, FieldGroup, FieldLabel, HelperText, StyledInput } from "./styles";

const FIELD_MAX = 128;

interface Props {
  street: string;
  houseNumber: string;
  postcode: string;
  onChange: (fields: Partial<EventFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  t: (key: string) => string;
  isNextEnabled: boolean;
}

export function StepLocation({ street, houseNumber, postcode, onChange, onNext, onBack, t, isNextEnabled }: Props) {
  return (
    <>
      <Heading2>{t("dashboard.calendar.createForm.location")}</Heading2>

      <FieldGroup>
        <FieldLabel htmlFor="street">{t("dashboard.calendar.createForm.street")}</FieldLabel>
        <StyledInput
          id="street"
          value={street}
          maxLength={FIELD_MAX}
          placeholder={t("dashboard.calendar.createForm.streetHelper")}
          onChange={(e) => onChange({ street: e.target.value })}
        />
        <CharCount>
          {street.length}/{FIELD_MAX}
        </CharCount>
      </FieldGroup>

      <FieldGroup>
        <FieldLabel htmlFor="house-number">{t("dashboard.calendar.createForm.houseNumber")}</FieldLabel>
        <StyledInput
          id="house-number"
          value={houseNumber}
          maxLength={FIELD_MAX}
          placeholder={t("dashboard.calendar.createForm.houseNumberHelper")}
          onChange={(e) => onChange({ houseNumber: e.target.value })}
        />
        <CharCount>
          {houseNumber.length}/{FIELD_MAX}
        </CharCount>
      </FieldGroup>

      <FieldGroup>
        <FieldLabel htmlFor="postcode">{t("dashboard.calendar.createForm.postcode")}</FieldLabel>
        <StyledInput
          id="postcode"
          value={postcode}
          maxLength={FIELD_MAX}
          placeholder={t("dashboard.calendar.createForm.postcodeHelper")}
          onChange={(e) => onChange({ postcode: e.target.value })}
        />
        <CharCount>
          {postcode.length}/{FIELD_MAX}
        </CharCount>
      </FieldGroup>

      <HelperText>{t("dashboard.calendar.createForm.locationHelper")}</HelperText>

      <ButtonRow>
        <ActionButton variant="outline" onClick={onBack}>
          {t("dashboard.calendar.createForm.back")}
        </ActionButton>
        <ActionButton variant="primary" onClick={onNext} disabled={!isNextEnabled}>
          {t("dashboard.calendar.createForm.next")}
        </ActionButton>
      </ButtonRow>
    </>
  );
}
