import styled from "styled-components";
import { ATag } from "../../../../styled/tags";
import { Paragraph } from "../../../../styled/text";

export type Link = {
  route: string;
  label: string;
};

interface FooterLinkProps {
  links: Link[];
}

const FrameContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--homepage-footer-partners-section-footer-frame-container-gap);
`;

export default function FooterLinks({ links }: FooterLinkProps) {
  return (
    <FrameContainer>
      {links.map(({ route, label }) => {
        return (
          <ATag key={route} href={route}>
            <Paragraph
              color="var(--color-magnolia)"
              fontWeight="var(--homepage-footer-partners-section-p-fontWeight-large)"
              fontSize="var(--homepage-footer-partners-section-p-fontSize)"
              lineheight="var(--homepage-footer-partners-section-p-fontSize)"
            >
              {label}
            </Paragraph>
          </ATag>
        );
      })}
    </FrameContainer>
  );
}
