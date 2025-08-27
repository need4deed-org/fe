import styled from "styled-components";
import { ButtonSpan } from "../../../styled/text";
import { IconName, iconNameMap } from "./icon";
import { IconDiv } from "@/components/styled/container";

const defaultBGColor = "var(--color-aubergine)";

const hoverBGColorMap = {
  "var(--color-orchid)": "var(--color-orchid-light)",
  [defaultBGColor]: "var(--color-aubergine-light)",
  "var(--color-midnight)": "var(--color-midnight-light)",
  "var(--color-white)": "var(--color-orchid-light)",
  "var(--color-orchid-subtle)": "var(--color-aubergine-subtle)",
  "var(--color-orchid-light)": "var(--color-orchid)",
  "var(--color-grey-50)": "var(--color-aubergine)",
};

type BackgroundColorKeys = keyof typeof hoverBGColorMap;

interface StyledButtonProps extends React.HTMLProps<HTMLButtonElement> {
  backgroundcolor?: BackgroundColorKeys;
  gap?: string;
  padding?: string;
  $iconPosition?: "left" | "right";
  border?: string;
  $textHoverColor?: string;
}

const StyledButton = styled.button<StyledButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${(props) => props.height || "var(--button-height)"};
  width: ${(props) => props.width || "var(--button-width)"};
  border-radius: var(--button-border-radius);
  background-color: ${(props) => props.backgroundcolor || defaultBGColor};
  border: ${(props) => props.border || "none"};
  white-space: pre-wrap;
  gap: ${(props) => props.gap};
  padding: ${(props) => props.padding};
  flex-direction: ${(props) => (props.$iconPosition === "right" ? "row-reverse" : "row")};

  &:hover {
    background-color: ${(props) => hoverBGColorMap[props.backgroundcolor || defaultBGColor]};

    ${ButtonSpan} {
      color: ${(props) => props.$textHoverColor};
    }
  }
`;

interface Props {
  text?: string;
  textFontSize?: string;
  onClick: () => void;
  backgroundcolor?: BackgroundColorKeys;
  textColor?: string;
  textHoverColor?: string;
  height?: string;
  width?: string;
  iconName?: IconName;
  iconSize?: string;
  iconColor?: string;
  iconPosition?: "left" | "right";
  border?: string;
  disabled?: boolean;
}

export function Button({
  text,
  textFontSize,
  onClick,
  backgroundcolor,
  textColor,
  textHoverColor,
  height,
  width,
  iconName,
  iconSize,
  iconColor = "var(--color-white)",
  iconPosition = "left",
  border,
  disabled,
}: Props) {
  return (
    <StyledButton
      disabled={disabled}
      onClick={onClick}
      backgroundcolor={backgroundcolor}
      height={height}
      width={width}
      gap={text ? "var(--button-gap)" : "0px"}
      padding={text ? "var(--button-padding)" : "0px"}
      $iconPosition={iconPosition}
      border={border}
      $textHoverColor={textHoverColor}
    >
      {iconName && (
        <IconDiv color={iconColor} size={iconSize}>
          {iconNameMap[iconName]}
        </IconDiv>
      )}

      {text && (
        <ButtonSpan fontSize={textFontSize} color={textColor}>
          {text}
        </ButtonSpan>
      )}
    </StyledButton>
  );
}

export default Button;
