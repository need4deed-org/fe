"use client";
import { useEffect, useState } from "react";

import useToken from "@/hooks/auth/useToken";
import styles from "./page.module.css";
import Person, { PersonType } from "./Person";

export default function Persons() {
  const [persons, setPersons] = useState<PersonType[]>([]);
  const { token } = useToken();

  useEffect(() => {
    if (token) {
      console.log("DEBUG:Persons:token", token);
      fetch("http://vmpub:5000/person", {
        headers: {
          Authorization: `Bearer ${token}`,
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
          console.log("DEBUG:Persons:data", data);
          setPersons(data);
        })
        .catch((err) => {
          console.error("Error fetching persons:", err);
        });
    }
  }, [token]);

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
