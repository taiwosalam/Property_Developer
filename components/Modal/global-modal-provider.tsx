"use client";

import { useGlobalStore } from "@/store/general-store";
import OtherAgreementDocument from "../Documents/other-agreement";
import { Modal, ModalContent } from "./modal";
import React, { useCallback, useContext, useState } from "react";

// Define the type for modal content
type ModalContentType = React.ReactNode | null;
type ModalProps = Record<string, any>;

// Context for modal management
interface ModalContextType {
  openModal: (content: ModalContentType, props?: ModalProps) => void;
  closeModal: () => void;
}

const ModalContext = React.createContext<ModalContextType | undefined>(
  undefined
);

// Hook to access modal context
export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error(
      "useModalContext must be used within a GlobalModalProvider"
    );
  }
  return context;
};

const GlobalModalProvider = ({ children }: { children: React.ReactNode }) => {
  const { openDocumentModal, selectedDocumentOption, setGlobalInfoStore } =
    useGlobalStore();
  const [modalContent, setModalContent] = useState<ModalContentType>(null);
  const [modalProps, setModalProps] = useState<ModalProps>({});

  // Function to open a modal with specific content and props
  const openModal = useCallback(
    (content: ModalContentType, props: ModalProps = {}) => {
      setModalContent(content);
      setModalProps(props);
      // If using existing global store for specific modals
      if (props.isDocumentModal) {
        setGlobalInfoStore("openDocumentModal", true);
        setGlobalInfoStore(
          "selectedDocumentOption",
          props.selectedOption || null
        );
      }
    },
    [setGlobalInfoStore]
  );

  // Function to close the modal
  const closeModal = useCallback(() => {
    setModalContent(null);
    setModalProps({});
    setGlobalInfoStore("openDocumentModal", false);
    setGlobalInfoStore("selectedDocumentOption", null);
  }, [setGlobalInfoStore]);

  // Determine which modal to show
  const isModalOpen = !!modalContent || openDocumentModal;
  const contentToRender =
    modalContent ||
    (openDocumentModal && selectedDocumentOption ? (
      <OtherAgreementDocument selectedOption={selectedDocumentOption} />
    ) : null);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal
        state={{
          isOpen: isModalOpen,
          setIsOpen: (isOpen) => {
            if (!isOpen) closeModal();
          },
        }}
      >
        <ModalContent {...modalProps}>
          {contentToRender || <div>No content provided</div>}
        </ModalContent>
      </Modal>
    </ModalContext.Provider>
  );
};

export default GlobalModalProvider;
