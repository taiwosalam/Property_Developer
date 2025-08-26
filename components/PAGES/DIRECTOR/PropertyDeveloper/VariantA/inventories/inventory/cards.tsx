"use client";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { User } from "lucide-react";

import React, { useState } from "react";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import Button from "@/components/Form/Button/button";
import { FiMinus } from "react-icons/fi";
import LandlordTenantModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";

export interface InventoryCardData {
  id: string;
  propertyName: string;
  branchName: string;
  managerName: string;
  totalUnit: number;
  totalAmount: string;
  lastUpdate: string;
  createdBy: string;
  createdDate: string;
}

interface InventoryCardProps {
  data: InventoryCardData;
  onManage: (data: InventoryCardData) => void;
  onPreview: (cardId: string) => void;
}

export const InventoryCard: React.FC<InventoryCardProps> = ({
  data,
  onManage,
  onPreview,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="bg-white w-full rounded-lg shadow-sm border border-gray-200 ">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          <User className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800">{data.createdBy}</span>
            <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
              <BadgeIcon color="gray" />
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Created Date {data.createdDate}
          </p>
        </div>
      </div>

      {/* Inventory Records Header */}
      <div className="bg-brand-9 text-white px-4 py-3 flex justify-between items-center">
        <h3 className="font-medium">Inventory Records</h3>
        <span className="text-sm">ID: {data.id}</span>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Row 1 */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Property Name</p>
            <p className="text-sm font-medium text-gray-800">
              {data.propertyName}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Branch Name</p>
            <p className="text-sm font-medium text-gray-800">
              {data.branchName}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Manager Name</p>
            <p className="text-sm font-medium text-gray-800">
              {data.managerName}
            </p>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Unit</p>
            <p className="text-sm font-medium text-gray-800">
              {data.totalUnit}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Amount/Quantity</p>
            <p className="text-sm font-medium text-gray-800">
              {data.totalAmount}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Last Update</p>
            <p className="text-sm font-medium text-gray-800">
              {data.lastUpdate}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <Modal
            state={{
              isOpen: isModalOpen,
              setIsOpen: setIsModalOpen,
            }}
          >
            <ModalTrigger asChild>
              <Button
                onClick={() => onManage(data)}
                className="text-white  font-medium hover:underline transition-all"
              >
                Manage
              </Button>
            </ModalTrigger>
            <ModalContent>
              <ManageInventoryModal onAdd={() => console.log("hello there")} />
            </ModalContent>
          </Modal>

          <Button
            href="/inventories/inventory/4"
            onClick={() => onPreview(data.id)}
            className="bg-brand-9 text-white font-medium rounded  transition-colors"
          >
            Preview
          </Button>
        </div>
      </div>
    </div>
  );
};

interface ManageInventoryFormProps {
  data?: {
    branch?: string;
    property?: string;
    category?: string;
    itemName?: string;
    quantity?: number;
    price?: number;
    unit?: number;
    total?: number;
  };
  onDelete?: () => void;
  onUpdate?: () => void;
  onAdd?: () => void;
}

const branches = ["Lagos Branch", "Abuja Branch", "Kano Branch"];
const properties = [
  "Sunrise Apartments",
  "Oceanview Estate",
  "Skyline Residences",
];
const categories = ["Materials", "Tools", "Plant & Equipments", "Others"];
const itemNames = ["Item A", "Item B", "Item C"];

const ManageInventoryForm: React.FC<ManageInventoryFormProps> = ({
  data,
  onDelete,
  onUpdate,
  onAdd,
}) => {
  const [formData, setFormData] = useState({
    branch: data?.branch || "",
    property: data?.property || "",
    category: data?.category || "",
    itemName: data?.itemName || "",
    quantity: data?.quantity || 0,
    price: data?.price || 0,
    unit: data?.unit || 0,
    total: data?.total || 0,
  });

  const handleChange = (field: string, value: string | number) => {
    let newData = { ...formData, [field]: value };

    // Automatically calculate total price
    const quantity = Number(newData.quantity);
    const price = Number(newData.price);
    const unit = Number(newData.unit);
    newData.total = quantity * price * unit;

    setFormData(newData);
  };

  return (
    <form className="p-4 bg-white mx-auto flex flex-col gap-4">
      {/* Branch & Property */}
      <div className="flex xs:flex-row flex-col gap-3">
        <Select
          id="branch"
          label="Select Branch"
          options={branches.map((b) => ({ label: b, value: b }))}
          value={formData.branch}
          onChange={(val) => handleChange("branch", val)}
          required
          className="flex-1"
        />
        <Select
          id="property"
          label="Select Property"
          options={properties.map((p) => ({ label: p, value: p }))}
          value={formData.property}
          onChange={(val) => handleChange("property", val)}
          required
          className="flex-1"
        />
      </div>

      {/* Category & Item Name */}
      <div className="flex xs:flex-row flex-col gap-3">
        <Select
          id="category"
          label="Item Category"
          options={categories.map((c) => ({ label: c, value: c }))}
          value={formData.category}
          onChange={(val) => handleChange("category", val)}
          required
          className="flex-1"
        />
        <Select
          id="itemName"
          label="Item Name"
          options={itemNames.map((i) => ({ label: i, value: i }))}
          value={formData.itemName}
          onChange={(val) => handleChange("itemName", val)}
          required
          className="flex-1"
        />
      </div>

      {/* Quantity, Price, Unit, Total, Minus */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
        <Input
          id="quantity"
          label="Quantity"
          type="number"
          value={formData.quantity}
          onChange={(val) => handleChange("quantity", Number(val))}
          required
        />
        <Input
          id="price"
          label="Price Unit"
          type="number"
          value={formData.price}
          onChange={(val) => handleChange("price", Number(val))}
          required
        />
        <Input
          id="unit"
          label="Unit"
          type="number"
          value={formData.unit}
          onChange={(val) => handleChange("unit", Number(val))}
          required
        />
        <Input
          id="total"
          label="Total Price"
          type="number"
          value={formData.total}
          readOnly
          required
        />
      </div>
      <Button
        type="button"
        className="size-8  ml-auto !bg-white !text-red-600 !border !border-red-600 grid place-items-center !p-0 rounded-full"
        onClick={() => console.log("Minus clicked")}
      >
        <FiMinus />
      </Button>

      {/* Add / Save or Delete & Update Buttons */}
      {!onAdd ? (
        <Button className="w-full" type="button" onClick={onAdd}>
          Save Inventory
        </Button>
      ) : (
        <div className="flex gap-3 justify-end mt-2">
          <Button
            type="button"
            onClick={onDelete}
            className="!bg-red-100 w-full !text-red-600 hover:!bg-red-200"
          >
            Delete
          </Button>
          <Button
            type="button"
            onClick={onUpdate}
            className="bg-brand-9 w-full !text-white "
          >
            Update
          </Button>
        </div>
      )}
    </form>
  );
};

export const ManageInventoryModal = ({
  onAdd,
  onDelete,
  onUpdate,
}: {
  onAdd?: () => void;
  onDelete?: () => void;
  onUpdate?: () => void;
}) => {
  return (
    <LandlordTenantModalPreset
      className="!max-w-[600px]"
      heading="Manage Inventory"
    >
      <ManageInventoryForm
        onAdd={onAdd}
        onDelete={onDelete}
        onUpdate={onUpdate}
      />
    </LandlordTenantModalPreset>
  );
};

export default ManageInventoryForm;
