"use client";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { validate as validateEmail } from "email-validator";
import { Lang, VolunteerFormData } from "need4deed-sdk";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { apiPathVolunteer } from "../../../config/constants";
import { getImageUrl } from "../../../utils/index";
import UploadIcon from "../../svg/Upload";

import WithParentRef from "@/components/withParentRef";
import useList from "@/hooks/useLists";
import usePostRequest from "@/hooks/usePostRequest";
import { LanguageLevel, Subpage } from "@/types";
import ErrorAnnouncement from "../AddOpportunity/ErrorAnnouncement";
import { AvailabilityGrid } from "../AvailabilityGrid";
import FieldInfo from "../FieldInfo";
import HeaderWithHelp from "../HeaderWithHelp";
import style from "../index.module.css";
import MultipleCheckBoxInputsWithMore from "../MultipleCheckBoxInputsWithMore";
import MultipleRadioInputsWithMore from "../MultipleRadioInputsWithMore";
import SimpleInputField from "../SimpleInputField";
import { ListsOfOptions, OpportunityInfo, Selected } from "../types";
import {
  getAllSelectedFalse,
  getScheduleState,
  getTickMark,
  isTimeSlotSelected,
  isValidPLZ,
  parseFormStateDTOVolunteer,
} from "../utils";
import { VolunteerData } from "./dataStructure";
import { LanguageFields } from "../LanguageFields";

const thankYou = "form.becomeVolunteer.thankYou";
const somethingWrong = "form.becomeVolunteer.somethingWrong";

export default function BecomeVolunteer() {
  const [showErrorAnnouncement, setShowErrorAnnouncement] = useState(false);
  const navigate = useRouter();
  const { lng } = useParams();
  const { t, i18n } = useTranslation();
  const opportunityParams = useSearchParams();
  const language = i18n.language as Lang;

  const { postRequest } = usePostRequest<VolunteerFormData, Record<string, string | string[]>>({
    url: apiPathVolunteer,
  });

  const opportunity: OpportunityInfo = {
    id: opportunityParams.get("id") || "",
    title: opportunityParams.get("title") || "",
  };

  const formMethods = useForm<VolunteerData>({
    defaultValues: {
      opportunityId: opportunity.id,
      name: "",
      email: "",
      phone: "",
      postcode: "",
      locations: getAllSelectedFalse(useList(ListsOfOptions.LOCATIONS)),
      availability: getScheduleState(),
      languages: [{ id: 1, language: "", level: LanguageLevel.NATIVE }],
      activities: getAllSelectedFalse([
        ...useList(ListsOfOptions.ACTIVITIES),
        ...useList(ListsOfOptions.ACTIVITIES_ACCOMPANYING),
      ]),
      skills: getAllSelectedFalse(useList(ListsOfOptions.SKILLS)),
      certOfGoodConduct: undefined,
      certMeaslesVaccination: undefined,
      leadFrom: getAllSelectedFalse(useList(ListsOfOptions.LEADS)),
      comments: "",
      consent: undefined,
      language,
    } as VolunteerData,
    mode: "onBlur",
  });

  const { handleSubmit, control, formState } = formMethods;

  const onSubmit = handleSubmit(async (value) => {
    const data = parseFormStateDTOVolunteer(value);

    const { success } = await postRequest(data);
    if (success) {
      navigate.push(`/${Subpage.ANNOUNCEMENT}/?pointer=${thankYou}`);
    } else {
      setShowErrorAnnouncement(true);
    }
  });

  if (showErrorAnnouncement) {
    return <ErrorAnnouncement copies={somethingWrong} />;
  }

  return (
    <div className={`n4d-container ${style["form-container"]}`}>
      <div className={style["form-container-header"]}>
        <h1>
          {t("form.becomeVolunteer.header").toLocaleUpperCase()}
          <Image src={getImageUrl("N4D-logo-purple-on-transparent-h.webp")} alt="" width={180} height={100} />
        </h1>
        {opportunity.title ? (
          <h6>
            {t("form.becomeVolunteer.thanks")}: <i>{opportunity.title}</i>
          </h6>
        ) : null}
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
          <Controller
            name="name"
            control={control}
            rules={{
              required: t("form.error.required"),
            }}
            render={({ field, fieldState }) => (
              <SimpleInputField
                field={field}
                label={t("form.becomeVolunteer.fields.name.label")}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            rules={{
              required: t("form.error.required"),
              validate: (value) => (validateEmail(value as string) ? true : t("form.error.email")),
            }}
            render={({ field, fieldState }) => (
              <SimpleInputField
                field={field}
                label={t("form.becomeVolunteer.fields.email.label")}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="phone"
            control={control}
            rules={{
              required: t("form.error.required"),
            }}
            render={({ field, fieldState }) => (
              <SimpleInputField
                field={field}
                label={t("form.becomeVolunteer.fields.phone.label")}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="postcode"
            control={control}
            rules={{
              required: t("form.error.required"),
              validate: (value) => (isValidPLZ(value as string) ? true : t("form.error.postcode")),
            }}
            render={({ field, fieldState }) => (
              <SimpleInputField
                field={field}
                label={t("form.becomeVolunteer.fields.postcode.label")}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="locations"
            control={control}
            rules={{
              validate: (value) => {
                const isAnySelected = !!(value as Selected[]).filter(({ selected }) => selected).length;
                return isAnySelected ? true : t("form.error.location");
              },
            }}
            render={({ field, fieldState }) => (
              <fieldset>
                <HeaderWithHelp
                  textHelp={t("form.becomeVolunteer.fields.locations.helpText")}
                  titleHelp={t("form.becomeVolunteer.fields.locations.helpTitle")}
                  classNamePopup="form-help"
                >
                  {t("form.becomeVolunteer.fields.locations.header")}
                </HeaderWithHelp>
                <h6>{t("form.becomeVolunteer.fields.locations.para")}</h6>
                <WithParentRef
                  onFocus={() => setTimeout(field.onBlur, 0)}
                  className={`${style["form-chip-list"]} ${style["form-pick"]}`}
                >
                  <MultipleCheckBoxInputsWithMore<VolunteerData, "locations"> field={field} />
                  <FieldInfo error={fieldState.error?.message} />
                </WithParentRef>
              </fieldset>
            )}
          />
          <hr />
          <Controller
            name="languages"
            control={control}
            rules={{
              validate: (value) => {
                const hasEmptyLanguage = (value as VolunteerData["languages"]).some((lang) => !lang.language);
                if (hasEmptyLanguage) return t("form.error.language");

                const languageIds = (value as VolunteerData["languages"]).map((lang) => lang.language);
                const uniqueLanguages = new Set(languageIds);
                if (languageIds.length !== uniqueLanguages.size) {
                  return t("form.becomeVolunteer.fields.languages.singleLevelError");
                }
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <fieldset>
                <div className={style["form-table-wrapper"]}>
                  <h3>{t("form.becomeVolunteer.fields.languages.headerWithoutAsterick")}</h3>
                  <LanguageFields
                    languages={field.value}
                    onChange={field.onChange}
                    onFocus={() => setTimeout(field.onBlur, 0)}
                    t={t}
                  />
                </div>
                <FieldInfo error={fieldState.error?.message} />
              </fieldset>
            )}
          />
          <Controller
            name="availability"
            control={control}
            rules={{
              validate: (value) => (isTimeSlotSelected(value) ? true : t("form.error.availability")),
            }}
            render={({ field, fieldState }) => (
              <fieldset>
                <AvailabilityGrid
                  availability={field.value}
                  onChange={field.onChange}
                  onFocus={() => setTimeout(field.onBlur, 0)}
                  header={t("form.becomeVolunteer.fields.availability.header")}
                  t={t}
                  currentLanguage={i18n.language as Lang}
                />
                <FieldInfo error={fieldState.error?.message} />
              </fieldset>
            )}
          />
          <hr />
          <Controller
            name="activities"
            control={control}
            rules={{
              validate: (value) => {
                const isAnySelected = !!(value as Selected[]).filter(({ selected }) => selected).length;
                return isAnySelected ? true : t("form.becomeVolunteer.fields.activities.error");
              },
            }}
            render={({ field, fieldState }) => (
              <fieldset>
                <HeaderWithHelp
                  textHelp={t("form.becomeVolunteer.fields.activities.helpText")}
                  titleHelp={t("form.becomeVolunteer.fields.activities.helpTitle")}
                  classNamePopup="form-help"
                >
                  {t("form.becomeVolunteer.fields.activities.header")}
                </HeaderWithHelp>
                <WithParentRef
                  onFocus={() => {
                    setTimeout(field.onBlur, 0);
                  }}
                  className={`${style["form-chip-list"]} ${style["form-pick"]}`}
                >
                  <MultipleCheckBoxInputsWithMore<VolunteerData, "activities"> field={field} />
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
                  textHelp={t("form.becomeVolunteer.fields.skills.helpText")}
                  titleHelp={t("form.becomeVolunteer.fields.skills.helpTitle")}
                  classNamePopup="form-help"
                >
                  {t("form.becomeVolunteer.fields.skills.header")}
                </HeaderWithHelp>
                <WithParentRef className={`${style["form-chip-list"]} ${style["form-pick"]}`}>
                  <MultipleCheckBoxInputsWithMore<VolunteerData, "skills"> field={field} />
                  <FieldInfo error={fieldState.error?.message} />
                </WithParentRef>
              </fieldset>
            )}
          />
          <Controller
            name="certOfGoodConduct"
            control={control}
            rules={{
              required: t("form.error.required"),
            }}
            render={({ field, fieldState }) => (
              <fieldset>
                <div
                  className={style["form-pick"]}
                  onFocus={() => {
                    setTimeout(field.onBlur, 0);
                  }}
                >
                  <HeaderWithHelp
                    textHelp={t("form.becomeVolunteer.fields.certOfGoodConduct.helpText")}
                    titleHelp={t("form.becomeVolunteer.fields.certOfGoodConduct.helpTitle")}
                    classNamePopup="form-help"
                  >
                    {t("form.becomeVolunteer.fields.certOfGoodConduct.header")}
                  </HeaderWithHelp>
                  <div className={style["form-chip-list"]}>
                    <MultipleRadioInputsWithMore
                      items={[true, false]}
                      copyPath="form.becomeVolunteer.fields.certOfGoodConduct."
                      field={field}
                    />
                  </div>
                  <FieldInfo error={fieldState.error?.message} />
                </div>
                <h6>
                  <a href="https://www.berlin.de/laf/engagement/fuehrungszeugnis/" target="_blanc">
                    {t("form.becomeVolunteer.fields.certOfGoodConduct.why")}
                  </a>
                </h6>
              </fieldset>
            )}
          />
          <Controller
            name="certMeaslesVaccination"
            control={control}
            rules={{
              required: t("form.error.required"),
            }}
            render={({ field, fieldState }) => (
              <fieldset
                className={style["form-pick"]}
                onFocus={() => {
                  setTimeout(field.onBlur, 0);
                }}
              >
                <HeaderWithHelp
                  textHelp={t("form.becomeVolunteer.fields.certMeaslesVaccination.helpText")}
                  titleHelp={t("form.becomeVolunteer.fields.certMeaslesVaccination.helpTitle")}
                  classNamePopup="form-help"
                >
                  {t("form.becomeVolunteer.fields.certMeaslesVaccination.header")}
                </HeaderWithHelp>
                <div className={style["form-chip-list"]}>
                  <MultipleRadioInputsWithMore
                    items={[true, false]}
                    copyPath="form.becomeVolunteer.fields.certMeaslesVaccination."
                    field={field}
                  />
                </div>
                <FieldInfo error={fieldState.error?.message} />
              </fieldset>
            )}
          />
          <Controller
            name="leadFrom"
            control={control}
            render={({ field, fieldState }) => (
              <fieldset>
                <HeaderWithHelp
                  textHelp={t("form.becomeVolunteer.fields.leadFrom.helpText")}
                  titleHelp={t("form.becomeVolunteer.fields.leadFrom.helpTitle")}
                  classNamePopup="form-help"
                >
                  {t("form.becomeVolunteer.fields.leadFrom.header")}
                </HeaderWithHelp>
                <WithParentRef className={`${style["form-chip-list"]} ${style["form-pick"]}`}>
                  <MultipleCheckBoxInputsWithMore<VolunteerData, "leadFrom"> field={field} />
                  <FieldInfo error={fieldState.error?.message} />
                </WithParentRef>
              </fieldset>
            )}
          />
          <Controller
            name="comments"
            control={control}
            render={({ field }) => (
              <SimpleInputField field={field} label={t("form.becomeVolunteer.fields.comments.label")} />
            )}
          />
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
                    {t("form.becomeVolunteer.fields.consent.header")}{" "}
                    <a href={`/${Subpage.DATA_PROTECTION}/${lng}`}>{t("homepage.footer.legal.dataPrivacy")}</a>{" "}
                    {t("form.becomeVolunteer.fields.consent.and")}{" "}
                    <a href={`/${Subpage.AGREEMENT}/${lng}`}>{t("homepage.footer.legal.agreement")}</a>
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
    </div>
  );
}
