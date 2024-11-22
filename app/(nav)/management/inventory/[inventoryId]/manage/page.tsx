"use client";
import React, { CSSProperties, useEffect, useState } from "react";

// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import BackButton from "@/components/BackButton/back-button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import InventoryItem from "@/components/Management/Inventory/inventory-item";
import DeleteAccountModal from "@/components/Management/delete-account-modal";
import { InventoryListInfo } from "@/components/Management/Inventory/inventory-components";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import Select from "@/components/Form/Select/select";
import useDarkMode from "@/hooks/useCheckDarkMode";
import useFetch from "@/hooks/useFetch";
import { useParams } from "next/dist/client/components/navigation";


interface InventoryData {
  title: string;
  inventory_id: string;
  created_date: string;
  edited_date: string;
  property_name: string;
  branch_name: string;
  account_officer: string;
}

//  Type for the data object
interface FetchData {
  id: string;
  title: string;
  created_date: string;
  edited_date: string;
  property_name: string;
  branch_name: string;
  account_officer: string;
  inventory: {
    title: string;
    id: string;
    items: any[];
  };
}


const ManageInventory = () => {
  const isDarkMode = useDarkMode();
  const input_styles: CSSProperties = {
    padding: "12px 14px",
    backgroundColor: isDarkMode ? "#020617" : "white",
  };

  const { inventoryId } = useParams();
  const [inventoryItems, setInventoryItems] = useState<any>([]);
  const [inventoryData, setInventoryData] = useState<InventoryData | null>(null);
  const { data, loading, error } = useFetch<FetchData>(`/inventory/${inventoryId}`);

  useEffect(() => {
    const fetchBranchData = async () => {
      if (data) {
        console.log("data - ", data);

        const updatedInventoryData: InventoryData = {
          title: data.inventory.title || "",
          inventory_id: data.inventory.id || "",
          created_date: data.created_date || "",
          edited_date: data.edited_date || "",
          property_name: data.property_name || "",
          branch_name: data.branch_name || "",
          account_officer: data.account_officer || "",
        };
        setInventoryData(updatedInventoryData);
        setInventoryItems(data.inventory.items);
      }
    };

    fetchBranchData();
  }, [data]);

  return (
    <div className="custom-flex-col gap-10 min-h-[80vh] pb-[150px] lg:pb-[100px]">
      <div className="custom-flex-col gap-4">
        <BackButton>Manage Inventory</BackButton>
        <div className="custom-flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-8">
            <Input
              id="inventory-title"
              value="Olalomi Cottage"
              className="flex-1 dark:bg-darkText-primary dark:text-darkText-1"
              style={input_styles}
            />
            <Input
              id="video-link"
              placeholder="Video Link"
              className="flex-1"
              style={input_styles}
            />
            <Select
              id="branch-name"
              placeholder="Branch Name"
              options={["branch 1", "branch 2", "branch 3"]}
              isSearchable={false}
              className="bg-white dark:bg-darkText-primary flex-1"
            />
          </div>
          <div
            className="p-6 bg-white dark:bg-darkText-primary rounded-lg custom-flex-col gap-4"
            style={{
              boxShadow:
                "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
            }}
          >
            <p className="text-brand-10 dark:text-white text-base font-medium">
              Details
            </p>
            <div className="flex flex-col gap-4 lg:gap-0 lg:flex-row lg:items-center">
              <InventoryListInfo data={inventoryData || {}} chunkSize={2} />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* <InventoryItem edit index={0} />
        <InventoryItem edit index={1} /> */}
      </div>
      <FixedFooter className="flex flex-wrap gap-6 items-center justify-between">
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
      </FixedFooter>
    </div>
  );
};

export default ManageInventory;
