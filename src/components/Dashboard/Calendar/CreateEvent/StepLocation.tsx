"use client";
import Button from "@/components/core/button/Button/Button";
import { ErrorMessage, PLZChip } from "@/components/core/common";
import { Heading2 } from "@/components/styled/text";
import { PLZCheckStatus } from "@/utils/plz-check";
import { EVENT_SIGN_UP_QUESTION_MAX_LENGTH } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { EventFormData } from "./CreateEvent";
import { ButtonRow, CharCount, FieldGroup, FieldLabel, HelperText, StyledInput } from "./styles";

const FIELD_MAX = 128;

interface Props {
  street: string;
  houseNumber: string;
  postcode: string;
  plzStatus: PLZCheckStatus;
  showPostcodeError: boolean;
  registrationLink: string;
  signUpQuestion: string;
  onChange: (fields: Partial<EventFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  isNextEnabled: boolean;
}

export function StepLocation({
  street,
  houseNumber,
  postcode,
  plzStatus,
  showPostcodeError,
  registrationLink,
  signUpQuestion,
  onChange,
  onNext,
  onBack,
  isNextEnabled,
}: Props) {
  const { t } = useTranslation();

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
        {showPostcodeError && <ErrorMessage message={t("form.error.postcodeBerlin")} />}
        <PLZChip status={plzStatus} />
      </FieldGroup>

      <FieldGroup>
        <FieldLabel htmlFor="registration-link">{t("dashboard.calendar.createForm.registrationLink")}</FieldLabel>
        <StyledInput
          id="registration-link"
          type="url"
          value={registrationLink}
          placeholder="https://…"
          onChange={(e) => onChange({ registrationLink: e.target.value })}
        />
        <HelperText>{t("dashboard.calendar.createForm.registrationLinkHelper")}</HelperText>
      </FieldGroup>

      <FieldGroup>
        <FieldLabel htmlFor="sign-up-question">{t("dashboard.calendar.createForm.signUpQuestion")}</FieldLabel>
        <StyledInput
          id="sign-up-question"
          value={signUpQuestion}
          maxLength={EVENT_SIGN_UP_QUESTION_MAX_LENGTH}
          onChange={(e) => onChange({ signUpQuestion: e.target.value })}
        />
        <HelperText>{t("dashboard.calendar.createForm.signUpQuestionHelper")}</HelperText>
        <CharCount>
          {signUpQuestion.length}/{EVENT_SIGN_UP_QUESTION_MAX_LENGTH}
        </CharCount>
      </FieldGroup>

      <HelperText>{t("dashboard.calendar.createForm.locationHelper")}</HelperText>

      <ButtonRow>
        <Button
          text={t("dashboard.calendar.createForm.back")}
          onClick={onBack}
          backgroundcolor="transparent"
          border="var(--border-width-medium) solid var(--color-aubergine)"
          textColor="var(--color-aubergine)"
          width="auto"
          padding="var(--button-padding)"
        />
        <Button
          text={t("dashboard.calendar.createForm.next")}
          onClick={onNext}
          disabled={!isNextEnabled}
          width="auto"
          padding="var(--button-padding)"
        />
      </ButtonRow>
    </>
  );
}
