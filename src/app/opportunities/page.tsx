import Opportunity from "@/components/Opportunities";
import { OpportunityType } from "@/types";
import styles from "./page.module.css";

async function getOpportunities() {
  const res = await fetch(
    "https://api.need4deed.org/api/opportunity/?language=de",
    {
      next: { revalidate: 60 },
      cache: "force-cache",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export default async function Opportunities() {
  const opportunities: OpportunityType[] = await getOpportunities();

  return (
    <div className={styles["list-container"]}>
      <h1>Opportunities</h1>
      <ul>
        {opportunities.map((opportunity) => (
          <li key={opportunity.id}>
            <Opportunity opportunity={opportunity} />
          </li>
        ))}
      </ul>
    </div>
  );
}
