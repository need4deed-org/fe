"use client";
import WithParentRef from "@/components/withParentRef";
import useList from "@/hooks/useLists";
import usePostRequest from "@/hooks/usePostRequest";
import { Subpage } from "@/types";
import { useForm } from "@tanstack/react-form";
import { validate as validateEmail } from "email-validator";
import { Lang, OpportunityType, TranslatedIntoType } from "need4deed-sdk";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { apiPathOpportunity, eightDays, phoneRegEx } from "../../../config/constants";
import { getImageUrl } from "../../../utils";
import UploadIcon from "../../svg/Upload";
import FieldInfo from "../FieldInfo";
import HeaderWithHelp from "../HeaderWithHelp";
import style from "../index.module.css";
import MultipleCheckBoxInputsWithMore from "../MultipleCheckBoxInputsWithMore";
import MultipleRadioInputsWithMore from "../MultipleRadioInputsWithMore";
import SimpleInputField from "../SimpleInputField";
import { ListsOfOptions, TypePLZ } from "../types";
import {
  getAllSelectedFalse,
  getDate,
  getScheduleState,
  getTickMark,
  getTimeslotTitle,
  isSelected,
  isTimeSlotSelected,
  isValidPLZ,
  OpportunityDTO,
  parseFormStateDTOOpportunity,
} from "../utils";
import { validateRACEmail } from "../validators";
import { OpportunityData } from "./dataStructure";
import ErrorAnnouncement from "./ErrorAnnouncement";

const thankYou = "form.addOpportunity.thankYou";
const queryParamsMap: Record<string, keyof ParsedOpportunity> = {
  name: "fullName",
  email: "email",
  phone: "racPhone",
  address: "racAddress",
  postcode: "racPostcode",
};

type ParsedOpportunity = Pick<OpportunityData, "fullName" | "email" | "racPhone" | "racAddress" | "racPostcode">;

export default function AddOpportunity() {
  const navigate = useRouter();
  const { lng } = useParams();
  const { i18n, t } = useTranslation();
  const queryParams = useSearchParams();
  const language = i18n.language as Lang;
  const [showErrorAnnouncement, setShowErrorAnnouncement] = useState(false);

  const parsedOpportunity: Partial<ParsedOpportunity> = {};
  Object.entries(queryParamsMap).forEach(([queryParam, mappedParam]) => {
    parsedOpportunity[mappedParam] = queryParams.get(queryParam) || "";
  });

  const { postRequest } = usePostRequest<OpportunityDTO, Record<string, string | string[]>>({
    url: `${apiPathOpportunity}/legacy`,
  });

  const formOpportunity = useForm({
    defaultValues: {
      ...(parsedOpportunity as ParsedOpportunity),
      racName: [],
      title: "",
      opportunityType: undefined,
      locations: getAllSelectedFalse(useList(ListsOfOptions.LOCATIONS)),
      activities: getAllSelectedFalse(useList(ListsOfOptions.ACTIVITIES)),
      activitiesAccompanying: getAllSelectedFalse(useList(ListsOfOptions.ACTIVITIES_ACCOMPANYING)),
      languages: getAllSelectedFalse(useList(ListsOfOptions.LANGUAGES)),
      skills: getAllSelectedFalse(useList(ListsOfOptions.SKILLS)),
      aaAddress: "",
      aaPostcode: "",
      schedule: getScheduleState(),
      dateTime: undefined,
      numberVolunteers: "1",
      translatedInto: undefined,
      voInformation: "",
      refugeeName: "",
      refugeeNumber: "",
      aaInformation: "",
      consent: undefined,
      language,
    } as OpportunityData,
    onSubmit: async ({ value }) => {
      const data = parseFormStateDTOOpportunity(value);

      const { success } = await postRequest(data);
      if (success) {
        navigate.push(`/${Subpage.ANNOUNCEMENT}/?pointer=${thankYou}`);
      } else {
        setShowErrorAnnouncement(true);
      }
    },
  });

  if (showErrorAnnouncement) {
    return <ErrorAnnouncement />;
  }

  return (
    <div key={language} className={`n4d-container ${style["form-container"]}`}>
      <div className={style["form-container-header"]}>
        <h1>
          {t("form.addOpportunity.header").toLocaleUpperCase()}
          <Image src={getImageUrl("N4D-logo-purple-on-transparent-h.webp")} alt="" width={180} height={100} />
        </h1>
      </div>
      <form
        className={style["form-form-container"]}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          formOpportunity.handleSubmit();
        }}
      >
        <div className="d-flex flex-column">
          <SimpleInputField<OpportunityData>
            name="title"
            FieldTag={formOpportunity.Field}
            label={t("form.addOpportunity.fields.title.label")}
            onChangeValidator={({ value }) => {
              if (!value) return t("form.error.required");

              if ((value as string).length > 128) {
                return t("form.addOpportunity.fields.title.errorTooLong");
              }

              return undefined;
            }}
          />
          <i className="m-1">{t("form.addOpportunity.fields.title.example")}</i>
        </div>
        <fieldset className={style["form-field-group"]}>
          <b>{t("form.addOpportunity.fields.contactGroup.label")}</b>
          <span>
            <i>{t("form.addOpportunity.fields.contactGroup.info")}</i>
          </span>
          <SimpleInputField<OpportunityData>
            name="email"
            FieldTag={formOpportunity.Field}
            label={t("form.addOpportunity.fields.contactGroup.email.label")}
            onChangeValidator={({ value }) => {
              if (!value) {
                return t("form.error.required");
              }
              if (!validateEmail(value as string)) {
                return t("form.error.email");
              }
              return undefined;
            }}
            onChangeAsyncValidator={({ value }) => {
              return validateRACEmail(value as string, t("form.error.badEmail"));
            }}
          />
          <SimpleInputField<OpportunityData>
            name="fullName"
            FieldTag={formOpportunity.Field}
            label={t("form.addOpportunity.fields.contactGroup.fullName.label")}
            onChangeValidator={({ value }) => (!value ? t("form.error.required") : undefined)}
          />
          <SimpleInputField<OpportunityData>
            name="racAddress"
            FieldTag={formOpportunity.Field}
            label={t("form.addOpportunity.fields.contactGroup.address.label")}
            onChangeValidator={({ value }) => (!value ? t("form.error.required") : undefined)}
          />
          <SimpleInputField<OpportunityData>
            name="racPostcode"
            FieldTag={formOpportunity.Field}
            label={t("form.addOpportunity.fields.contactGroup.postcode.label")}
            onChangeValidator={({ value }) => {
              if (!value) {
                return t("form.error.required");
              }

              if (!isValidPLZ(value as string, TypePLZ.GERMANY)) {
                return t("form.error.postcode");
              }

              return undefined;
            }}
          />
          <SimpleInputField<OpportunityData>
            name="racPhone"
            FieldTag={formOpportunity.Field}
            label={t("form.addOpportunity.fields.contactGroup.phone.label")}
            onChangeValidator={({ value }) => {
              if (!value) return t("form.error.required");

              if (!(value as string).match(phoneRegEx)) return t("form.error.number");

              return undefined;
            }}
          />
        </fieldset>
        <formOpportunity.Field
          name="opportunityType"
          validators={{
            onBlur: ({ value }) => (value === undefined ? t("form.error.required") : undefined),
          }}
        >
          {(field) => (
            <fieldset
              className={style["form-pick"]}
              onFocus={() => {
                setTimeout(field.handleBlur, 0);
              }}
            >
              <HeaderWithHelp
                textHelp={t("form.addOpportunity.fields.opportunityType.helpText")}
                titleHelp={t("form.addOpportunity.fields.opportunityType.helpTitle")}
                classNamePopup="form-help"
              >
                {t("form.addOpportunity.fields.opportunityType.header")}
              </HeaderWithHelp>
              <div className={style["form-chip-list"]}>
                <MultipleRadioInputsWithMore
                  items={Object.values(OpportunityType)}
                  copyPath="form.addOpportunity.fields.opportunityType."
                  field={field}
                />
              </div>
              <FieldInfo field={field} />
            </fieldset>
          )}
        </formOpportunity.Field>
        <formOpportunity.Subscribe selector={(state) => state}>
          {(state) => {
            if (state.values.opportunityType === OpportunityType.ACCOMPANYING)
              return (
                <fieldset className={style["form-field-group"]}>
                  <b>{t("form.addOpportunity.fields.aaGroup.label")}</b>
                  <formOpportunity.Field
                    name="activitiesAccompanying"
                    validators={{
                      onBlur: ({ value }) => isSelected(value, t("form.error.required")),
                    }}
                  >
                    {(field) => {
                      return (
                        <fieldset>
                          <HeaderWithHelp
                            className={style["form-chiplist-header-within-group"]}
                            classNamePopup={style["form-help"]}
                          >
                            {t("form.addOpportunity.fields.aaGroup.activities.header")}
                          </HeaderWithHelp>
                          <WithParentRef
                            className={`${style["form-chip-list"]} ${style["form-pick"]}`}
                            onFocus={() => setTimeout(field.handleBlur, 0)}
                          >
                            <MultipleCheckBoxInputsWithMore<OpportunityData, "activitiesAccompanying">
                              FieldTag={formOpportunity.Field}
                              field={field}
                            />
                            <FieldInfo field={field} />
                          </WithParentRef>
                        </fieldset>
                      );
                    }}
                  </formOpportunity.Field>
                  <formOpportunity.Field
                    name="translatedInto"
                    validators={{
                      onBlur: ({ value }) => (value === undefined ? t("form.error.required") : undefined),
                    }}
                  >
                    {(field) => (
                      <fieldset
                        className={style["form-pick"]}
                        onFocus={() => {
                          setTimeout(field.handleBlur, 0);
                        }}
                      >
                        <HeaderWithHelp
                          textHelp={t("form.addOpportunity.fields.aaGroup.translatedInto.helpText")}
                          className={style["form-chiplist-header-within-group"]}
                          classNamePopup={style["form-help"]}
                        >
                          {t("form.addOpportunity.fields.aaGroup.translatedInto.header")}
                        </HeaderWithHelp>
                        <div className={style["form-chip-list"]}>
                          <MultipleRadioInputsWithMore
                            items={Object.values(TranslatedIntoType)}
                            copyPath="form.addOpportunity.fields.aaGroup.translatedInto."
                            field={field}
                          />
                        </div>
                        <FieldInfo field={field} />
                      </fieldset>
                    )}
                  </formOpportunity.Field>
                  {state.values.translatedInto && state.values.translatedInto !== TranslatedIntoType.NO_TRANSLATION && (
                    <formOpportunity.Field
                      name="languages"
                      validators={{
                        onBlur: ({ value }) => {
                          return isSelected(value, t("form.error.language"));
                        },
                      }}
                    >
                      {(field) => {
                        return (
                          <fieldset
                            onFocus={() => {
                              setTimeout(field.handleBlur, 0);
                            }}
                          >
                            <HeaderWithHelp
                              textHelp={t("form.addOpportunity.fields.aaGroup.languagesTranslation.helpText")}
                              className={style["form-chiplist-header-within-group"]}
                              classNamePopup={style["form-help"]}
                            >
                              {t("form.addOpportunity.fields.aaGroup.languagesTranslation.header")}
                            </HeaderWithHelp>
                            <WithParentRef className={`${style["form-chip-list"]} ${style["form-pick"]}`}>
                              <MultipleCheckBoxInputsWithMore<OpportunityData, "languages">
                                FieldTag={formOpportunity.Field}
                                field={field}
                                hiddenChips={
                                  state.values.translatedInto === TranslatedIntoType.ENGLISH_OK
                                    ? ["German", "Deutsch", "English", "Englisch"]
                                    : ["German", "Deutsch"]
                                }
                              />
                              <FieldInfo field={field} />
                            </WithParentRef>
                          </fieldset>
                        );
                      }}
                    </formOpportunity.Field>
                  )}
                  <SimpleInputField<OpportunityData>
                    name="aaAddress"
                    FieldTag={formOpportunity.Field}
                    label={t("form.addOpportunity.fields.aaGroup.address.label")}
                    onChangeValidator={({ value }) => (!value ? t("form.error.required") : undefined)}
                  />
                  <SimpleInputField<OpportunityData>
                    name="aaPostcode"
                    FieldTag={formOpportunity.Field}
                    label={t("form.addOpportunity.fields.aaGroup.postcode.label")}
                    onChangeValidator={({ value }) => {
                      if (!value) {
                        return t("form.error.required");
                      }

                      if (!isValidPLZ(value as string, TypePLZ.GERMANY)) {
                        return t("form.error.postcode");
                      }

                      return undefined;
                    }}
                  />
                  <SimpleInputField<OpportunityData>
                    name="dateTime"
                    FieldTag={formOpportunity.Field}
                    label={t("form.addOpportunity.fields.aaGroup.dateTime.label")}
                    inputType="datetime-local"
                    onChangeValidator={({ value }) => {
                      if (!value) {
                        return t("form.error.required");
                      }
                      if (Number.isNaN(getDate(value as string).getTime())) {
                        return t("form.error.badTime");
                      }
                      const difference = getDate(value as string).valueOf() - Date.now();
                      if (difference < eightDays) {
                        return t("form.addOpportunity.fields.aaGroup.dateTime.tooClose");
                      }
                      return undefined;
                    }}
                  />
                  <SimpleInputField<OpportunityData>
                    name="refugeeName"
                    FieldTag={formOpportunity.Field}
                    label={t("form.addOpportunity.fields.aaGroup.refugeeName.label")}
                    onChangeValidator={({ value }) => (!value ? t("form.error.required") : undefined)}
                  />
                  <SimpleInputField<OpportunityData>
                    name="refugeeNumber"
                    FieldTag={formOpportunity.Field}
                    label={t("form.addOpportunity.fields.aaGroup.refugeeNumber.label")}
                    onChangeValidator={({ value }) => {
                      if (!value) return t("form.error.required");

                      if (!(value as string).match(phoneRegEx)) return t("form.error.number");

                      return undefined;
                    }}
                  />
                  <SimpleInputField<OpportunityData>
                    name="aaInformation"
                    FieldTag={formOpportunity.Field}
                    label={t("form.addOpportunity.fields.aaGroup.information.label")}
                    onChangeValidator={({ value }) => (!value ? t("form.error.required") : undefined)}
                  />
                </fieldset>
              );
            return null;
          }}
        </formOpportunity.Subscribe>
        <formOpportunity.Subscribe selector={(state) => state}>
          {(state) => {
            if (state.values.opportunityType === OpportunityType.REGULAR)
              return (
                <fieldset className={style["form-field-group"]}>
                  <b>{t("form.addOpportunity.fields.voGroup.label")}</b>
                  <formOpportunity.Field
                    name="locations"
                    validators={{
                      onBlur: ({ value }) => isSelected(value, t("form.error.location")),
                    }}
                  >
                    {(field) => {
                      return (
                        <fieldset>
                          <HeaderWithHelp
                            className={style["form-chiplist-header-within-group"]}
                            classNamePopup={style["form-help"]}
                          >
                            {t("form.addOpportunity.fields.voGroup.locations.header")}
                          </HeaderWithHelp>
                          <WithParentRef
                            className={`${style["form-chip-list"]} ${style["form-pick"]}`}
                            onFocus={() => setTimeout(field.handleBlur, 0)}
                          >
                            <MultipleCheckBoxInputsWithMore<OpportunityData, "locations">
                              FieldTag={formOpportunity.Field}
                              field={field}
                            />
                            <FieldInfo field={field} />
                          </WithParentRef>
                        </fieldset>
                      );
                    }}
                  </formOpportunity.Field>
                  <formOpportunity.Field
                    name="activities"
                    validators={{
                      onBlur: ({ value }) => isSelected(value, t("form.error.activity")),
                    }}
                  >
                    {(field) => {
                      return (
                        <fieldset>
                          <HeaderWithHelp
                            className={style["form-chiplist-header-within-group"]}
                            classNamePopup={style["form-help"]}
                          >
                            {t("form.addOpportunity.fields.voGroup.activities.header")}
                          </HeaderWithHelp>
                          <WithParentRef
                            className={`${style["form-chip-list"]} ${style["form-pick"]}`}
                            onFocus={() => setTimeout(field.handleBlur, 0)}
                          >
                            <MultipleCheckBoxInputsWithMore<OpportunityData, "activities">
                              FieldTag={formOpportunity.Field}
                              field={field}
                            />
                            <FieldInfo field={field} />
                          </WithParentRef>
                        </fieldset>
                      );
                    }}
                  </formOpportunity.Field>
                  <formOpportunity.Field
                    name="languages"
                    validators={{
                      onBlur: ({ value }) => isSelected(value, t("form.error.language")),
                    }}
                  >
                    {(field) => {
                      return (
                        <fieldset>
                          <HeaderWithHelp
                            textHelp={t("form.addOpportunity.fields.voGroup.languagesRefugee.helpText")}
                            className={style["form-chiplist-header-within-group"]}
                            classNamePopup={style["form-help"]}
                          >
                            {t("form.addOpportunity.fields.voGroup.languagesRefugee.header")}
                          </HeaderWithHelp>
                          <WithParentRef
                            className={`${style["form-chip-list"]} ${style["form-pick"]}`}
                            onFocus={() => setTimeout(field.handleBlur, 0)}
                          >
                            <MultipleCheckBoxInputsWithMore<OpportunityData, "languages">
                              FieldTag={formOpportunity.Field}
                              field={field}
                            />
                            <FieldInfo field={field} />
                          </WithParentRef>
                        </fieldset>
                      );
                    }}
                  </formOpportunity.Field>
                  <formOpportunity.Field name="skills">
                    {(field) => {
                      return (
                        <fieldset>
                          <HeaderWithHelp
                            textHelp={t("form.addOpportunity.fields.voGroup.skills.helpText")}
                            className={style["form-chiplist-header-within-group"]}
                            classNamePopup={style["form-help"]}
                          >
                            {t("form.addOpportunity.fields.voGroup.skills.header")}
                          </HeaderWithHelp>
                          <WithParentRef className={`${style["form-chip-list"]} ${style["form-pick"]}`}>
                            <MultipleCheckBoxInputsWithMore<OpportunityData, "skills">
                              FieldTag={formOpportunity.Field}
                              field={field}
                            />
                            <FieldInfo field={field} />
                          </WithParentRef>
                        </fieldset>
                      );
                    }}
                  </formOpportunity.Field>
                  <formOpportunity.Field
                    name="schedule"
                    validators={{
                      onBlur: ({ value, fieldApi }) => {
                        setTimeout(() => fieldApi.form.validateField("onetimeDateTime", "change"), 0);
                        const isDateTime = !!fieldApi.form.getFieldValue("onetimeDateTime");
                        const isScheduleEmpty = !isTimeSlotSelected(value);
                        if (!isScheduleEmpty && isDateTime)
                          return t("form.addOpportunity.fields.voGroup.schedule.errorBoth");
                        if (isScheduleEmpty && !isDateTime)
                          return t("form.addOpportunity.fields.voGroup.schedule.error");

                        return undefined;
                      },
                      onChangeListenTo: ["onetimeDateTime"],
                    }}
                  >
                    {(field) => {
                      return (
                        <fieldset className={style["form-schedule"]}>
                          <HeaderWithHelp
                            textHelp={t("form.addOpportunity.fields.voGroup.schedule.helpText")}
                            className={style["form-chiplist-header-within-group"]}
                            classNamePopup={style["form-help"]}
                          >
                            {t("form.addOpportunity.fields.voGroup.schedule.header")}
                          </HeaderWithHelp>
                          <div
                            className={style["form-table"]}
                            onFocus={() => {
                              setTimeout(field.handleBlur, 0);
                            }}
                          >
                            {field.state.value &&
                              field.state.value.map(({ weekday }, idx) => {
                                return (
                                  <div className={style["form-table-row"]} key={`weekday${weekday}`}>
                                    <span className={style["form-availability-weekday"]}>
                                      {t(`form.schedule.${weekday}`).toLocaleUpperCase()}
                                    </span>

                                    <formOpportunity.Field name={`schedule[${idx}].timeSlots`}>
                                      {(fieldWeekday) => {
                                        return (
                                          fieldWeekday.state.value &&
                                          fieldWeekday.state.value.map(({ title, id }, idxInner) => {
                                            return (
                                              <formOpportunity.Field
                                                key={`${weekday}${id}`}
                                                name={`schedule[${idx}].timeSlots[${idxInner}].selected`}
                                              >
                                                {(fieldTimeslot) => {
                                                  return (
                                                    <span className={style["form-pick"]}>
                                                      <input
                                                        tabIndex={0}
                                                        id={`${weekday}${idxInner}${fieldWeekday.state.value[idxInner].id}`}
                                                        type="checkbox"
                                                        onChange={(e) => {
                                                          fieldTimeslot.handleChange(e.target.checked);
                                                        }}
                                                      />
                                                      <label
                                                        htmlFor={`${weekday}${idxInner}${fieldWeekday.state.value[idxInner].id}`}
                                                      >
                                                        <span>
                                                          {getTimeslotTitle(t, title[i18n.language as Lang] as string)}
                                                        </span>
                                                      </label>
                                                    </span>
                                                  );
                                                }}
                                              </formOpportunity.Field>
                                            );
                                          })
                                        );
                                      }}
                                    </formOpportunity.Field>
                                  </div>
                                );
                              })}
                          </div>
                          <h6>
                            <i>{t("form.addOpportunity.fields.voGroup.schedule.or").toUpperCase()}</i>
                          </h6>
                          <SimpleInputField<OpportunityData>
                            name="onetimeDateTime"
                            FieldTag={formOpportunity.Field}
                            label={t("form.addOpportunity.fields.voGroup.schedule.oneTimeLabel")}
                            inputType="datetime-local"
                            validators={{
                              onChange: ({ value, fieldApi }) => {
                                setTimeout(() => fieldApi.form.validateField("schedule", "blur"), 0);
                                if (!value && !isTimeSlotSelected(fieldApi.form.getFieldValue("schedule"))) {
                                  return t("form.addOpportunity.fields.voGroup.schedule.error");
                                }
                                if (value && Number.isNaN(getDate(value as string).getTime())) {
                                  return t("form.error.badTime");
                                }
                                return undefined;
                              },
                              onChangeListenTo: ["schedule"],
                            }}
                            onFocus={() => {
                              setTimeout(field.handleBlur, 0);
                            }}
                          />
                          <FieldInfo field={field} />
                        </fieldset>
                      );
                    }}
                  </formOpportunity.Field>
                  <SimpleInputField<OpportunityData>
                    name="numberVolunteers"
                    FieldTag={formOpportunity.Field}
                    label={t("form.addOpportunity.fields.voGroup.numberVolunteers.label")}
                    onChangeValidator={({ value }) => {
                      if (!value) {
                        return t("form.error.required");
                      }
                      const numVolunteers = Number(value as string);
                      if (Number.isNaN(numVolunteers)) {
                        return t("form.addOpportunity.fields.voGroup.numberVolunteers.error");
                      }
                      return undefined;
                    }}
                  />
                  <SimpleInputField<OpportunityData>
                    name="voInformation"
                    FieldTag={formOpportunity.Field}
                    label={t("form.addOpportunity.fields.voGroup.information.label")}
                    onChangeValidator={({ value }) => (!value ? t("form.error.required") : undefined)}
                  />
                </fieldset>
              );
            return null;
          }}
        </formOpportunity.Subscribe>
        <formOpportunity.Field
          name="consent"
          validators={{
            onChange: ({ value }) => (value ? undefined : t("form.error.required")),
          }}
        >
          {(field) => {
            return (
              <div>
                <div className={`${style["form-chip-list"]} ${style["form-pick"]}`}>
                  <input
                    id="consent"
                    type="checkbox"
                    name="consent"
                    onChange={(e) => {
                      field.handleChange(e.target.checked);
                      field.validate("change");
                    }}
                  />
                  <label htmlFor="consent">{getTickMark(!!field.state.value)}</label>
                  <span>
                    {t("form.addOpportunity.fields.consent.header")} {t("form.addOpportunity.fields.consent.agree")}{" "}
                    <a href={`/${Subpage.GUIDELINES}/${lng}`}>{t("homepage.footer.legal.guidelines")}</a>{" "}
                    {t("form.addOpportunity.fields.consent.and")}{" "}
                    <a href={`/${Subpage.DATA_PROTECTION}/${lng}`}>{t("homepage.footer.legal.dataPrivacy")}</a>
                  </span>
                </div>
                <FieldInfo field={field} />
              </div>
            );
          }}
        </formOpportunity.Field>
        <formOpportunity.Subscribe selector={(state) => state}>
          {(state) => {
            const errors = Array.from(
              new Set(
                Object.keys(formOpportunity.state.fieldMeta)
                  .reduce((errorList: string[], key) => {
                    const errorsMsgs =
                      formOpportunity.state.fieldMeta[key as keyof typeof formOpportunity.state.fieldMeta].errors?.join(
                        ", ",
                      );
                    errorList.push(errorsMsgs);
                    return errorList;
                  }, [])
                  .filter(Boolean),
              ),
            ).join(", ");
            return (
              <div className={style["form-submit"]}>
                <button className="n4d-cta" type="submit" disabled={!state.canSubmit}>
                  {state.isSubmitting ? (
                    "..."
                  ) : (
                    <>
                      <UploadIcon />
                      {t("form.button.submit").toUpperCase()}
                    </>
                  )}
                </button>
                {errors ? (
                  <em>
                    {t("form.error.labelErrors")}: {errors}
                  </em>
                ) : null}
              </div>
            );
          }}
        </formOpportunity.Subscribe>
      </form>
      <p>{t("form.addOpportunity.bottomMsg")}</p>
    </div>
  );
}

export const opps = [
  {
    fullName: "Good Samaritan",
    email: "gs@need4deed.org",
    racPhone: "420-024",
    racAddress: "Yershalaim",
    racPostcode: "12345",
    racName: [],
    title: "Test opportunity accompanying",
    opportunityType: "accompanying",
    locations: [
      { id: "Mitte", title: { de: "Mitte", en: "Mitte" }, selected: false },
      { id: "Moabit", title: { de: "Moabit", en: "Moabit" }, selected: false },
      { id: "Wedding", title: { de: "Wedding", en: "Wedding" }, selected: false },
      { id: "Friedrichshain", title: { de: "Friedrichshain", en: "Friedrichshain" }, selected: false },
      { id: "Kreuzberg", title: { de: "Kreuzberg", en: "Kreuzberg" }, selected: false },
      { id: "Pankow", title: { de: "Pankow", en: "Pankow" }, selected: false },
      { id: "Prenzlauer Berg", title: { de: "Prenzlauer Berg", en: "Prenzlauer Berg" }, selected: false },
      { id: "Weißensee", title: { de: "Weißensee", en: "Weißensee" }, selected: false },
      { id: "Charlottenburg", title: { de: "Charlottenburg", en: "Charlottenburg" }, selected: false },
      { id: "Wilmersdorf", title: { de: "Wilmersdorf", en: "Wilmersdorf" }, selected: false },
      { id: "Spandau", title: { de: "Spandau", en: "Spandau" }, selected: false },
      { id: "Steglitz", title: { de: "Steglitz", en: "Steglitz" }, selected: false },
      { id: "Zehlendorf", title: { de: "Zehlendorf", en: "Zehlendorf" }, selected: false },
      { id: "Tempelhof", title: { de: "Tempelhof", en: "Tempelhof" }, selected: false },
      { id: "Schöneberg", title: { de: "Schöneberg", en: "Schöneberg" }, selected: false },
      { id: "Neukölln", title: { de: "Neukölln", en: "Neukölln" }, selected: false },
      { id: "Treptow", title: { de: "Treptow", en: "Treptow" }, selected: false },
      { id: "Köpenick", title: { de: "Köpenick", en: "Köpenick" }, selected: false },
      { id: "Marzahn", title: { de: "Marzahn", en: "Marzahn" }, selected: false },
      { id: "Hellersdorf", title: { de: "Hellersdorf", en: "Hellersdorf" }, selected: false },
      { id: "Lichtenberg", title: { de: "Lichtenberg", en: "Lichtenberg" }, selected: false },
      { id: "Reinickendorf", title: { de: "Reinickendorf", en: "Reinickendorf" }, selected: false },
      { id: "Tegel", title: { de: "Tegel", en: "Tegel" }, selected: false },
      { id: "Rudow", title: { de: "Rudow", en: "Rudow" }, selected: false },
      { id: "Remotely", title: { de: "Remotely", en: "Remotely" }, selected: false },
    ],
    activities: [
      { id: "Daycare", title: { en: "Daycare", de: "Kinderbetreuung" }, selected: false },
      { id: "Sports", title: { en: "Sports", de: "Sport" }, selected: false },
      { id: "Language café", title: { en: "German language Cafe", de: "Sprachcafé" }, selected: false },
      {
        id: "Translation",
        title: { en: "Translation at Accommodation Centers", de: "Sprachmittlung in Unterkünften" },
        selected: false,
      },
      { id: "Fillout German forms", title: { en: "Fillout German forms", de: "Ausfüllhilfe" }, selected: false },
      { id: "Arts", title: { en: "Arts & Crafts", de: "Basteln" }, selected: false },
      { id: "Gardening", title: { en: "Gardening", de: "Gartenarbeit" }, selected: false },
      {
        id: "One-day",
        title: {
          en: "One-day Volunteering (e.g. Festivals, Cleanups)",
          de: "Eintägiges Engagement (z. B. Feier, Aufräumaktionen)",
        },
        selected: false,
      },
      { id: "Playing", title: { en: "Playing board games", de: "Brettspiele spielen" }, selected: false },
      { id: "Reading", title: { en: "Reading books for children", de: "Bücher vorlesen für Kinder" }, selected: false },
      { id: "Activities-women", title: { en: "Activities for women", de: "Aktivitäten für Frauen*" }, selected: false },
      { id: "Activities-men", title: { en: "Activities for men", de: "Aktivitäten für Männer*" }, selected: false },
      { id: "Tutoring", title: { en: "Assist with homework", de: "Nachhilfe" }, selected: false },
      { id: "Clothing Sorting", title: { en: "Sorting clothing", de: "Kleiderkammer" }, selected: false },
      { id: "Excursions", title: { en: "Organizing excursions", de: "Ausflüge organisieren" }, selected: false },
      { id: "Miscellaneous", title: { en: "Miscellaneous", de: "Sonstiges" }, selected: false },
      { id: "Mentorship", title: { en: "Mentorship", de: "Mentoren" }, selected: false },
    ],
    activitiesAccompanying: [
      {
        id: "Accompanying to government appointments",
        title: { en: "Accompanying to government appointments", de: "Begleitung: Termine bei Behörden* " },
        selected: true,
      },
      {
        id: "Apartment viewing accompanying",
        title: { en: "Apartment viewing accompanying", de: "Begleitung: Wohnungsbesichtigungen" },
        selected: false,
      },
      {
        id: "Schools meetings ccompanying",
        title: { en: "Schools meetings ccompanying", de: "Begleitung: Termine in Schulen und Kitas" },
        selected: false,
      },
      { id: "Accompanying", title: { en: "Accompanying", de: "Wegbegleitung" }, selected: false },
      {
        id: "Accompanying to doctors'",
        title: { en: "Accompanying to doctors' ", de: "Begleitung: Arzttermine" },
        selected: true,
      },
    ],
    languages: [
      { id: "de", title: { en: "German", de: "Deutsch" }, selected: false },
      { id: "en", title: { en: "English", de: "Englisch" }, selected: false },
      { id: "ar", title: { en: "Arabic", de: "Arabisch" }, selected: true },
      { id: "fa", title: { en: "Farsi/Dari", de: "Farsi/Dari" }, selected: true },
      { id: "tr", title: { en: "Turkish", de: "Türkisch" }, selected: true },
      { id: "ru", title: { en: "Russian", de: "Russisch" }, selected: false },
      { id: "uk", title: { en: "Ukrainian", de: "Ukrainisch" }, selected: false },
      { id: "fr", title: { en: "French", de: "Französisch" }, selected: false },
      { id: "kmr", title: { en: "Kurmanji", de: "Kurmanci" }, selected: false },
      { id: "cdh", title: { en: "Sorani", de: "Sorani" }, selected: false },
      { id: "hy", title: { en: "Armenian", de: "Armenisch" }, selected: false },
      { id: "be", title: { en: "Belarusian", de: "Weißrussisch" }, selected: false },
      { id: "ce", title: { en: "Chechen", de: "Tschetschenisch" }, selected: false },
      { id: "zh", title: { en: "Chinese", de: "Chinesisch" }, selected: false },
      { id: "cs", title: { en: "Czech", de: "Tschechisch" }, selected: false },
      { id: "da", title: { en: "Dari", de: "Dari" }, selected: false },
      { id: "nl", title: { en: "Dutch", de: "Niederländisch" }, selected: false },
      { id: "ka", title: { en: "Georgian", de: "Georgisch" }, selected: false },
      { id: "el", title: { en: "Greek", de: "Griechisch" }, selected: false },
      { id: "he", title: { en: "Hebrew", de: "Hebräisch" }, selected: false },
      { id: "hi", title: { en: "Hindi", de: "Hindi" }, selected: false },
      { id: "it", title: { en: "Italian", de: "Italienisch" }, selected: false },
      { id: "ps", title: { en: "Pashto", de: "Paschtu" }, selected: false },
      { id: "pl", title: { en: "Polish", de: "Polnisch" }, selected: false },
      { id: "pa", title: { en: "Punjabi", de: "Punjabi" }, selected: false },
      { id: "rom", title: { en: "Romanes", de: "Romanes" }, selected: false },
      { id: "ro", title: { en: "Romanian", de: "Rumänisch" }, selected: false },
      { id: "sr", title: { en: "Serbian", de: "Serbisch" }, selected: false },
      { id: "so", title: { en: "Somali", de: "Somali" }, selected: false },
      { id: "es", title: { en: "Spanish", de: "Spanisch" }, selected: false },
      { id: "sv", title: { en: "Swedish", de: "Schwedisch" }, selected: false },
      { id: "ur", title: { en: "Urdu", de: "Urdu" }, selected: false },
      { id: "vi", title: { en: "Vietnamese", de: "Vietnamesisch" }, selected: false },
      { id: "zzz", title: { en: "Other", de: "Andere" }, selected: false },
    ],
    skills: [
      { id: "Woodworking", title: { en: "Woodworking", de: "Holzverarbeitung" }, selected: false },
      { id: "Drawing", title: { en: "Drawing", de: "Zeichnen" }, selected: false },
      { id: "Painting", title: { en: "Painting", de: "Malen" }, selected: false },
      { id: "Sewing", title: { en: "Sewing", de: "Nähen" }, selected: false },
      { id: "Knitting", title: { en: "Knitting", de: "Stricken" }, selected: false },
      { id: "Repairs", title: { en: "Repairs", de: "Reparaturen" }, selected: false },
      { id: "Cooking", title: { en: "Cooking", de: "Kochen" }, selected: false },
      { id: "Teaching", title: { en: "Teaching", de: "Lehren" }, selected: false },
      { id: "Programming", title: { en: "Programming", de: "Programmieren" }, selected: false },
      { id: "Public speaking", title: { en: "Public speaking", de: "Öffentliches Sprechen" }, selected: false },
      { id: "Gardening", title: { en: "Gardening", de: "Gartenarbeit" }, selected: false },
      { id: "Landscaping", title: { en: "Landscaping", de: "Landschaftsgestaltung" }, selected: false },
      { id: "Carpentry", title: { en: "Carpentry", de: "Tischlerei" }, selected: false },
      { id: "Decorating", title: { en: "Decorating", de: "Dekorieren" }, selected: false },
      { id: "Bike", title: { en: "Bike repairs", de: "Fahrradreparaturen" }, selected: false },
      { id: "Photography", title: { en: "Photography", de: "Fotografie" }, selected: false },
      { id: "Videography", title: { en: "Videography", de: "Videografie" }, selected: false },
      { id: "Makeup", title: { en: "Makeup", de: "Make-up" }, selected: false },
      { id: "Copywriting", title: { en: "Copywriting", de: "Kreatives Schreiben" }, selected: false },
      { id: "Yoga", title: { en: "Yoga", de: "Yoga" }, selected: false },
      { id: "Fitness", title: { en: "Fitness", de: "Fitness" }, selected: false },
      { id: "Football", title: { en: "Football", de: "Fußball" }, selected: false },
      { id: "Basketball", title: { en: "Basketball", de: "Basketball" }, selected: false },
      { id: "Dance", title: { en: "Dance", de: "Tanzen" }, selected: false },
      { id: "Chess", title: { en: "Chess", de: "Schach" }, selected: false },
      { id: "Management", title: { en: "Management", de: "Management" }, selected: false },
      { id: "SMM", title: { en: "SMM", de: "Social-Media-Management (SMM)" }, selected: false },
      { id: "Mediation", title: { en: "Mediation", de: "Mediation" }, selected: false },
      { id: "Event", title: { en: "Event planning", de: "Veranstaltungsplanung" }, selected: false },
      { id: "Coaching", title: { en: "Coaching", de: "Coaching" }, selected: false },
      { id: "Guitar", title: { en: "Guitar", de: "Gitarre" }, selected: false },
      { id: "Piano", title: { en: "Piano", de: "Klavier" }, selected: false },
      { id: "Singing", title: { en: "Singing", de: "Singen" }, selected: false },
    ],
    aaAddress: "Nazareth 100",
    aaPostcode: "12345",
    schedule: [
      {
        weekday: 1,
        timeSlots: [
          { id: "08-11", title: { en: "08-11", de: "08-11" }, selected: false },
          { id: "11-14", title: { en: "11-14", de: "11-14" }, selected: false },
          { id: "14-17", title: { en: "14-17", de: "14-17" }, selected: false },
          { id: "17-20", title: { en: "17-20", de: "17-20" }, selected: false },
        ],
      },
      {
        weekday: 2,
        timeSlots: [
          { id: "08-11", title: { en: "08-11", de: "08-11" }, selected: false },
          { id: "11-14", title: { en: "11-14", de: "11-14" }, selected: false },
          { id: "14-17", title: { en: "14-17", de: "14-17" }, selected: false },
          { id: "17-20", title: { en: "17-20", de: "17-20" }, selected: false },
        ],
      },
      {
        weekday: 3,
        timeSlots: [
          { id: "08-11", title: { en: "08-11", de: "08-11" }, selected: false },
          { id: "11-14", title: { en: "11-14", de: "11-14" }, selected: false },
          { id: "14-17", title: { en: "14-17", de: "14-17" }, selected: false },
          { id: "17-20", title: { en: "17-20", de: "17-20" }, selected: false },
        ],
      },
      {
        weekday: 4,
        timeSlots: [
          { id: "08-11", title: { en: "08-11", de: "08-11" }, selected: false },
          { id: "11-14", title: { en: "11-14", de: "11-14" }, selected: false },
          { id: "14-17", title: { en: "14-17", de: "14-17" }, selected: false },
          { id: "17-20", title: { en: "17-20", de: "17-20" }, selected: false },
        ],
      },
      {
        weekday: 5,
        timeSlots: [
          { id: "08-11", title: { en: "08-11", de: "08-11" }, selected: false },
          { id: "11-14", title: { en: "11-14", de: "11-14" }, selected: false },
          { id: "14-17", title: { en: "14-17", de: "14-17" }, selected: false },
          { id: "17-20", title: { en: "17-20", de: "17-20" }, selected: false },
        ],
      },
      {
        weekday: 6,
        timeSlots: [
          { id: "08-11", title: { en: "08-11", de: "08-11" }, selected: false },
          { id: "11-14", title: { en: "11-14", de: "11-14" }, selected: false },
          { id: "14-17", title: { en: "14-17", de: "14-17" }, selected: false },
          { id: "17-20", title: { en: "17-20", de: "17-20" }, selected: false },
        ],
      },
      {
        weekday: 7,
        timeSlots: [
          { id: "08-11", title: { en: "08-11", de: "08-11" }, selected: false },
          { id: "11-14", title: { en: "11-14", de: "11-14" }, selected: false },
          { id: "14-17", title: { en: "14-17", de: "14-17" }, selected: false },
          { id: "17-20", title: { en: "17-20", de: "17-20" }, selected: false },
        ],
      },
      {
        weekday: 0,
        timeSlots: [
          { id: "weekdays", title: { en: "weekdays", de: "wochentage" }, selected: false },
          { id: "weekends", title: { en: "weekends", de: "wocheenden" }, selected: false },
        ],
      },
    ],
    dateTime: "2026-04-30T13:20",
    numberVolunteers: "1",
    translatedInto: "englishOk",
    voInformation: "",
    refugeeName: "John Doe",
    refugeeNumber: "024-420",
    aaInformation: "Test accompanying",
    consent: true,
    language: "de",
  },
  {
    fullName: "Good Samaritan",
    email: "gs@need4deed.org",
    racPhone: "420-024",
    racAddress: "Yershalaim 100",
    racPostcode: "12345",
    racName: [],
    title: "Test regular opportunity",
    opportunityType: "regular",
    locations: [
      { id: "Mitte", title: { de: "Mitte", en: "Mitte" }, selected: true },
      { id: "Moabit", title: { de: "Moabit", en: "Moabit" }, selected: false },
      { id: "Wedding", title: { de: "Wedding", en: "Wedding" }, selected: false },
      { id: "Friedrichshain", title: { de: "Friedrichshain", en: "Friedrichshain" }, selected: true },
      { id: "Kreuzberg", title: { de: "Kreuzberg", en: "Kreuzberg" }, selected: true },
      { id: "Pankow", title: { de: "Pankow", en: "Pankow" }, selected: false },
      { id: "Prenzlauer Berg", title: { de: "Prenzlauer Berg", en: "Prenzlauer Berg" }, selected: true },
      { id: "Weißensee", title: { de: "Weißensee", en: "Weißensee" }, selected: false },
      { id: "Charlottenburg", title: { de: "Charlottenburg", en: "Charlottenburg" }, selected: false },
      { id: "Wilmersdorf", title: { de: "Wilmersdorf", en: "Wilmersdorf" }, selected: false },
      { id: "Spandau", title: { de: "Spandau", en: "Spandau" }, selected: false },
      { id: "Steglitz", title: { de: "Steglitz", en: "Steglitz" }, selected: false },
      { id: "Zehlendorf", title: { de: "Zehlendorf", en: "Zehlendorf" }, selected: false },
      { id: "Tempelhof", title: { de: "Tempelhof", en: "Tempelhof" }, selected: false },
      { id: "Schöneberg", title: { de: "Schöneberg", en: "Schöneberg" }, selected: false },
      { id: "Neukölln", title: { de: "Neukölln", en: "Neukölln" }, selected: false },
      { id: "Treptow", title: { de: "Treptow", en: "Treptow" }, selected: false },
      { id: "Köpenick", title: { de: "Köpenick", en: "Köpenick" }, selected: false },
      { id: "Marzahn", title: { de: "Marzahn", en: "Marzahn" }, selected: false },
      { id: "Hellersdorf", title: { de: "Hellersdorf", en: "Hellersdorf" }, selected: false },
      { id: "Lichtenberg", title: { de: "Lichtenberg", en: "Lichtenberg" }, selected: false },
      { id: "Reinickendorf", title: { de: "Reinickendorf", en: "Reinickendorf" }, selected: false },
      { id: "Tegel", title: { de: "Tegel", en: "Tegel" }, selected: false },
      { id: "Rudow", title: { de: "Rudow", en: "Rudow" }, selected: false },
      { id: "Remotely", title: { de: "Remotely", en: "Remotely" }, selected: false },
    ],
    activities: [
      { id: "Daycare", title: { en: "Daycare", de: "Kinderbetreuung" }, selected: false },
      { id: "Sports", title: { en: "Sports", de: "Sport" }, selected: true },
      { id: "Language café", title: { en: "German language Cafe", de: "Sprachcafé" }, selected: true },
      {
        id: "Translation",
        title: { en: "Translation at Accommodation Centers", de: "Sprachmittlung in Unterkünften" },
        selected: false,
      },
      { id: "Fillout German forms", title: { en: "Fillout German forms", de: "Ausfüllhilfe" }, selected: false },
      { id: "Arts", title: { en: "Arts & Crafts", de: "Basteln" }, selected: true },
      { id: "Gardening", title: { en: "Gardening", de: "Gartenarbeit" }, selected: false },
      {
        id: "One-day",
        title: {
          en: "One-day Volunteering (e.g. Festivals, Cleanups)",
          de: "Eintägiges Engagement (z. B. Feier, Aufräumaktionen)",
        },
        selected: false,
      },
      { id: "Playing", title: { en: "Playing board games", de: "Brettspiele spielen" }, selected: false },
      { id: "Reading", title: { en: "Reading books for children", de: "Bücher vorlesen für Kinder" }, selected: false },
      { id: "Activities-women", title: { en: "Activities for women", de: "Aktivitäten für Frauen*" }, selected: false },
      { id: "Activities-men", title: { en: "Activities for men", de: "Aktivitäten für Männer*" }, selected: false },
      { id: "Tutoring", title: { en: "Assist with homework", de: "Nachhilfe" }, selected: false },
      { id: "Clothing Sorting", title: { en: "Sorting clothing", de: "Kleiderkammer" }, selected: false },
      { id: "Excursions", title: { en: "Organizing excursions", de: "Ausflüge organisieren" }, selected: false },
      { id: "Miscellaneous", title: { en: "Miscellaneous", de: "Sonstiges" }, selected: false },
      { id: "Mentorship", title: { en: "Mentorship", de: "Mentoren" }, selected: false },
    ],
    activitiesAccompanying: [
      {
        id: "Accompanying to government appointments",
        title: { en: "Accompanying to government appointments", de: "Begleitung: Termine bei Behörden* " },
        selected: false,
      },
      {
        id: "Apartment viewing accompanying",
        title: { en: "Apartment viewing accompanying", de: "Begleitung: Wohnungsbesichtigungen" },
        selected: false,
      },
      {
        id: "Schools meetings ccompanying",
        title: { en: "Schools meetings ccompanying", de: "Begleitung: Termine in Schulen und Kitas" },
        selected: false,
      },
      { id: "Accompanying", title: { en: "Accompanying", de: "Wegbegleitung" }, selected: false },
      {
        id: "Accompanying to doctors'",
        title: { en: "Accompanying to doctors' ", de: "Begleitung: Arzttermine" },
        selected: false,
      },
    ],
    languages: [
      { id: "de", title: { en: "German", de: "Deutsch" }, selected: false },
      { id: "en", title: { en: "English", de: "Englisch" }, selected: false },
      { id: "ar", title: { en: "Arabic", de: "Arabisch" }, selected: true },
      { id: "fa", title: { en: "Farsi/Dari", de: "Farsi/Dari" }, selected: true },
      { id: "tr", title: { en: "Turkish", de: "Türkisch" }, selected: true },
      { id: "ru", title: { en: "Russian", de: "Russisch" }, selected: false },
      { id: "uk", title: { en: "Ukrainian", de: "Ukrainisch" }, selected: false },
      { id: "fr", title: { en: "French", de: "Französisch" }, selected: false },
      { id: "kmr", title: { en: "Kurmanji", de: "Kurmanci" }, selected: false },
      { id: "cdh", title: { en: "Sorani", de: "Sorani" }, selected: false },
      { id: "hy", title: { en: "Armenian", de: "Armenisch" }, selected: false },
      { id: "be", title: { en: "Belarusian", de: "Weißrussisch" }, selected: false },
      { id: "ce", title: { en: "Chechen", de: "Tschetschenisch" }, selected: false },
      { id: "zh", title: { en: "Chinese", de: "Chinesisch" }, selected: false },
      { id: "cs", title: { en: "Czech", de: "Tschechisch" }, selected: false },
      { id: "da", title: { en: "Dari", de: "Dari" }, selected: false },
      { id: "nl", title: { en: "Dutch", de: "Niederländisch" }, selected: false },
      { id: "ka", title: { en: "Georgian", de: "Georgisch" }, selected: false },
      { id: "el", title: { en: "Greek", de: "Griechisch" }, selected: false },
      { id: "he", title: { en: "Hebrew", de: "Hebräisch" }, selected: false },
      { id: "hi", title: { en: "Hindi", de: "Hindi" }, selected: false },
      { id: "it", title: { en: "Italian", de: "Italienisch" }, selected: false },
      { id: "ps", title: { en: "Pashto", de: "Paschtu" }, selected: false },
      { id: "pl", title: { en: "Polish", de: "Polnisch" }, selected: false },
      { id: "pa", title: { en: "Punjabi", de: "Punjabi" }, selected: false },
      { id: "rom", title: { en: "Romanes", de: "Romanes" }, selected: false },
      { id: "ro", title: { en: "Romanian", de: "Rumänisch" }, selected: false },
      { id: "sr", title: { en: "Serbian", de: "Serbisch" }, selected: false },
      { id: "so", title: { en: "Somali", de: "Somali" }, selected: false },
      { id: "es", title: { en: "Spanish", de: "Spanisch" }, selected: false },
      { id: "sv", title: { en: "Swedish", de: "Schwedisch" }, selected: false },
      { id: "ur", title: { en: "Urdu", de: "Urdu" }, selected: false },
      { id: "vi", title: { en: "Vietnamese", de: "Vietnamesisch" }, selected: false },
      { id: "zzz", title: { en: "Other", de: "Andere" }, selected: false },
    ],
    skills: [
      { id: "Woodworking", title: { en: "Woodworking", de: "Holzverarbeitung" }, selected: false },
      { id: "Drawing", title: { en: "Drawing", de: "Zeichnen" }, selected: false },
      { id: "Painting", title: { en: "Painting", de: "Malen" }, selected: true },
      { id: "Sewing", title: { en: "Sewing", de: "Nähen" }, selected: true },
      { id: "Knitting", title: { en: "Knitting", de: "Stricken" }, selected: false },
      { id: "Repairs", title: { en: "Repairs", de: "Reparaturen" }, selected: false },
      { id: "Cooking", title: { en: "Cooking", de: "Kochen" }, selected: true },
      { id: "Teaching", title: { en: "Teaching", de: "Lehren" }, selected: false },
      { id: "Programming", title: { en: "Programming", de: "Programmieren" }, selected: false },
      { id: "Public speaking", title: { en: "Public speaking", de: "Öffentliches Sprechen" }, selected: false },
      { id: "Gardening", title: { en: "Gardening", de: "Gartenarbeit" }, selected: false },
      { id: "Landscaping", title: { en: "Landscaping", de: "Landschaftsgestaltung" }, selected: false },
      { id: "Carpentry", title: { en: "Carpentry", de: "Tischlerei" }, selected: false },
      { id: "Decorating", title: { en: "Decorating", de: "Dekorieren" }, selected: false },
      { id: "Bike", title: { en: "Bike repairs", de: "Fahrradreparaturen" }, selected: false },
      { id: "Photography", title: { en: "Photography", de: "Fotografie" }, selected: false },
      { id: "Videography", title: { en: "Videography", de: "Videografie" }, selected: false },
      { id: "Makeup", title: { en: "Makeup", de: "Make-up" }, selected: false },
      { id: "Copywriting", title: { en: "Copywriting", de: "Kreatives Schreiben" }, selected: false },
      { id: "Yoga", title: { en: "Yoga", de: "Yoga" }, selected: false },
      { id: "Fitness", title: { en: "Fitness", de: "Fitness" }, selected: false },
      { id: "Football", title: { en: "Football", de: "Fußball" }, selected: false },
      { id: "Basketball", title: { en: "Basketball", de: "Basketball" }, selected: false },
      { id: "Dance", title: { en: "Dance", de: "Tanzen" }, selected: false },
      { id: "Chess", title: { en: "Chess", de: "Schach" }, selected: false },
      { id: "Management", title: { en: "Management", de: "Management" }, selected: false },
      { id: "SMM", title: { en: "SMM", de: "Social-Media-Management (SMM)" }, selected: false },
      { id: "Mediation", title: { en: "Mediation", de: "Mediation" }, selected: false },
      { id: "Event", title: { en: "Event planning", de: "Veranstaltungsplanung" }, selected: false },
      { id: "Coaching", title: { en: "Coaching", de: "Coaching" }, selected: false },
      { id: "Guitar", title: { en: "Guitar", de: "Gitarre" }, selected: false },
      { id: "Piano", title: { en: "Piano", de: "Klavier" }, selected: false },
      { id: "Singing", title: { en: "Singing", de: "Singen" }, selected: false },
    ],
    aaAddress: "",
    aaPostcode: "",
    schedule: [
      {
        weekday: 1,
        timeSlots: [
          { id: "08-11", title: { en: "08-11", de: "08-11" }, selected: false },
          { id: "11-14", title: { en: "11-14", de: "11-14" }, selected: false },
          { id: "14-17", title: { en: "14-17", de: "14-17" }, selected: false },
          { id: "17-20", title: { en: "17-20", de: "17-20" }, selected: false },
        ],
      },
      {
        weekday: 2,
        timeSlots: [
          { id: "08-11", title: { en: "08-11", de: "08-11" }, selected: false },
          { id: "11-14", title: { en: "11-14", de: "11-14" }, selected: true },
          { id: "14-17", title: { en: "14-17", de: "14-17" }, selected: false },
          { id: "17-20", title: { en: "17-20", de: "17-20" }, selected: false },
        ],
      },
      {
        weekday: 3,
        timeSlots: [
          { id: "08-11", title: { en: "08-11", de: "08-11" }, selected: false },
          { id: "11-14", title: { en: "11-14", de: "11-14" }, selected: false },
          { id: "14-17", title: { en: "14-17", de: "14-17" }, selected: false },
          { id: "17-20", title: { en: "17-20", de: "17-20" }, selected: false },
        ],
      },
      {
        weekday: 4,
        timeSlots: [
          { id: "08-11", title: { en: "08-11", de: "08-11" }, selected: true },
          { id: "11-14", title: { en: "11-14", de: "11-14" }, selected: true },
          { id: "14-17", title: { en: "14-17", de: "14-17" }, selected: true },
          { id: "17-20", title: { en: "17-20", de: "17-20" }, selected: true },
        ],
      },
      {
        weekday: 5,
        timeSlots: [
          { id: "08-11", title: { en: "08-11", de: "08-11" }, selected: false },
          { id: "11-14", title: { en: "11-14", de: "11-14" }, selected: false },
          { id: "14-17", title: { en: "14-17", de: "14-17" }, selected: false },
          { id: "17-20", title: { en: "17-20", de: "17-20" }, selected: false },
        ],
      },
      {
        weekday: 6,
        timeSlots: [
          { id: "08-11", title: { en: "08-11", de: "08-11" }, selected: false },
          { id: "11-14", title: { en: "11-14", de: "11-14" }, selected: false },
          { id: "14-17", title: { en: "14-17", de: "14-17" }, selected: false },
          { id: "17-20", title: { en: "17-20", de: "17-20" }, selected: false },
        ],
      },
      {
        weekday: 7,
        timeSlots: [
          { id: "08-11", title: { en: "08-11", de: "08-11" }, selected: false },
          { id: "11-14", title: { en: "11-14", de: "11-14" }, selected: false },
          { id: "14-17", title: { en: "14-17", de: "14-17" }, selected: false },
          { id: "17-20", title: { en: "17-20", de: "17-20" }, selected: false },
        ],
      },
      {
        weekday: 0,
        timeSlots: [
          { id: "weekdays", title: { en: "weekdays", de: "wochentage" }, selected: false },
          { id: "weekends", title: { en: "weekends", de: "wocheenden" }, selected: true },
        ],
      },
    ],
    numberVolunteers: "4",
    voInformation: "Test regular opportunity",
    refugeeName: "",
    refugeeNumber: "",
    aaInformation: "",
    consent: true,
    language: "de",
  },
];
