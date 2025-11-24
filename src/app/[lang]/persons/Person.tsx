"use client";
export type PersonType = Record<string, string>;

interface Props {
  person: PersonType;
}

export default function Person({ person }: Props) {
  return (
    <li>
      <span>{person.firstName}</span>
      <span>{person.middleName ? ` ${person.middleName} ` : null}</span>
      <span>{person.lastName}</span>
      {" | "}
      <span>{person.email}</span>
      {" | "}
      <span>{person.address}</span>
      {" | "}
      <span>{person.phone}</span> <span>{person.role}</span>
    </li>
  );
}
