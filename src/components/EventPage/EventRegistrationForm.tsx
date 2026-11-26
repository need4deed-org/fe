"use client";

import Button from "@/components/core/button/Button/Button";
import { Checkbox } from "@/components/core/button/Checkbox/Checkbox";
import { EditableField } from "@/components/EditableField/EditableField";
import { eventRegisterAnchor } from "@/config/constants";
import { Heading2, Paragraph } from "@/components/styled/text";
import { useRegisterForEvent } from "@/hooks/useEventRegistrations";
import { zodResolver } from "@hookform/resolvers/zod";
import { EVENT_SIGN_UP_ANSWER_MAX_LENGTH, type ApiEventN4DGetList } from "need4deed-sdk";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { createEventRegistrationSchema, EventRegistrationFormData, VOLUNTEER_TYPES } from "./eventRegistrationSchema";
import { Form, VolunteerTypes } from "./styles";

export function EventRegistrationForm({ event }: { event: ApiEventN4DGetList }) {
  const { t } = useTranslation();
  const [isSent, setIsSent] = useState(false);
  const { mutate: register, isPending } = useRegisterForEvent(() => setIsSent(true));

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EventRegistrationFormData>({
    resolver: zodResolver(createEventRegistrationSchema(t)),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      numberOfPeople: 1,
      signUpAnswer: "",
      message: "",
      isVolunteer: false,
      volunteerTypes: [],
    },
  });
  const isVolunteer = watch("isVolunteer");
  const signUpQuestion = event.signUpQuestion?.trim();

  useEffect(() => {
    if (isSent) document.getElementById(eventRegisterAnchor)?.scrollIntoView({ block: "center" });
  }, [isSent]);

  if (isSent) {
    return (
      <Form as="div" id={eventRegisterAnchor} role="status">
        <Heading2>{t("eventRegistration.title")}</Heading2>
        <Paragraph>{t("eventRegistration.thanks")}</Paragraph>
      </Form>
    );
  }

  const onSubmit = (values: EventRegistrationFormData) =>
    register({
      eventId: event.id,
      fullName: values.fullName,
      email: values.email,
      numberOfPeople: values.numberOfPeople,
      ...(signUpQuestion ? { signUpAnswer: values.signUpAnswer || null } : {}),
      message: values.message || null,
      isVolunteer: values.isVolunteer,
      volunteerTypes: values.isVolunteer ? values.volunteerTypes : [],
    });

  const requiredText = (name: "fullName" | "email") => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <EditableField
          mode="edit"
          stacked
          type="text"
          label={`${t(`eventRegistration.fields.${name}`)} *`}
          value={field.value}
          setValue={field.onChange}
          errorMessage={errors[name]?.message}
        />
      )}
    />
  );

  return (
    <Form id={eventRegisterAnchor} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Heading2>{t("eventRegistration.title")}</Heading2>
      {requiredText("fullName")}
      {requiredText("email")}
      <Controller
        name="numberOfPeople"
        control={control}
        render={({ field }) => (
          <EditableField
            mode="edit"
            stacked
            type="number"
            label={`${t("eventRegistration.fields.numberOfPeople")} *`}
            value={field.value}
            setValue={(value) => field.onChange(Number(value))}
            errorMessage={errors.numberOfPeople?.message}
          />
        )}
      />
      {signUpQuestion && (
        <Controller
          name="signUpAnswer"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              stacked
              type="textarea"
              label={signUpQuestion}
              value={field.value}
              setValue={field.onChange}
              maxLength={EVENT_SIGN_UP_ANSWER_MAX_LENGTH}
              errorMessage={errors.signUpAnswer?.message}
            />
          )}
        />
      )}
      <Controller
        name="message"
        control={control}
        render={({ field }) => (
          <EditableField
            mode="edit"
            stacked
            type="textarea"
            label={t("eventRegistration.fields.message")}
            value={field.value}
            setValue={field.onChange}
            maxLength={500}
            errorMessage={errors.message?.message}
          />
        )}
      />
      <Controller
        name="isVolunteer"
        control={control}
        render={({ field }) => (
          <Checkbox
            width="24px"
            height="24px"
            label={t("eventRegistration.fields.isVolunteer")}
            labelLineHeight="var(--line-height-24)"
            checked={field.value}
            onChange={field.onChange}
          />
        )}
      />
      {isVolunteer && (
        <Controller
          name="volunteerTypes"
          control={control}
          render={({ field }) => (
            <VolunteerTypes role="group" aria-label={t("eventRegistration.fields.volunteerTypes")}>
              <Paragraph>{t("eventRegistration.fields.volunteerTypes")}</Paragraph>
              {VOLUNTEER_TYPES.map((type) => (
                <Checkbox
                  key={type}
                  width="24px"
                  height="24px"
                  label={t(`eventRegistration.volunteerTypes.${type}`)}
                  labelLineHeight="var(--line-height-24)"
                  checked={field.value.includes(type)}
                  onChange={(checked) =>
                    field.onChange(checked ? [...field.value, type] : field.value.filter((value) => value !== type))
                  }
                />
              ))}
            </VolunteerTypes>
          )}
        />
      )}
      <Button
        type="submit"
        text={t("eventRegistration.submit")}
        width="100%"
        disabled={isPending}
        backgroundcolor="var(--color-aubergine)"
        textColor="var(--color-white)"
      />
    </Form>
  );
}
