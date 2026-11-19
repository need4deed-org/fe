"use client";
import { useEffect, useState } from "react";

import { useRouteLang } from "@/hooks/use-route-lang";
import { localizedPath } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Person, { PersonType } from "./Person";

export default function Persons() {
  const [persons, setPersons] = useState<PersonType[]>([]);
  const router = useRouter();
  const lang = useRouteLang();

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
          if (res.status === 401) {
            router.push(localizedPath(lang, "/login"));
          }
          return [];
        }
      })
      .then(({ data }) => {
        setPersons(data);
      })
      .catch((err) => {
        console.error("Error fetching persons:", err);
      });
  }, [lang, router]);

  return (
    <div className={styles["list-container"]}>
      <h1>Persons</h1>
      <ul>{persons && persons.length ? persons.map((person) => <Person key={person.id} person={person} />) : null}</ul>
    </div>
  );
}
