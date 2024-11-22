"use client";

import Image from "next/image";
import React, { CSSProperties, useState, useRef, useEffect } from "react";

// Types
import type { InventoryItemProps } from "./types";

// Imports
import { inventory_conditions } from "./data";
import Input from "@/components/Form/Input/input";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import { InventoryField } from "./inventory-components";
import { useImageUploader } from "@/hooks/useImageUploader";
import { ImageIcon } from "@/public/icons/icons";
import useDarkMode from "@/hooks/useCheckDarkMode";
import { CounterButton } from "@/components/Settings/SettingsEnrollment/settings-enrollment-components";
import { toast } from "sonner";

const InventoryItem: React.FC<InventoryItemProps & { index: number }> = ({ data, edit, index }) => {
  const isDarkMode = useDarkMode();
  const [count, setCount] = useState<number>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log("data inventory item item - ", data);
  }, [data]);

  const handleIncrement = () => {
    setCount((prevCount) => (prevCount + 1));
  };

  const handleDecrement = () => {
    setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : prevCount));
  };
  
   const input_styles: CSSProperties = {
     backgroundColor: isDarkMode ? "#020617" : "white",
   };
  
   const selectImage = () => {
     if (fileInputRef.current) {
       fileInputRef.current.click();
     }
   };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
        toast.error('Please select a valid image file (JPG, JPEG, or PNG)');
        e.target.value = ''; // Clear the input
        setSelectedFile(null);
        return;
      }
      
      // Validate file size
      if (file.size === 0) {
        toast.error('The selected file is empty');
        e.target.value = ''; // Clear the input
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      console.log('File selected:', file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="w-full p-[18px] pb-0 flex-1 bg-white dark:bg-darkText-primary rounded-lg"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="pb-[18px]">
        <div className="flex flex-wrap-reverse items-center gap-5 2xl:gap-[66px]">
          <div className="custom-flex-col gap-6 flex-1 py-2 min-w-[240px]">
            <div className="custom-flex-col gap-2 flex-1">
              {edit ? (
                <Input
                  id={`item-name-${index}`}
                  name={`item-name-${index}`}
                  label="Inventory name"
                  className="flex-1"
                  style={input_styles}
                />
              ) : (
                <InventoryField>{data?.name || data?.description || "---"}</InventoryField>
              )}
            </div>
            <div className="flex gap-4">
              {edit ? (
                <>
                <div className="flex justify-between max-w-[150px] px-2 items-center gap-2 border-2 border-text-disabled dark:border-[#3C3D37] rounded-md">
                  <input
                    type="number"
                    id={`quantity-${index}`}
                    name={`quantity-${index}`}
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="w-2/3 px-2 py-2 border-transparent focus:outline-none"
                  />
                  <div className="btn flex flex-col items-end justify-end">
                    <CounterButton
                      onClick={handleIncrement}
                      icon="/icons/plus.svg"
                      alt="plus"
                    />
                    <CounterButton
                      onClick={handleDecrement}
                      icon="/icons/minus.svg"
                      alt="minus"
                    />
                  </div>
                  </div>
                  <Select
                    id={`condition-${index}`}
                    name={`condition-${index}`}
                    placeholder="Condition"
                    options={inventory_conditions}
                    className="flex-1"
                    isSearchable={false}
                  />
                </>
              ) : (
                <>
                  <InventoryField>{data?.quantity || data?.unit || "---"}</InventoryField>
                  <InventoryField>{data?.condition || "---"}</InventoryField>
                </>
              )}
            </div>
          </div>
          <div className="relative h-full min-h-[165px] aspect-square rounded-2xl overflow-hidden">
            <Image
              src={selectedFile ? URL.createObjectURL(selectedFile) : data?.image ? data?.image : ""}
              alt="property"
              fill
              sizes="200px"
              className="object-cover"
            />
             {edit && (
               <div
                 className="absolute inset-0 flex items-center justify-center"
                 style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
               >
                 <input
                   ref={fileInputRef}
                   type="file"
                   name={`image-${index}`}
                   accept="image/*"
                   onChange={handleFileChange}
                   className="hidden"
                   aria-label="Upload image"
                 />
                 <div className="custom-flex-col gap-6">
                   <div className="flex flex-col items-center gap-2 custom-primary-color">
                     <ImageIcon />
                     <p className="text-brand-9 text-sm font-semibold">
                       Set picture
                     </p>
                   </div>
                   <Button
                     onClick={handleUploadClick}
                     size="base_medium"
                     className="py-1 px-6"
                   >
                     select
                   </Button>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryItem;

