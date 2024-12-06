"use client";
import React, { useEffect, useState } from "react";

// Imports
import Button from "@/components/Form/Button/button";
import BackButton from "@/components/BackButton/back-button";
import InventoryItem from "@/components/Management/Inventory/inventory-item";
import { InventoryListInfo } from "@/components/Management/Inventory/inventory-components";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { useParams } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import { getBranch } from "@/components/Management/Inventory/data";

interface InventoryData {
  title: string;
  inventory_id: string;
  created_date: string;
  edited_date: string;
  property_name: string;
  branch_name: string;
  account_officer: string;
  branch_id: string;
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
    branch_id: string;
    video: string;
  };
}

const PreviewInventory = () => {
  const { inventoryId } = useParams();
  const [inventoryItems, setInventoryItems] = useState<any>([]);
  const [inventoryData, setInventoryData] = useState<InventoryData | null>(null);
  const { data, loading, error } = useFetch<FetchData>(`/inventory/${inventoryId}`);
  const [video, setVideo] = useState<string>("");

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
          branch_id: data.inventory.branch_id || "",
        };
        setInventoryData(updatedInventoryData);
        setInventoryItems(data.inventory.items);
        setVideo(data.inventory.video);
      }
      console.log("inventory items - ", inventoryItems);
    };

    fetchBranchData();
  }, [data]);

  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <div className="custom-flex-col gap-4">
        <BackButton>{inventoryData?.title}</BackButton>
        <div
          className="p-6 bg-white dark:bg-darkText-primary rounded-lg custom-flex-col gap-4"
          style={{
            boxShadow:
              "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
          }}
        >
          <p className="text-brand-10 dark:text-darkText-1 text-base font-medium">
            Details
          </p>
          <div className="flex flex-col gap-4 lg:gap-0 lg:flex-row lg:items-center">
            <InventoryListInfo data={inventoryData || {}} chunkSize={2} />
          </div>
        </div>
      </div>
      <div className="custom-flex-col gap-4">
        <h2 className="text-black dark:text-white text-xl font-medium">
          Added Inventory
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {inventoryItems?.map((item: any, index: number) => (
            <InventoryItem 
              key={index} 
              index={index} 
              data={item} 
              video={video}
            />
          ))}
        </div>
      </div>
      <FixedFooter className="flex gap-6 justify-end">
        <Button 
          href={`/management/inventory/${inventoryData?.inventory_id}/manage`}
          size="sm_medium"
          className="py-2 px-7"
        >
          Manage inventory
        </Button>
      </FixedFooter>
    </div>
  );
};

export default PreviewInventory;
