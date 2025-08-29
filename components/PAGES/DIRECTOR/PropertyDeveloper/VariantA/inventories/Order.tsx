"use client";

import React, { useState } from "react";
import Button from "@/components/Form/Button/button";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import { FiArrowLeft, FiPlus, FiMinus } from "react-icons/fi";
import BackButton from "@/components/BackButton/back-button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { AddNewItems } from "./category/components";
import SelectModal from "./order/SelectModal";

interface ItemRow {
  id: number;
  category: string;
  name: string;
  quantity: number;
  unit: number;
  status: string;
}

const categories = ["Materials", "Tools", "Plant & Equipments", "Others"];
const itemNames = ["Item A", "Item B", "Item C"];
const staffNames = ["David Ajala", "Emmanuel Sogo"];
const witnesses = ["Witness 1", "Witness 2"];
const statuses = ["Pending", "New", "Delivered", "Canceled"];

const OrderPage: React.FC = () => {
  const [items, setItems] = useState<ItemRow[]>([
    { id: 1, category: "", name: "", quantity: 0, unit: 0, status: "Pending" },
  ]);

  // Add new item row
  const addItemRow = () => {
    setItems([
      ...items,
      {
        id: items.length + 1,
        category: "",
        name: "",
        quantity: 0,
        unit: 0,
        status: "Pending",
      },
    ]);
  };

  // Remove a row by id
  const removeItemRow = (id: number) => {
    if (items.length === 1) return;
    setItems(items.filter((item) => item.id !== id));
  };

  // Update a field in a row
  const handleItemChange = (
    id: number,
    field: keyof ItemRow,
    value: string | number
  ) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = () => {
    console.log("Order submitted:", items);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6 relative">
      {/* Top Bar */}
      <div className="flex gap-3 items-center mb-6">
        <BackButton>{""}</BackButton>
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-lg">Order #123456</h1>
          <span className="bg-green-500/50 text-green-700 px-3 py-1 rounded-lg font-medium">
            New
          </span>
        </div>
      </div>

      {/* Staff & Witness Section */}
      <div className="flex items-start justify-between gap-6 mb-6">
        <div className="flex items-end w-1/2 max-w-[500px] gap-6 flex-1">
          <div className="flex flex-col w-full">
            <label htmlFor="staffName">Select Staff Name</label>
            <Select
              id="staffName"
              options={staffNames.map((s) => ({ label: s, value: s }))}
              onChange={() => {}}
            />
          </div>
          <Modal
            state={{
              isOpen: isModalOpen,
              setIsOpen: setIsModalOpen,
            }}
          >
            <ModalTrigger asChild>
              <Button className="whitespace-nowrap">Choose With ID</Button>
            </ModalTrigger>
            <ModalContent>
              <SelectModal />
            </ModalContent>
          </Modal>
        </div>

        <div className="flex w-1/2 justify-center">
          <div className="flex max-w-[300px] flex-col flex-1">
            <Select
              id="witness"
              label="Assign Witness"
              options={witnesses.map((w) => ({ label: w, value: w }))}
              onChange={() => {}}
            />
            <Button className="mt-2">Assign Now</Button>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="mb-6 pb-8 max-w-[600px]">
        <h2 className="font-semibold mb-3">Items</h2>

        {items.map((item, index) => (
          <div key={item.id} className="mb-3 border-b pb-2">
            <div className="flex gap-3 mb-2 items-end">
              <Select
                required
                label="Category"
                id={`category-${item.id}`}
                className="flex-1"
                options={categories.map((c) => ({ label: c, value: c }))}
                value={item.category}
                onChange={(val) => handleItemChange(item.id, "category", val)}
              />
              <Select
                label="Name"
                id={`name-${item.id}`}
                className="flex-1"
                options={itemNames.map((n) => ({ label: n, value: n }))}
                value={item.name}
                onChange={(val) => handleItemChange(item.id, "name", val)}
              />
              <Input
                label="Quantity"
                id={`quantity-${item.id}`}
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(val) =>
                  handleItemChange(item.id, "quantity", Number(val))
                }
                className="flex-1"
              />
              <Input
                label="Unit"
                id={`unit-${item.id}`}
                type="number"
                placeholder="Unit"
                value={item.unit}
                onChange={(val) =>
                  handleItemChange(item.id, "unit", Number(val))
                }
                className="flex-1"
              />
            </div>

            {/* Total & Status row for this section */}
            <div className="flex items-end justify-between gap-3 mt-1">
              <div className="flex gap-3 items-end">
                <Input
                  label="Total"
                  id={`total-${item.id}`}
                  type="text"
                  placeholder="Total Price"
                  value={item.quantity * item.unit}
                  readOnly
                  className="flex-1 max-w-[120px]"
                />
                <Select
                  label="Status"
                  id={`status-${item.id}`}
                  className="flex-1 max-w-[120px]"
                  options={statuses.map((s) => ({ label: s, value: s }))}
                  value={item.status}
                  onChange={(val) => handleItemChange(item.id, "status", val)}
                />
              </div>

              {/* Buttons */}
              <div className="flex  gap-2">
                {index === items.length - 1 ? (
                  <>
                    <Button
                      className="size-8 !bg-white !text-brand-9 !border !border-brand-9 grid place-items-center !p-0 rounded-full"
                      onClick={addItemRow}
                    >
                      <FiPlus />
                    </Button>
                    {items.length > 1 && (
                      <Button
                        className="size-8 !bg-white !text-red-500 !border !border-red-500 grid place-items-center !p-0 rounded-full"
                        onClick={() => removeItemRow(item.id)}
                      >
                        <FiMinus />
                      </Button>
                    )}
                  </>
                ) : (
                  <Button
                    className="size-8 !bg-white !text-red-500 !border !border-red-500 grid place-items-center !p-0 rounded-full"
                    onClick={() => removeItemRow(item.id)}
                  >
                    <FiMinus />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Submit Button */}
      <div className="fixed bottom-4 left-0 w-full flex justify-end bg-white/90 p-4">
        <Button onClick={handleSubmit}>Submit Order</Button>
      </div>
    </div>
  );
};

export default OrderPage;
