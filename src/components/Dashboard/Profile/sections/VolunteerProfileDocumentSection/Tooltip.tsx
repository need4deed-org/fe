import { ReactNode, useState, useRef, useEffect } from "react";
import styled from "styled-components";

type Props = {
  text: string;
  children: ReactNode;
};

const TooltipContainer = styled.div`
  position: relative;
  display: inline-flex;
`;

const TooltipText = styled.div<{ $visible: boolean }>`
  visibility: ${(props) => (props.$visible ? "visible" : "hidden")};
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  background: #0b1560;
  color: #ffffff;
  font-family: "Figtree", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.005em;
  padding: 8px;
  border-radius: 8px;
  position: fixed;
  white-space: nowrap;
  transition: opacity 0.2s, visibility 0.2s;
  z-index: 10000;
  pointer-events: none;
  transform: translate(-50%, -100%) translateY(-8px);

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -4px;
    border-width: 4px;
    border-style: solid;
    border-color: #0b1560 transparent transparent transparent;
  }
`;

export function Tooltip({ text, children }: Props) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        left: rect.left + rect.width / 2,
        top: rect.top,
      });
    }
  }, [visible]);

  return (
    <TooltipContainer
      ref={containerRef}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <TooltipText $visible={visible} style={{ left: `${position.left}px`, top: `${position.top}px` }}>
        {text}
      </TooltipText>
    </TooltipContainer>
  );
}
