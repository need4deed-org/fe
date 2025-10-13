import React from "react";
import styled from "styled-components";

type DividerProps = {
  color?: string;
  margin?: string;
  orientation?: "horizontal" | "vertical";
  thickness?: string;
};

const StyledDivider = styled.div<DividerProps>`
  background-color: ${({ color }) => color || "#e0e0e0"};
  margin: ${({ margin }) => margin || "8px 0"};
  ${({ orientation, thickness }) =>
    orientation === "vertical"
      ? `
        width: ${thickness || "1px"};
        height: 100%;
        display: inline-block;
      `
      : `
        height: ${thickness || "1px"};
        width: 100%;
      `}
`;

const Divider: React.FC<DividerProps> = ({ color, margin, orientation = "horizontal", thickness }) => {
  return <StyledDivider color={color} margin={margin} orientation={orientation} thickness={thickness} />;
};

export default Divider;
