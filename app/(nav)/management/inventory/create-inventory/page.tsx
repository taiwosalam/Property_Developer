"use client";

import React, { CSSProperties, useEffect, useState } from "react";

// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import BackButton from "@/components/BackButton/back-button";
import InventoryItem from "@/components/Management/Inventory/inventory-item";
import useDarkMode from "@/hooks/useCheckDarkMode";
import { toast } from "sonner";
import { createInventory, getBranches } from "../data";
import { useRouter } from "next/navigation";

const CreateInventory = () => {
  const isDarkMode = useDarkMode();
  const router = useRouter();
  const [branches, setBranches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<number>(2);
  const input_styles: CSSProperties = {
    padding: "12px 14px",
    backgroundColor: isDarkMode ? "#020617" : "white",
  };

  useEffect(() => {
    const fetchBranches = async () => {
      const branchesResponse = await getBranches();
      if (branchesResponse) {
        setBranches(branchesResponse.data.data);
      }
    };
    fetchBranches();
  }, []);

  // console.log("branches", branches);
// const convertImageToBase64 = async (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = (error) => reject(error);
//     });
//   };


const handleAddInventory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const inventoryData = [];

    // Build inventory items array
    for (let i = 0; i < inventoryItems; i++) {
      const imageFile = formData.get(`image-${i}`) as File;
      inventoryData.push({
        description: formData.get(`item-name-${i}`),
        unit: formData.get(`quantity-${i}`),
        condition: formData.get(`condition-${i}`),
        image: imageFile
      });
    }

    try {
      const payload = new FormData();
      payload.append('title', formData.get('inventory-title') as string);
      payload.append('video_link', formData.get('video_link') as string);
      payload.append('branch_id', String(formData.get('branch_id')));
      
      // Append each item separately with proper indexing
      inventoryData.forEach((item, index) => {
        if (item.image) {
          payload.append(`items[${index}][image]`, item.image);
        }
        payload.append(`items[${index}][description]`, item.description as string);
        payload.append(`items[${index}][unit]`, item.unit as string);
        payload.append(`items[${index}][condition]`, item.condition as string);
      });

      const success = await createInventory(payload);
      if (success) {
        router.push("/management/inventory");
        toast.success("Inventory created successfully");
      }
    } catch (error) {
      console.error("Error creating inventory:", error);
      toast.error("Failed to create inventory");
    } finally {
      setIsLoading(false);
    }
};
  const handleAddMoreInventory = () => {
    setInventoryItems((prev) => prev + 1);
  };

  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <form onSubmit={handleAddInventory}>
        <div className="custom-flex-col gap-4">
          <BackButton>Create Inventory</BackButton>
          <div className="flex flex-col md:flex-row gap-8">
            <Input
              id="inventory-title"
              name="inventory-title"
              placeholder="Add Title"
              className="flex-1 dark:bg-darkText-primary"
              style={input_styles}
            />
            <Input
              id="video-link"
              name="video-link"
              placeholder="Video Link"
              className="flex-1"
              style={input_styles}
            />
            <Select
              id="branch_id"
              name="branch_id"
              placeholder="Branch Name"
              options={branches.map((branch) => ({
                label: branch.branch_name,
                value: String(branch.id),
              }))}
              isSearchable={false}
              className="bg-white dark:bg-darkText-primary flex-1"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          {[...Array(inventoryItems)].map((_, index) => (
            <InventoryItem key={index} edit index={index} />
          ))}
        </div>
        <div className="fixed bottom-0 right-0 w-full bg-white dark:bg-darkText-primary py-5 px-[60px] flex gap-6 justify-end">
          <Button
            size="sm_medium"
            variant="blank"
            className="py-2 px-7 text-brand-9 bg-brand-1"
            onClick={() => setInventoryItems(2)}
          >
            Clear all
          </Button>
          <div className="flex gap-6">
            <Button
              size="sm_medium"
              variant="blank"
              className="py-2 px-7 text-brand-9 bg-brand-1"
              onClick={handleAddMoreInventory}
            >
              Add more to inventory
            </Button>
            <Button type="submit" size="sm_medium" className="py-2 px-7" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateInventory;
