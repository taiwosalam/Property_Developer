// "use client";

import Image from "next/image";
import React, { CSSProperties, useState } from "react";

// Types
import type { InventoryItemProps } from "./types";

// Images
import ImageBlue from "@/public/icons/image-blue.svg";
import SampleProperty6 from "@/public/empty/SampleProperty6.jpg";

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


const InventoryItem: React.FC<InventoryItemProps & { index: number }> = ({ data, edit, index }) => {
  const isDarkMode = useDarkMode();
  const [count, setCount] = useState<number>(1);
   const { preview, inputFileRef, handleImageChange } = useImageUploader({
     placeholder: data?.image,
   });

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
     if (inputFileRef.current) {
       inputFileRef.current.click();
     }
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
                <InventoryField>{data?.name}</InventoryField>
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
                  <InventoryField>{data?.quantity}</InventoryField>
                  <InventoryField>{data?.condition}</InventoryField>
                </>
              )}
            </div>
          </div>
          <div className="relative h-full min-h-[165px] aspect-square rounded-2xl overflow-hidden">
            <Image
              src={preview || ""}
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
                   type="file"
                   id="picture"
                   name={`image-${index}`}
                   accept="image/*"
                   ref={inputFileRef}
                   className="hidden pointer-events-none"
                   onChange={handleImageChange}
                 />
                 <div className="custom-flex-col gap-6">
                   <div className="flex flex-col items-center gap-2 custom-primary-color">
                     <ImageIcon />
                     <p className="text-brand-9 text-sm font-semibold">
                       Set picture
                     </p>
                   </div>
                   <Button
                     onClick={selectImage}
                     size="base_medium"
                     className="py-1 px-6"
                   >
                     select
                   </Button>
                 </div>
               </div>
             )} {edit && (
               <div
                 className="absolute inset-0 flex items-center justify-center"
                 style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
               >
                 <input
                   type="file"
                   id="picture"
                   name={`image-${index}`}
                   accept="image/*"
                   ref={inputFileRef}
                   className="hidden pointer-events-none"
                   onChange={handleImageChange}
                 />
                 <div className="custom-flex-col gap-6">
                   <div className="flex flex-col items-center gap-2 custom-primary-color">
                     <ImageIcon />
                     <p className="text-brand-9 text-sm font-semibold">
                       Set picture
                     </p>
                   </div>
                   <Button
                     onClick={selectImage}
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
