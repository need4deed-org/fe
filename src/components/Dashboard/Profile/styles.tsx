import Link from "next/link";
import styled from "styled-components";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: var(--volunteer-profile-container-width);
  gap: var(--volunteer-profile-container-gap);
`;

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--volunteer-profile-back-link-gap);
  font-size: var(--volunteer-profile-back-link-font-size);
  color: var(--color-midnight);
  text-decoration: none;
  transition: var(--volunteer-profile-back-link-transition);
`;
