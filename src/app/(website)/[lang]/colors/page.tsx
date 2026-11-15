import styled from "styled-components";

export default function TestColorsPage() {
  return (
    <Frame>
      <Column>
        <Circle $color="var(--midnight-100)" />
        <Circle $color="var(--midnight-75)" />
        <Circle $color="var(--midnight-50)" />
        <Circle $color="var(--midnight-25)" />
      </Column>
      <Column>
        <Circle $color="var(--orchid-100)" />
        <Circle $color="var(--orchid-75)" />
        <Circle $color="var(--orchid-50)" />
        <Circle $color="var(--orchid-25)" />
      </Column>
      <Column>
        <Circle $color="var(--blue-100)" />
        <Circle $color="var(--blue-75)" />
        <Circle $color="var(--blue-50)" />
        <Circle $color="var(--blue-25)" />
      </Column>
      <Column>
        <Circle $color="var(--lavender-100)" />
        <Circle $color="var(--lavender-75)" />
        <Circle $color="var(--lavender-50)" />
        <Circle $color="var(--lavender-25)" />
      </Column>
      <Column>
        <Circle $color="var(--coral-100)" />
        <Circle $color="var(--coral-75)" />
        <Circle $color="var(--coral-50)" />
        <Circle $color="var(--coral-25)" />
      </Column>
      <Column>
        <Circle $color="var(--mint-100)" />
        <Circle $color="var(--mint-75)" />
        <Circle $color="var(--mint-50)" />
        <Circle $color="var(--mint-25)" />
      </Column>
      <Column>
        <Circle $color="var(--raspberry-100)" />
        <Circle $color="var(--raspberry-75)" />
        <Circle $color="var(--raspberry-50)" />
        <Circle $color="var(--raspberry-25)" />
      </Column>
      <Column>
        <Circle $color="var(--sand-100)" />
        <Circle $color="var(--sand-75)" />
        <Circle $color="var(--sand-50)" />
        <Circle $color="var(--sand-25)" />
      </Column>
      <Column>
        <Circle $color="var(--grey-100)" />
        <Circle $color="var(--grey-75)" />
        <Circle $color="var(--grey-50)" />
        <Circle $color="var(--grey-25)" />
      </Column>
      <Column>
        <CircleContrast $color="var(--white)" />
      </Column>
    </Frame>
  );
}

const Frame = styled.div`
  display: -webkit-flex;
  display: flex;
  gap: 16px;
  padding: 32px;
`;

const Column = styled.div``;

const Circle = styled.div<{ $color: string }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: -25px;
  background-color: ${({ $color }) => $color};
`;

const CircleContrast = styled(Circle)`
  box-shadow: 0 0 312px #bbbbbb;
`;
