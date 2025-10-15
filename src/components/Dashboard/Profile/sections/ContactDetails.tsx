"use client";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import styled from "styled-components";
import { FormInput } from "@/components/core/common";
import { t } from "i18next";
import Divider from "../common/Divider";
import { ChatsCircle } from "@phosphor-icons/react";
import { ApiVolunteerGet } from "need4deed-sdk";
import { Dropdown } from "../common/Dropdown";
import { formatAddress } from "@/utils";

const contactMethodOptions = [
  { id: 1, label: "WhatsApp", value: "whatsapp" },
  { id: 2, label: "Telegram", value: "telegram" },
  { id: 3, label: "Mobile Phone", value: "mobile" },
  { id: 4, label: "Other", value: "other" },
];

interface Props {
  volunteer: ApiVolunteerGet;
}

export function ContactDetails({ volunteer }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const { person } = volunteer;
  const FormatedAddress = formatAddress(person.address);
  const initialData = {
    phone: person?.phone || "",
    email: person?.email || "",
    address: FormatedAddress || "",
    waysToContact: [],
  };
  const form = useForm({
    defaultValues: initialData,
    onSubmit: async (values) => {
      console.log(values);
      setIsEditing(false);
    },
  });

  return (
    <Container>
      <Header>
        <TitleContainer>
          <ChatsCircle size={40} style={{ color: "#E85D75" }} />
          <Title>Contact Details</Title>
        </TitleContainer>
        {!isEditing && <EditButton onClick={() => setIsEditing(!isEditing)}>Edit</EditButton>}
      </Header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <InfoRow>
          <InfoLabel>Phone Number</InfoLabel>
          {isEditing ? (
            <form.Field
              name="phone"
              validators={{
                onChange: ({ value }) => (!value ? "Phone is required" : undefined),
              }}
            >
              {(field) => (
                <InputContainer>
                  <FormInput
                    value={field.state.value}
                    onInputChange={field.handleChange}
                    placeHolder="Enter phone number"
                    errors={field.state.meta.errors}
                    height="2.5rem"
                  />
                </InputContainer>
              )}
            </form.Field>
          ) : (
            <InfoValue>{initialData.phone || "-"}</InfoValue>
          )}
        </InfoRow>
        <Divider />

        <InfoRow>
          <InfoLabel>Email</InfoLabel>
          {isEditing ? (
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return "Email is required";
                  if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email";
                  return undefined;
                },
              }}
            >
              {(field) => (
                <InputContainer>
                  <FormInput
                    value={field.state.value}
                    onInputChange={field.handleChange}
                    placeHolder="Enter email"
                    errors={field.state.meta.errors}
                    height="2.5rem"
                  />
                </InputContainer>
              )}
            </form.Field>
          ) : (
            <InfoValue>{initialData.email || "-"}</InfoValue>
          )}
        </InfoRow>
        <Divider />

        <InfoRow>
          <InfoLabel>Address</InfoLabel>
          {isEditing ? (
            <form.Field
              name="address"
              validators={{
                onChange: ({ value }) => (!value ? "Address is required" : undefined),
              }}
            >
              {(field) => (
                <InputContainer>
                  <FormInput
                    type="text"
                    value={field.state.value}
                    onInputChange={field.handleChange}
                    placeHolder="Enter address"
                    errors={field.state.meta.errors}
                    height="2.5rem"
                  />
                </InputContainer>
              )}
            </form.Field>
          ) : (
            <InfoValue>{FormatedAddress}</InfoValue>
          )}
        </InfoRow>
        <Divider />

        <InfoRow>
          <InfoLabel>Ways to Connect</InfoLabel>
          {isEditing ? (
            <form.Field
              name="waysToContact"
              validators={{
                onChange: ({ value }) =>
                  !value || value.length === 0 ? "Please select at least one contact method" : undefined,
              }}
            >
              {(field) => (
                <InputContainer>
                  <Dropdown
                    options={contactMethodOptions}
                    onSelect={(value) => field.handleChange(value)}
                    isMulti={true}
                    placeholder="Select contact methods"
                    width="100%"
                  />
                  {field.state.meta.errors && <ErrorMessage>{field.state.meta.errors[0]}</ErrorMessage>}
                </InputContainer>
              )}
            </form.Field>
          ) : (
            <InfoValue>{initialData.waysToContact.length > 0 ? initialData.waysToContact.join(", ") : "-"}</InfoValue>
          )}
        </InfoRow>
        <Divider />

        {isEditing && (
          <ButtonContiner>
            <SaveButton type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </SaveButton>
            <SaveButton type="submit">Save Changes</SaveButton>
          </ButtonContiner>
        )}
      </form>
    </Container>
  );
}

const Container = styled.div``;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
`;

const EditButton = styled.button`
  padding: 8px 16px;
  border-radius: 125px;
  background: var(--color-aubergine);
  color: white;
  border: none;
  cursor: pointer;
`;

const SaveButton = styled(EditButton)`
  margin-top: 24px;
`;

const ButtonContiner = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;

const DisplayMode = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 10rem;
  align-items: center;
`;

const InfoLabel = styled.span`
  font-weight: 500;
  min-width: 150px;
`;

const InfoValue = styled.span`
  color: var(--color-text-secondary);
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 12px;
  margin-top: 4px;
`;
