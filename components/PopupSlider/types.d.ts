export interface PopupImageModalProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
}
