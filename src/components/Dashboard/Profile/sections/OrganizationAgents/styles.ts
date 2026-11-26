import { Card } from "@/components/Dashboard/Agents/styles";
import styled from "styled-components";

export const AgentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
  gap: var(--spacing-16);
  width: 100%;
`;

export const AgentItemCard = styled(Card)`
  width: 100%;
  padding: var(--spacing-20);
`;
