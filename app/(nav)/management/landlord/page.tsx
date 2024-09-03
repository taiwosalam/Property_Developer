import React from "react";

// Imports
import Button from "@/components/Form/Button/button";
import AddLandlordModal from "@/components/Landlord/add-landlord-modal";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { LandlordHeaderCard } from "@/components/Landlord/landlord-header-card";

const Landlord = () => {
  return (
    <main className="w-full h-fit space-y-9">
      <section className="w-full h-fit flex items-center justify-between">
        <div className="grid grid-cols-3 gap-4">
          <LandlordHeaderCard />
          <LandlordHeaderCard />
          <LandlordHeaderCard />
        </div>
        <div>
          <Modal>
            <ModalTrigger asChild>
              <Button>+ create new landlord</Button>
            </ModalTrigger>
            <ModalContent>
              <AddLandlordModal />
            </ModalContent>
          </Modal>
        </div>
      </section>
      <section></section>
    </main>
  );
};

export default Landlord;
