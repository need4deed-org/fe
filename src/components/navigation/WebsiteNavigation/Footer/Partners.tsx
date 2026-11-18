import styled, { css } from "styled-components";
import { LogoBerlin, LogoClubDialog, LogoEU, LogoSchönebergHilft } from "./logos";

const PartnersContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: var(--homepage-footer-partners-section-partners-container-justify-content);
  align-content: center;
  height: var(--homepage-footer-partners-section-partners-container-height);
  width: 100%;
  gap: var(--homepage-footer-partners-section-partners-container-gap)
    var(--homepage-footer-partners-section-partners-frame-container-gap);

  @media (max-width: 359px) {
    column-gap: var(--spacing-16);
  }

  @media (min-width: 768px) {
    flex-flow: column nowrap;
    gap: var(--homepage-footer-partners-section-partners-container-gap);
  }

  @media (min-width: 1440px) {
    flex-direction: row;
  }
`;

const FrameContainer = styled.div<{ $gap: string }>`
  display: contents;

  @media (min-width: 768px) and (max-width: 1439px) {
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: var(--homepage-footer-partners-section-partners-frame-container-height);
    gap: ${(props) => props.$gap};
  }
`;

interface LogoSlotProps {
  $fullRowOnMobile?: boolean;
  $desktopOrder: number;
}

const LogoSlot = styled.div<LogoSlotProps>`
  display: flex;
  justify-content: center;

  ${(props) =>
    props.$fullRowOnMobile &&
    css`
      @media (max-width: 767px) {
        flex-basis: 100%;
      }
    `}

  @media (min-width: 1440px) {
    order: ${(props) => props.$desktopOrder};
  }
`;

export function Partners() {
  return (
    <PartnersContainer>
      <FrameContainer $gap="var(--homepage-footer-partners-section-partners-frame-container-gap-1)">
        <LogoSlot $fullRowOnMobile $desktopOrder={0}>
          <LogoClubDialog />
        </LogoSlot>
        <LogoSlot $desktopOrder={2}>
          <LogoEU />
        </LogoSlot>
      </FrameContainer>
      <FrameContainer $gap="var(--homepage-footer-partners-section-partners-frame-container-gap-2)">
        <LogoSlot $desktopOrder={1}>
          <LogoBerlin />
        </LogoSlot>
        <LogoSlot $fullRowOnMobile $desktopOrder={3}>
          <LogoSchönebergHilft />
        </LogoSlot>
      </FrameContainer>
    </PartnersContainer>
  );
}

export default Partners;
