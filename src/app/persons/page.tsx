import Opportunity from "@/components/Person";
import { OpportunityType } from "@/types";
import styles from "./page.module.css";

export default async function Persons() {
  const opportunities: OpportunityType[] = await getOpportunities();

  return (
    <div className={styles["list-container"]}>
      <h1>Persons</h1>
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
