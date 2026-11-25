"use client";
import styled from "styled-components";
import { ClubDialogLogo } from "./ClubDialogLogo";
import { EULogo } from "./EULogo";
import { BerlinLogo } from "./BerlinLogo";
import { SchonebergHilftLogo } from "./SchonebergHilftLogo";

export const Logos = () => {
  return (
    <Background>
      <Frame>
        <Cell>
          <ClubDialogLogo />
        </Cell>
        <Cell>
          <EULogo />
        </Cell>
        <Cell>
          <BerlinLogo />
        </Cell>
        <Cell>
          <SchonebergHilftLogo />
        </Cell>
      </Frame>
    </Background>
  );
};

const Background = styled.div`
  padding-left: var(--large-spacing);
  padding-top: var(--very-large-spacing);
  padding-right: var(--large-spacing);
  padding-bottom: var(--very-large-spacing);
`;

const Frame = styled.div`
  display: -webkit-flex;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--large-spacing);
  width: 100%;
  max-width: 700px;
  margin: auto;
`;

const Cell = styled.div`
  display: -webkit-flex;
  display: flex;
  flex-grow: 1;
  justify-content: center;
`;
