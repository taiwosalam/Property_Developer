import { StaticImageData } from "next/image";

export interface UseImageUploaderProps {
  placeholder?: string | StaticImageData | null;
  maxSize?: {
    unit: "KB" | "MB";
    value: number;
  };
}
