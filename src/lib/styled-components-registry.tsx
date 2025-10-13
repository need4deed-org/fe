"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

// List of custom props that should not be forwarded to the DOM
const customProps = [
  // Text props
  "color",
  "fontWeight",
  "fontSize",
  "lineheight",
  "letterSpacing",
  "margin",
  // Container props
  "background-color",
  "gap",
  "size",
  // Button props
  "backgroundcolor",
  "padding",
  "border",
  "$iconPosition",
  "$textHoverColor",
  // Other custom props
  "background",
  "padding",
  "border",
  "lineheight",
  "backgroundcolor",
  "background-color",
];

// Function to determine if a prop should be forwarded to the DOM
const shouldForwardProp = (prop: string) => {
  return !customProps.includes(prop);
};

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== "undefined") {
    return <StyleSheetManager shouldForwardProp={shouldForwardProp}>{children}</StyleSheetManager>;
  }

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance} shouldForwardProp={shouldForwardProp}>
      {children}
    </StyleSheetManager>
  );
}
