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
  data: {
    id: string;
    title: string;
    video: string;
    branch_name: string;
    branch_id: string;
    created_date: string;
    edited_date: string;
    property_name: string;
    account_officer: string;
    items: {
      id: string;
      description: string;
      image: any[];
      unit: string;
      condition: string;
    };
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
        const { data: apiData } = data;
        const updatedInventoryData: InventoryData = {
          title: apiData.title || "",
          inventory_id: apiData.id || "",
          created_date: apiData.created_date || "",
          edited_date: apiData.edited_date || "",
          property_name: apiData.property_name || "",
          branch_name: apiData.branch_name || "",
          account_officer: apiData.account_officer || "",
          branch_id: apiData.branch_id || "",
        };
        setInventoryData(updatedInventoryData);
        setInventoryItems(apiData.items);
        setVideo(apiData.video);
      }
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
