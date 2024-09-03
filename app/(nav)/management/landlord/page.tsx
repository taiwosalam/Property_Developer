import React from "react";

// Imports
import Button from "@/components/Form/Button/button";
import AddLandlordModal from "@/components/Landlord/add-landlord-modal";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";

const Landlord = () => {
  return (
    <div>
      <Modal>
        <ModalTrigger asChild>
          <Button>create new landlord</Button>
        </ModalTrigger>
        <ModalContent>
          <AddLandlordModal />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Landlord;
