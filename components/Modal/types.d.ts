// Imports
import { modal_presets } from "./data";

// Context interface for managing modal state
export interface ModalContextProps {
  // Indicates whether the modal is open or closed
  isOpen: boolean;
  // Function to update the 'isOpen' state
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Props for the Modal component
export interface ModalProps {
  // Optional state object to control the modal's open state and updater function
  state?: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };
  // React nodes to be rendered within the Modal
  children: React.ReactNode;
}

// Props for the ModalTrigger component
export interface ModalTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Optional boolean to determine if the trigger should close the modal when clicked
  close?: boolean;
  // Optional boolean to indicate if the trigger should render as a child element
  asChild?: boolean;
  // React nodes to be rendered within the ModalTrigger
  children: React.ReactNode;
}

// Props for the ModalContent component
export interface ModalContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  // React nodes to be rendered inside the ModalContent
  children: React.ReactNode;
}

export type ModalPresetType = keyof typeof modal_presets;

export interface ModalPresetProps {
  className?: string;
  type: ModalPresetType;
  children: React.ReactNode;
  style?: React.CSSProperties;
}
