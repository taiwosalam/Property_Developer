import { StaticImageData } from "next/image";

export interface PopupImageModalProps {
  isOpen: boolean;
  images: { src: string | StaticImageData; isVideo?: boolean }[];
  currentIndex?: number;
  onClose: () => void;
  video?: string;
}
