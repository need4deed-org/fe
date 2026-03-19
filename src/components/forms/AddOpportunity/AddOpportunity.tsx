"use client";
import WithParentRef from "@/components/withParentRef";
import useList from "@/hooks/useLists";
import usePostRequest from "@/hooks/usePostRequest";
import { Subpage } from "@/types";
import { useForm, Controller, FormProvider, useWatch } from "react-hook-form";
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
  parseFormStateDTOOpportunity,
} from "../utils";
import { validateRACEmail } from "../validators";
import { OpportunityData, OpportunityParsedData } from "./dataStructure";
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

  const { postRequest } = usePostRequest<OpportunityParsedData, Record<string, string | string[]>>({
    url: apiPathOpportunity,
  });

  const formMethods = useForm<OpportunityData>({
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
    mode: "onBlur",
  });

  const { handleSubmit, control, getValues, formState } = formMethods;

  const opportunityType = useWatch({
    control,
    name: "opportunityType",
  });

  const translatedInto = useWatch({
    control,
    name: "translatedInto",
  });

  const onSubmit = handleSubmit(async (data) => {
    const dto = parseFormStateDTOOpportunity(data);
    const { success } = await postRequest(dto);
    if (success) {
      navigate.push(`/${Subpage.ANNOUNCEMENT}/?pointer=${thankYou}`);
    } else {
      setShowErrorAnnouncement(true);
    }
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
      <FormProvider {...formMethods}>
        <form
          className={style["form-form-container"]}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void onSubmit();
          }}
        >
          <div className="d-flex flex-column">
            <Controller
              name="title"
              control={control}
              rules={{
                validate: (value) => {
                  if (!value) return t("form.error.required");
                  if ((value as string).length > 128) return t("form.addOpportunity.fields.title.errorTooLong");
                  return true;
                },
              }}
              render={({ field, fieldState }) => (
                <SimpleInputField
                  field={field}
                  label={t("form.addOpportunity.fields.title.label")}
                  error={fieldState.error?.message as string | undefined}
                />
              )}
            />
            <i className="m-1">{t("form.addOpportunity.fields.title.example")}</i>
          </div>
          <fieldset className={style["form-field-group"]}>
            <b>{t("form.addOpportunity.fields.contactGroup.label")}</b>
            <span>
              <i>{t("form.addOpportunity.fields.contactGroup.info")}</i>
            </span>
            <Controller
              name="email"
              control={control}
              rules={{
                validate: async (value) => {
                  if (!value) return t("form.error.required");
                  if (!validateEmail(value as string)) return t("form.error.email");
                  const asyncRes = await validateRACEmail(value as string, t("form.error.badEmail"));
                  return asyncRes === undefined ? true : asyncRes;
                },
              }}
              render={({ field, fieldState }) => (
                <SimpleInputField
                  field={field}
                  label={t("form.addOpportunity.fields.contactGroup.email.label")}
                  error={fieldState.error?.message as string | undefined}
                />
              )}
            />
            <Controller
              name="fullName"
              control={control}
              rules={{
                validate: (value) => (!value ? t("form.error.required") : true),
              }}
              render={({ field, fieldState }) => (
                <SimpleInputField
                  field={field}
                  label={t("form.addOpportunity.fields.contactGroup.fullName.label")}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="racAddress"
              control={control}
              rules={{
                validate: (value) => (!value ? t("form.error.required") : true),
              }}
              render={({ field, fieldState }) => (
                <SimpleInputField
                  field={field}
                  label={t("form.addOpportunity.fields.contactGroup.address.label")}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="racPostcode"
              control={control}
              rules={{
                validate: (value) => {
                  if (!value) return t("form.error.required");
                  if (!isValidPLZ(value as string, TypePLZ.GERMANY)) return t("form.error.postcode");
                  return true;
                },
              }}
              render={({ field, fieldState }) => (
                <SimpleInputField
                  field={field}
                  label={t("form.addOpportunity.fields.contactGroup.postcode.label")}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="racPhone"
              control={control}
              rules={{
                validate: (value) => {
                  if (!value) return t("form.error.required");
                  if (!(value as string).match(phoneRegEx)) return t("form.error.number");
                  return true;
                },
              }}
              render={({ field, fieldState }) => (
                <SimpleInputField
                  field={field}
                  label={t("form.addOpportunity.fields.contactGroup.phone.label")}
                  error={fieldState.error?.message}
                />
              )}
            />
          </fieldset>
          <Controller
            name="opportunityType"
            control={control}
            rules={{
              validate: (value) => (value === undefined ? t("form.error.required") : true),
            }}
            render={({ field, fieldState }) => (
              <fieldset
                className={style["form-pick"]}
                onFocus={() => {
                  setTimeout(field.onBlur, 0);
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
                <FieldInfo error={fieldState.error?.message} />
              </fieldset>
            )}
          />
          {opportunityType === OpportunityType.ACCOMPANYING && (
            <fieldset className={style["form-field-group"]}>
              <b>{t("form.addOpportunity.fields.aaGroup.label")}</b>
              <Controller
                name="activitiesAccompanying"
                control={control}
                rules={{
                  validate: (value) => isSelected(value, t("form.error.required")),
                }}
                render={({ field, fieldState }) => (
                  <fieldset>
                    <HeaderWithHelp
                      className={style["form-chiplist-header-within-group"]}
                      classNamePopup={style["form-help"]}
                    >
                      {t("form.addOpportunity.fields.aaGroup.activities.header")}
                    </HeaderWithHelp>
                    <WithParentRef
                      className={`${style["form-chip-list"]} ${style["form-pick"]}`}
                      onFocus={() => setTimeout(field.onBlur, 0)}
                    >
                      <MultipleCheckBoxInputsWithMore<OpportunityData, "activitiesAccompanying"> field={field} />
                      <FieldInfo error={fieldState.error?.message} />
                    </WithParentRef>
                  </fieldset>
                )}
              />
              <Controller
                name="translatedInto"
                control={control}
                rules={{
                  validate: (value) => (value === undefined ? t("form.error.required") : true),
                }}
                render={({ field, fieldState }) => (
                  <fieldset
                    className={style["form-pick"]}
                    onFocus={() => {
                      setTimeout(field.onBlur, 0);
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
                    <FieldInfo error={fieldState.error?.message} />
                  </fieldset>
                )}
              />
              {translatedInto && translatedInto !== TranslatedIntoType.NO_TRANSLATION && (
                <Controller
                  name="languages"
                  control={control}
                  rules={{
                    validate: (value) => isSelected(value, t("form.error.language")),
                  }}
                  render={({ field, fieldState }) => (
                    <fieldset
                      onFocus={() => {
                        setTimeout(field.onBlur, 0);
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
                          field={field}
                          hiddenChips={
                            translatedInto === TranslatedIntoType.ENGLISH_OK
                              ? ["German", "Deutsch", "English", "Englisch"]
                              : ["German", "Deutsch"]
                          }
                        />
                        <FieldInfo error={fieldState.error?.message} />
                      </WithParentRef>
                    </fieldset>
                  )}
                />
              )}
              <Controller
                name="aaAddress"
                control={control}
                rules={{
                  validate: (value) => (!value ? t("form.error.required") : true),
                }}
                render={({ field, fieldState }) => (
                  <SimpleInputField
                    field={field}
                    label={t("form.addOpportunity.fields.aaGroup.address.label")}
                    error={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="aaPostcode"
                control={control}
                rules={{
                  validate: (value) => {
                    if (!value) return t("form.error.required");
                    if (!isValidPLZ(value as string, TypePLZ.GERMANY)) return t("form.error.postcode");
                    return true;
                  },
                }}
                render={({ field, fieldState }) => (
                  <SimpleInputField
                    field={field}
                    label={t("form.addOpportunity.fields.aaGroup.postcode.label")}
                    error={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="dateTime"
                control={control}
                rules={{
                  validate: (value) => {
                    if (!value) return t("form.error.required");
                    if (Number.isNaN(getDate(value as string).getTime())) return t("form.error.badTime");
                    const difference = getDate(value as string).valueOf() - Date.now();
                    if (difference < eightDays) return t("form.addOpportunity.fields.aaGroup.dateTime.tooClose");
                    return true;
                  },
                }}
                render={({ field, fieldState }) => (
                  <SimpleInputField
                    field={field}
                    label={t("form.addOpportunity.fields.aaGroup.dateTime.label")}
                    inputType="datetime-local"
                    error={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="refugeeName"
                control={control}
                rules={{
                  validate: (value) => (!value ? t("form.error.required") : true),
                }}
                render={({ field, fieldState }) => (
                  <SimpleInputField
                    field={field}
                    label={t("form.addOpportunity.fields.aaGroup.refugeeName.label")}
                    error={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="refugeeNumber"
                control={control}
                rules={{
                  validate: (value) => {
                    if (!value) return t("form.error.required");
                    if (!(value as string).match(phoneRegEx)) return t("form.error.number");
                    return true;
                  },
                }}
                render={({ field, fieldState }) => (
                  <SimpleInputField
                    field={field}
                    label={t("form.addOpportunity.fields.aaGroup.refugeeNumber.label")}
                    error={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="aaInformation"
                control={control}
                rules={{
                  validate: (value) => (!value ? t("form.error.required") : true),
                }}
                render={({ field, fieldState }) => (
                  <SimpleInputField
                    field={field}
                    label={t("form.addOpportunity.fields.aaGroup.information.label")}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </fieldset>
          )}
          {opportunityType === OpportunityType.REGULAR && (
            <fieldset className={style["form-field-group"]}>
              <b>{t("form.addOpportunity.fields.voGroup.label")}</b>
              <Controller
                name="locations"
                control={control}
                rules={{
                  validate: (value) => isSelected(value, t("form.error.location")),
                }}
                render={({ field, fieldState }) => (
                  <fieldset>
                    <HeaderWithHelp
                      className={style["form-chiplist-header-within-group"]}
                      classNamePopup={style["form-help"]}
                    >
                      {t("form.addOpportunity.fields.voGroup.locations.header")}
                    </HeaderWithHelp>
                    <WithParentRef
                      className={`${style["form-chip-list"]} ${style["form-pick"]}`}
                      onFocus={() => setTimeout(field.onBlur, 0)}
                    >
                      <MultipleCheckBoxInputsWithMore<OpportunityData, "locations"> field={field} />
                      <FieldInfo error={fieldState.error?.message} />
                    </WithParentRef>
                  </fieldset>
                )}
              />
              <Controller
                name="activities"
                control={control}
                rules={{
                  validate: (value) => isSelected(value, t("form.error.activity")),
                }}
                render={({ field, fieldState }) => (
                  <fieldset>
                    <HeaderWithHelp
                      className={style["form-chiplist-header-within-group"]}
                      classNamePopup={style["form-help"]}
                    >
                      {t("form.addOpportunity.fields.voGroup.activities.header")}
                    </HeaderWithHelp>
                    <WithParentRef
                      className={`${style["form-chip-list"]} ${style["form-pick"]}`}
                      onFocus={() => setTimeout(field.onBlur, 0)}
                    >
                      <MultipleCheckBoxInputsWithMore<OpportunityData, "activities"> field={field} />
                      <FieldInfo error={fieldState.error?.message} />
                    </WithParentRef>
                  </fieldset>
                )}
              />
              <Controller
                name="languages"
                control={control}
                rules={{
                  validate: (value) => isSelected(value, t("form.error.language")),
                }}
                render={({ field, fieldState }) => (
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
                      onFocus={() => setTimeout(field.onBlur, 0)}
                    >
                      <MultipleCheckBoxInputsWithMore<OpportunityData, "languages"> field={field} />
                      <FieldInfo error={fieldState.error?.message} />
                    </WithParentRef>
                  </fieldset>
                )}
              />
              <Controller
                name="skills"
                control={control}
                render={({ field, fieldState }) => (
                  <fieldset>
                    <HeaderWithHelp
                      textHelp={t("form.addOpportunity.fields.voGroup.skills.helpText")}
                      className={style["form-chiplist-header-within-group"]}
                      classNamePopup={style["form-help"]}
                    >
                      {t("form.addOpportunity.fields.voGroup.skills.header")}
                    </HeaderWithHelp>
                    <WithParentRef className={`${style["form-chip-list"]} ${style["form-pick"]}`}>
                      <MultipleCheckBoxInputsWithMore<OpportunityData, "skills"> field={field} />
                      <FieldInfo error={fieldState.error?.message} />
                    </WithParentRef>
                  </fieldset>
                )}
              />
              <Controller
                name="schedule"
                control={control}
                rules={{
                  validate: (value) => {
                    void formMethods.trigger("onetimeDateTime");
                    const isDateTime = !!getValues("onetimeDateTime");
                    const isScheduleEmpty = !isTimeSlotSelected(value);
                    if (!isScheduleEmpty && isDateTime)
                      return t("form.addOpportunity.fields.voGroup.schedule.errorBoth");
                    if (isScheduleEmpty && !isDateTime) return t("form.addOpportunity.fields.voGroup.schedule.error");
                    return true;
                  },
                }}
                render={({ field, fieldState }) => (
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
                        setTimeout(field.onBlur, 0);
                      }}
                    >
                      {field.value &&
                        (field.value as OpportunityData["schedule"]).map(({ weekday }, idx) => {
                          return (
                            <div className={style["form-table-row"]} key={`weekday${weekday}`}>
                              <span className={style["form-availability-weekday"]}>
                                {t(`form.schedule.${weekday}`).toLocaleUpperCase()}
                              </span>

                              {(field.value as OpportunityData["schedule"])[idx].timeSlots.map(
                                ({ title, id }, idxInner) => {
                                  return (
                                    <Controller
                                      key={`${weekday}${id}`}
                                      name={`schedule.${idx}.timeSlots.${idxInner}.selected`}
                                      control={control}
                                      render={({ field: fieldTimeslot }) => (
                                        <span className={style["form-pick"]}>
                                          <input
                                            tabIndex={0}
                                            id={`${weekday}${idxInner}${id}`}
                                            type="checkbox"
                                            checked={fieldTimeslot.value as boolean}
                                            onChange={(e) => {
                                              fieldTimeslot.onChange(e.target.checked);
                                            }}
                                          />
                                          <label htmlFor={`${weekday}${idxInner}${id}`}>
                                            <span>{getTimeslotTitle(t, title[i18n.language as Lang] as string)}</span>
                                          </label>
                                        </span>
                                      )}
                                    />
                                  );
                                },
                              )}
                            </div>
                          );
                        })}
                    </div>
                    <h6>
                      <i>{t("form.addOpportunity.fields.voGroup.schedule.or").toUpperCase()}</i>
                    </h6>
                    <Controller
                      name="onetimeDateTime"
                      control={control}
                      rules={{
                        validate: (value) => {
                          void formMethods.trigger("schedule");
                          if (!value && !isTimeSlotSelected(getValues("schedule"))) {
                            return t("form.addOpportunity.fields.voGroup.schedule.error");
                          }
                          if (value && Number.isNaN(getDate(value as string).getTime())) {
                            return t("form.error.badTime");
                          }
                          return true;
                        },
                      }}
                      render={({ field: fieldOnetime, fieldState: fieldStateOnetime }) => (
                        <SimpleInputField
                          field={fieldOnetime}
                          label={t("form.addOpportunity.fields.voGroup.schedule.oneTimeLabel")}
                          inputType="datetime-local"
                          error={fieldStateOnetime.error?.message}
                          onFocus={() => {
                            setTimeout(field.onBlur, 0);
                          }}
                        />
                      )}
                    />
                    <FieldInfo error={fieldState.error?.message} />
                  </fieldset>
                )}
              />
              <Controller
                name="numberVolunteers"
                control={control}
                rules={{
                  validate: (value) => {
                    if (!value) return t("form.error.required");
                    const numVolunteers = Number(value as string);
                    if (Number.isNaN(numVolunteers))
                      return t("form.addOpportunity.fields.voGroup.numberVolunteers.error");
                    return true;
                  },
                }}
                render={({ field, fieldState }) => (
                  <SimpleInputField
                    field={field}
                    label={t("form.addOpportunity.fields.voGroup.numberVolunteers.label")}
                    error={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="voInformation"
                control={control}
                rules={{
                  validate: (value) => (!value ? t("form.error.required") : true),
                }}
                render={({ field, fieldState }) => (
                  <SimpleInputField
                    field={field}
                    label={t("form.addOpportunity.fields.voGroup.information.label")}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </fieldset>
          )}
          <Controller
            name="consent"
            control={control}
            rules={{
              required: t("form.error.required"),
            }}
            render={({ field, fieldState }) => (
              <div>
                <div className={`${style["form-chip-list"]} ${style["form-pick"]}`}>
                  <input
                    id="consent"
                    type="checkbox"
                    checked={!!field.value}
                    onChange={(e) => {
                      field.onChange(e.target.checked);
                    }}
                  />
                  <label htmlFor="consent">{getTickMark(!!field.value)}</label>
                  <span>
                    {t("form.addOpportunity.fields.consent.header")} {t("form.addOpportunity.fields.consent.agree")}{" "}
                    <a href={`/${Subpage.GUIDELINES}/${lng}`}>{t("homepage.footer.legal.guidelines")}</a>{" "}
                    {t("form.addOpportunity.fields.consent.and")}{" "}
                    <a href={`/${Subpage.DATA_PROTECTION}/${lng}`}>{t("homepage.footer.legal.dataPrivacy")}</a>
                  </span>
                </div>
                <FieldInfo error={fieldState.error?.message} />
              </div>
            )}
          />
          <div className={style["form-submit"]}>
            <button className="n4d-cta" type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? (
                "..."
              ) : (
                <>
                  <UploadIcon />
                  {t("form.button.submit").toUpperCase()}
                </>
              )}
            </button>
            {Object.keys(formState.errors).length > 0 && (
              <em>
                {t("form.error.labelErrors")}:{" "}
                {Object.values(formState.errors)
                  .map((error) => error?.message)
                  .filter(Boolean)
                  .join(", ")}
              </em>
            )}
          </div>
        </form>
      </FormProvider>
      <p>{t("form.addOpportunity.bottomMsg")}</p>
    </div>
  );
}
