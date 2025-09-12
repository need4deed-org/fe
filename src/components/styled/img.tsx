import styled from "styled-components";

interface CircleImageProps {
  src: string;
  size?: string;
}

export const CirclePic = styled.img<CircleImageProps>`
  width: ${(props) => props.size || "var(--image-circle-pic-size)"};
  height: ${(props) => props.size || "var(--image-circle-pic-size)"};
  border-radius: 50%;
  src: ${(props) => props.src};
`;

interface BackgroundImgProps {
  src: string;
  height?: string;
}

export const BackgroundImg = styled.div<BackgroundImgProps>`
  width: 100%;
  height: ${(props) => props.height || "100%"};
  background: ${(props) => `url(${props.src}) no-repeat center center`};
  background-size: cover;
`;
