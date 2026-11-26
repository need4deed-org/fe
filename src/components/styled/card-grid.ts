import styled from "styled-components";

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: var(--spacing-20);
`;

export const Card = styled.article`
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: var(--spacing-16);
  padding: clamp(20px, 4vw, 28px);
  border: 1px solid var(--color-orchid-light, var(--color-orchid));
  border-radius: 20px;
  background: var(--color-white);
  box-shadow: 0 10px 28px rgb(40 25 47 / 8%);

  @media (max-width: 480px) {
    padding: 20px;
    border-radius: 16px;
  }
`;
