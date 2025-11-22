import styled from "styled-components";

import { BackgroundImg } from "@/components/styled/img";

interface ImageContainerProps {
  height?: string;
}

const ImageContainer = styled.div<ImageContainerProps>`
  position: relative;
  width: 100%;
  height: ${(props) => props.height || "100%"};
`;

interface Props {
  imageUrl: string;
  gradientClass: string;
  height?: string;
}
export function ImageWithGradient({ imageUrl, gradientClass, height }: Props) {
  return (
    <ImageContainer height={height}>
      <BackgroundImg src={imageUrl} />
      <div className={`gradient-overlay ${gradientClass}`} />
    </ImageContainer>
  );
}

export default ImageWithGradient;
