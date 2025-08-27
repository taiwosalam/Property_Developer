// components/InventoryCard.tsx
import React, { FormEvent } from "react";
import { InventoryItem, InventorySection } from "./types";
import Image from "next/image";
// components/InventorySection.tsx
import { useCallback, useEffect, useState } from "react";
// import useEmblaCarousel from "embla-carousel-react";
import useEmblaCarousel from "embla-carousel-react";
import LandlordTenantModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import { AuthForm } from "@/components/Auth/auth-components";
import Select from "@/components/Form/Select/select";
import Input from "@/components/Form/Input/input";
import TextArea from "@/components/Form/TextArea/textarea";
interface InventoryCardProps {
  item: InventoryItem;
}

export const InventoryCard: React.FC<InventoryCardProps> = ({ item }) => {
  const lowStock = item.remaining < 10;

  return (
    <div className="bg-white flex gap-4 rounded-lg shadow p-4 flex-shrink-0 max-w-[200px] w-full">
      <Image
        height={96}
        width={96}
        src={item.image}
        alt={item.name}
        className="h-20 w-1/3 block object-cover rounded-md"
      />

      <div className="item">
        <h3 className="font-semibold text-[#374151] whitespace-nowrap mt-2">
          {item.name}
        </h3>
        {item.price && (
          <p className="text-sm whitespace-nowrap text-gray-600">
            {item.price} {item.unit && `(${item.unit})`}
          </p>
        )}
        <p
          className={`text-sm whitespace-nowrap font-medium mt-1 ${
            lowStock ? "text-red-500" : "text-green-600"
          }`}
        >
          {item.remaining} units left
        </p>
      </div>
    </div>
  );
};

interface InventorySectionProps {
  section: InventorySection;
}

export const InventorySectionComp: React.FC<InventorySectionProps> = ({
  section,
}) => {
  const [emblaRef, embla] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps",
  });
  const [canScrollNext, setCanScrollNext] = useState(false);

  const checkNext = useCallback(() => {
    if (!embla) return;
    setCanScrollNext(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    checkNext();
    embla.on("select", checkNext);
    embla.on("resize", checkNext);
  }, [embla, checkNext]);

  return (
    <div className="mb-6">
      <h2 className="font-semibold text-[#5A5D61] rounded-md p-3 bg-[#EFF6FF] mb-2">
        {section.title}
      </h2>
      <div className="relative">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-4">
            {section.items.map((item: InventoryItem) => (
              <InventoryCard key={item.id} item={item} />
            ))}
          </div>
        </div>
        {canScrollNext && (
          <button
            onClick={() => embla?.scrollNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-100 rounded-full p-2 shadow"
          >
            &rarr;
          </button>
        )}
        {embla?.canScrollPrev() && (
          <button
            onClick={() => embla?.scrollNext()}
            className="absolute left-0 transform rotate-180 top-1/2 -translate-y-1/2 bg-gray-100 rounded-full p-2 shadow"
          >
            &rarr;
          </button>
        )}
      </div>
    </div>
  );
};

import { useImageUploader } from "@/hooks/useImageUploader";
import Button from "@/components/Form/Button/button";

interface Modifier {
  name: string;
  price: string;
  quantity: string;
}

export const AddNewItems = () => {
  const { preview, inputFileRef, handleImageChange, clearSelection } =
    useImageUploader({
      //   placeholder: "/placeholder.png",
      maxSize: { value: 2, unit: "MB" },
    });

  const [formValues, setFormValues] = useState({
    branch: "",
    property: "",
    category: "",
    itemName: "",
    itemPrice: "",
    itemQuantity: "",
    itemDetails: "",
  });

  const [modifiers, setModifiers] = useState<Modifier[]>([
    { name: "", price: "", quantity: "" },
  ]);

  const handleChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleModifierChange = (
    index: number,
    key: keyof Modifier,
    value: string
  ) => {
    const updated = [...modifiers];
    updated[index][key] = value;
    setModifiers(updated);
  };

  const addModifier = () => {
    setModifiers([...modifiers, { name: "", price: "", quantity: "" }]);
  };

  const handleSubmit = (
    data: any,
    e: FormEvent<HTMLFormElement> | undefined
  ) => {
    console.log("Form submitted:", data);
    console.log("Modifiers:", modifiers);
    console.log("Image preview URL:", preview);
  };

  // Sample options
  const branches = [
    { label: "Branch A", value: "a" },
    { label: "Branch B", value: "b" },
  ];
  const properties = [
    { label: "Property 1", value: "1" },
    { label: "Property 2", value: "2" },
  ];
  const categories = [
    { label: "Category X", value: "x" },
    { label: "Category Y", value: "y" },
  ];

  return (
    <LandlordTenantModalPreset
      className="!max-w-[600px]"
      heading="Add New Items"
    >
      <AuthForm onFormSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Upload Image */}
        <div className="flex   justify-start items-center gap-2">
          {preview && (
            <div className="relative">
              <Image
                height={150}
                width={150}
                src={preview as string}
                alt="Preview"
                className="size-[80px]"
              />
              <button
                type="button"
                onClick={clearSelection}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded"
              >
                Clear
              </button>
            </div>
          )}
          <Button
            type="button"
            onClick={() => inputFileRef.current?.click()}
            className="h-max flex items-start font-thin text-sm text-brand-9 !bg-gray-100 p-2 rounded"
          >
            <span className="text-red-500 ml-1">*</span>
            Upload Product Image
          </Button>
          <input
            type="file"
            ref={inputFileRef}
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            name="productImage"
          />
        </div>
        {/* Row 1: Branch + Property */}
        <div className="grid grid-cols-2 gap-4">
          <Select
            required
            options={branches}
            id="branch"
            label="Branch"
            value={formValues.branch}
            onChange={(val) => handleChange("branch", val)}
          />
          <Select
            required
            options={properties}
            id="property"
            label="Property"
            value={formValues.property}
            onChange={(val) => handleChange("property", val)}
          />
        </div>

        {/* Row 2: Category + Item Name */}
        <div className="grid grid-cols-2 gap-4">
          <Select
            required
            options={categories}
            id="category"
            label="Category"
            value={formValues.category}
            onChange={(val) => handleChange("category", val)}
          />
          <Input
            required
            id="itemName"
            label="Item Name"
            value={formValues.itemName}
            onChange={(val) => handleChange("itemName", val)}
          />
        </div>

        {/* Row 3: Price + Quantity */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="itemPrice"
            label="Item Price"
            value={formValues.itemPrice}
            onChange={(val) => handleChange("itemPrice", val)}
            name="itemPrice"
          />
          <Input
            id="itemQuantity"
            label="Item Quantity"
            value={formValues.itemQuantity}
            onChange={(val) => handleChange("itemQuantity", val)}
            name="itemQuantity"
          />
        </div>

        {/* Row 4: Item Details */}
        <TextArea
          id="itemDetails"
          label="Item Details"
          value={formValues.itemDetails}
          onChange={(val) => handleChange("itemDetails", val)}
          //   name="itemDetails"
        />

        {/* Row 5: Modifiers */}
        <div>
          {modifiers.map((mod, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-4 mb-2">
              <Input
                id={`modifierName-${idx}`}
                label="Item Modifier"
                value={mod.name}
                onChange={(val) => handleModifierChange(idx, "name", val)}
                name={`modifierName-${idx}`}
              />

              <Input
                id={`modifierQuantity-${idx}`}
                label="Quantity"
                value={mod.quantity}
                onChange={(val) => handleModifierChange(idx, "quantity", val)}
                name={`modifierQuantity-${idx}`}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addModifier}
            className="border-brand-9  ml-auto size-8 border grid place-items-center rounded-full font-medium mb-4"
          >
            +
          </button>
        </div>

        {/* Submit */}
        <Button type="submit" className="bg-brand-9 text-white  rounded">
          Submit
        </Button>
      </AuthForm>
    </LandlordTenantModalPreset>
  );
};

const FormCategory = ({ children }: { children: React.ReactNode }) => {
  <div className="grid grid-cols-2">{children}</div>;
};
