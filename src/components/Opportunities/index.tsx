import { OpportunityType } from "@/types";
import styles from "./index.module.css";

interface Props {
  opportunity: OpportunityType;
}

export default function Opportunity({ opportunity }: Props) {
  return (
    <div className={styles["opportunity-container"]}>
      <h3>{opportunity.title}</h3>
      {Object.keys(opportunity).filter((key) => key !== "title").map((key) => (
        <div key={key} className={styles["opportunity-item"]}>
          <strong>{key}:</strong>
          <pre>
            {JSON.stringify(
              opportunity[key as keyof OpportunityType],
              null,
              4,
            )}
          </pre>
        </div>
      ))}
    </div>
  );
}
