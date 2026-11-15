import styled from "styled-components";
import { LanguageSelector } from "./LanguageSelector";
import { AuthButton } from "./AuthButton";

type SecondaryNavigationProps = {
  breakpoint: number;
};

export const SecondaryNavigation = ({ breakpoint }: SecondaryNavigationProps) => {
  return (
    <Background>
      <LanguageSelector breakpoint={breakpoint} />
      <AuthButton />
    </Background>
  );
};

const Background = styled.div`
  display: -webkit-flex;
  display: flex;
  gap: var(--small-spacing);
`;
