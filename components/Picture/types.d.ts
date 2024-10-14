import { CSSProperties } from "react";

export interface PictureProps {
  src: string | StaticImageData;
  alt?: string;

  size?: number;
  width?: number;
  height?: number;

  status?: boolean;
  rounded?: boolean;
  className?: string;
  style?: CSSProperties;
  fit?: "cover" | "contain";
  resolutionMultiplier?: number;
  containerClassName?: string;
}
