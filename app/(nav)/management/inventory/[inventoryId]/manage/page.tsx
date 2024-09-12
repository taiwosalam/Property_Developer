import React, { CSSProperties } from "react";

// Imports
import Input from "@/components/Form/Input/input";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import InventoryItem from "@/components/Management/Inventory/inventory-item";
import { InventoryListInfo } from "@/components/Management/Inventory/inventory-components";
import Button from "@/components/Form/Button/button";
import DeleteAccountModal from "@/components/Management/delete-account-modal";

const ManageInventory = () => {
  const input_styles: CSSProperties = {
    padding: "12px 14px",
    backgroundColor: "white",
  };

  return (
    <div className="custom-flex-col gap-10">
      <div className="custom-flex-col gap-4">
        <h1 className="text-black text-2xl font-medium capitalize">
          Manage Inventory
        </h1>
        <div className="custom-flex-col gap-6">
          <div className="flex gap-8">
            <Input
              id="inventory-title"
              value="Olalomi Cottage"
              className="flex-1"
              style={input_styles}
            />
            <Input
              id="video-link"
              placeholder="Video Link"
              className="flex-1"
              style={input_styles}
            />
          </div>
          <div
            className="p-6 bg-white rounded-lg custom-flex-col gap-4"
            style={{
              boxShadow:
                "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
            }}
          >
            <p className="text-brand-10 text-base font-medium">Details</p>
            <div className="flex items-center">
              <InventoryListInfo data={{}} chunkSize={2} />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <InventoryItem edit />
        <InventoryItem edit />
      </div>
      <div className="sticky bottom-0 right-0 w-full bg-white py-5 px-[60px] flex justify-between">
        <Modal>
          <ModalTrigger asChild>
            <Button
              size="sm_medium"
              variant="blank"
              className="py-2 px-7 text-status-error-primary bg-status-error-1"
            >
              delete inventory
            </Button>
          </ModalTrigger>
          <ModalContent>
            <DeleteAccountModal />
          </ModalContent>
        </Modal>
        <div className="flex gap-6">
          <Button
            size="sm_medium"
            variant="blank"
            className="py-2 px-7 text-brand-9 bg-brand-1"
          >
            Add more to inventory
          </Button>
          <Button size="sm_medium" className="py-2 px-7">
            save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManageInventory;
