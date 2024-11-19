"use client";

import React, { CSSProperties, useState } from "react";

// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import BackButton from "@/components/BackButton/back-button";
import InventoryItem from "@/components/Management/Inventory/inventory-item";
import useDarkMode from "@/hooks/useCheckDarkMode";
import { toast } from "sonner";

const CreateInventory = () => {
  const isDarkMode = useDarkMode();
  const input_styles: CSSProperties = {
    padding: "12px 14px",
    backgroundColor: isDarkMode ? "#020617" : "white",
  };

  const [inventoryItems, setInventoryItems] = useState<number>(2);

  const convertImageToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAddInventory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const inventoryData = [];

    // Extract inventory items with base64 image conversion
    for (let i = 0; i < inventoryItems; i++) {
      const imageFile = formData.get(`image-${i}`) as File;
      let base64Image = null;
      
      if (imageFile && imageFile instanceof File) {
        try {
          base64Image = await convertImageToBase64(imageFile);
        } catch (error) {
          console.error(`Error converting image ${i} to base64:`, error);
          toast.error(`Failed to process image ${i}`);
          return;
        }
      }

      const item = {
        description: formData.get(`item-name-${i}`),
        quantity: formData.get(`quantity-${i}`),
        condition: formData.get(`condition-${i}`),
        image: base64Image,
      };
      inventoryData.push(item);
    }

    // Prepare API payload
    const payload = {
      title: formData.get("inventory-title"),
      video_link: formData.get("video-link"),
      branchName: formData.get("branch-name"),
      items: inventoryData,
    };

    console.log("Payload with base64 images:", payload);

    try {
      // Mock API call
      const success = true; // Replace with actual API call
      if (success) {
        toast.success("Inventory created successfully");
      }
    } catch (error) {
      console.error("Error creating inventory:", error);
      toast.error("Failed to create inventory");
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
              id="branch-name"
              name="branch-name"
              placeholder="Branch Name"
              options={["branch 1", "branch 2", "branch 3"]}
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
            <Button type="submit" size="sm_medium" className="py-2 px-7">
              Save
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateInventory;
