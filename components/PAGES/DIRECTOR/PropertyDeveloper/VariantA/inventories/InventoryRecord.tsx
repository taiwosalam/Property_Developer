"use client";
import BackButton from "@/components/BackButton/back-button";
import Button from "@/components/Form/Button/button";
import {
  inventoryDetails,
  InventoryDetailsCard,
  OrderActivitiesCard,
  orderActivitiesData,
  ReturnItemsTable,
  statsCards,
  StatsCardsGrid,
} from "./inventory-details/card";
import { useState } from "react";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { ManageInventoryModal } from "./inventory/cards";

const InventoryRecord = () => {
  const [currentDateIndex, setCurrentDateIndex] = useState<number>(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  // Mock data for inventory details

  // Mock data for order activities with different dates

  const handleDateChange = (index: number): void => {
    setCurrentDateIndex(index);
  };

  return (
    <section>
      <div className="top flex justify-between">
        <BackButton>Inventory Record</BackButton>

        <Modal
          state={{
            isOpen: isModalOpen,
            setIsOpen: setIsModalOpen,
          }}
        >
          <ModalTrigger asChild>
            <Button>Manage</Button>
          </ModalTrigger>
          <ModalContent>
            <ManageInventoryModal onAdd={() => console.log("hello there")} />
          </ModalContent>
        </Modal>
      </div>

      <div className="grid py-6">
        <StatsCardsGrid cards={statsCards} />
      </div>

      <div className="flex gap-5">
        <div className="w-2/3">
          <ReturnItemsTable />
        </div>

        <div className="w-1/3">
          <div className="items">
            <div className="space-y-4">
              {/* Inventory Details Card */}
              <InventoryDetailsCard data={inventoryDetails} />

              {/* Order Activities Card */}
              <OrderActivitiesCard
                activitiesData={orderActivitiesData}
                currentDateIndex={currentDateIndex}
                onDateChange={handleDateChange}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default InventoryRecord;
