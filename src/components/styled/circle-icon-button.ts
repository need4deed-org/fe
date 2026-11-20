import Link from "next/link";
import styled from "styled-components";
import { circleIconButtonStyles } from "./mixins";

export const CircleIconButton = styled.button`
  ${circleIconButtonStyles}
`;

export const CircleIconLink = styled(Link)`
  ${circleIconButtonStyles}
`;
