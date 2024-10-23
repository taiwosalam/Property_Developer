import { StaticImageData } from "next/image";

export interface PopupImageModalProps {
  isOpen: boolean;
  images: (string | StaticImageData)[];
  currentIndex: number;
  onClose: () => void;
}
