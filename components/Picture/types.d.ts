import { CSSProperties } from "react";

export interface PictureProps {
  src: string | StaticImageData;
  alt?: string;

  size?: number;
  width?: number;
  height?: number;
  showStatus?: boolean;
  status?: boolean;
  rounded?: boolean;
  className?: string;
  style?: CSSProperties;
  fit?: CSSProperties["objectFit"];
  resolutionMultiplier?: number;
  containerClassName?: string;
  onClick?: () => void;
}
