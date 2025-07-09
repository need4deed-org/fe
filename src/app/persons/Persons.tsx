"use client";
import { useEffect, useState } from "react";

import styles from "./page.module.css";
import Person, { PersonType } from "./Person";

export default function Persons() {
  const [persons, setPersons] = useState<PersonType[]>([]);

  useEffect(() => {
    fetch("/api/person", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          console.error(`HTTP error! status: ${res.status}`);
          return [];
        }
      })
      .then(({ data }) => {
        setPersons(data);
      })
      .catch((err) => {
        console.error("Error fetching persons:", err);
      });
  }, []);

  return (
    <div className={styles["list-container"]}>
      <h1>Persons</h1>
      <ul>
        {persons.length
          ? persons.map((person) => <Person key={person.id} person={person} />)
          : null}
      </ul>
    </div>
  );
}
