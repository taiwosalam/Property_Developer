"use client";

import React, { CSSProperties, useEffect, useState, useRef } from "react";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import BackButton from "@/components/BackButton/back-button";
import InventoryItem from "@/components/Management/Inventory/inventory-item";
import useDarkMode from "@/hooks/useCheckDarkMode";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { handleAxiosError } from "@/services/api";
import { createInventory, getBranches } from "../../data";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { InventoryApiResponse } from "../types";
import useFetch from "@/hooks/useFetch";

const CreateInventory = ({ params }: { params: { inventoryId: string } }) => {
  const isDarkMode = useDarkMode();
  const router = useRouter();
  const unitId = useSearchParams().get("unitId");
  const formRef = useRef<HTMLFormElement>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<number>(2);
  const [inventoryFiles, setInventoryFiles] = useState<File[][]>([]);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0); 


  const input_styles: CSSProperties = {
    padding: "12px 14px",
    backgroundColor: isDarkMode ? "#020617" : "white",
    borderRadius: "8px",
  };

  const { data, loading, isNetworkError, error } =
    useFetch<InventoryApiResponse>(`/inventory/${params.inventoryId}`);
  const INVENTORY_ID = data?.inventory?.id || 0;

  useEffect(() => {
    // Update showRemoveButton based on inventoryItems
    setShowRemoveButton(inventoryItems > 2);
  }, [inventoryItems]);

  const handleAddInventory = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const inventoryData = [];

    for (let i = 0; i < inventoryItems; i++) {
      const imageFile = inventoryFiles[i] || [];
      inventoryData.push({
        description: formData.get(`item-name-${i}`) || "",
        unit: formData.get(`quantity-${i}`) || "",
        condition: formData.get(`condition-${i}`) || "",
        image: imageFile,
      });
    }

    try {
      const payload = new FormData();
      payload.append("video_link", formData.get("video_link") as string);

      inventoryData.forEach((item, index) => {
        if (Array.isArray(item.image)) {
          item.image.forEach((img: File, imageIndex: number) => {
            payload.append(`items[${index}][image][${imageIndex}]`, img);
          });
        }
        payload.append(
          `items[${index}][description]`,
          item.description as string
        );
        payload.append(`items[${index}][unit]`, item.unit as string);
        payload.append(`items[${index}][condition]`, item.condition as string);
      });

      const success = await createInventory(
        payload,
        INVENTORY_ID,
        Number(unitId)
      );
      if (success) {
        router.push(`/management/inventory/${params.inventoryId}`);
        toast.success("Inventory created successfully");
      }
    } catch (error) {
      console.error("Error creating inventory:", error);
      toast.error("Failed to create inventory");
      handleAxiosError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMoreInventory = () => {
    setInventoryItems((prev) => prev + 1);
  };

  const handleRemoveInventory = () => {
    if (inventoryItems > 2) {
      setInventoryItems((prev) => prev - 1);
      setInventoryFiles((prev) => prev.slice(0, -1)); // Remove the last item's files
    }
  };

  const handleClearAll = () => {
    if (formRef.current) {
      formRef.current.reset(); // Reset form inputs
    }
    setInventoryItems(2); // Reset to initial number of items
    setInventoryFiles([]); // Clear all files
    setShowRemoveButton(false); // Hide remove button
    setResetTrigger((prev) => prev + 1); // Trigger InventoryItem reset
    toast.info("Form cleared");
  };

  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <BackButton>Create Inventory</BackButton>
      <form onSubmit={handleAddInventory}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          <Input
            id="video_link"
            name="video_link"
            placeholder="Video Link"
            className="w-full"
            style={input_styles}
          />
        </div>
        {/* ADD MORE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          {[...Array(inventoryItems)].map((_, index) => (
            <InventoryItem
            key={`${index}-${resetTrigger}`}
              edit
              index={index}
              resetTrigger={resetTrigger}
              inventoryFiles={inventoryFiles}
              setInventoryFiles={setInventoryFiles}
            />
          ))}
        </div>
        {/* FOOTER */}
        <FixedFooter>
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="border"
              size="sm_medium"
              className="py-2 px-8"
              onClick={handleClearAll}
            >
              Clear All
            </Button>

            <div className="flex items-center gap-2">
              {showRemoveButton && (
                <Button
                  size="sm_medium"
                  variant="blank"
                  className="py-2 px-8 text-brand-9 bg-brand-1"
                  onClick={handleRemoveInventory}
                >
                  Remove Record
                </Button>
              )}
              <div className="flex gap-6">
                <Button
                  size="sm_medium"
                  variant="border"
                  className="py-2 px-8"
                  onClick={() => {
                    handleAddMoreInventory();
                  }}
                >
                  Add More Inventory
                </Button>
              </div>
              <Button
                type="submit"
                size="sm_medium"
                className="py-2 px-8"
                disabled={isLoading}
              >
                {isLoading ? "Please wait..." : "Create"}
              </Button>
            </div>
          </div>
        </FixedFooter>
      </form>
    </div>
  );
};

export default CreateInventory;
