"use client";
import FilterBar from "@/components/FIlterBar/FilterBar";
import Button from "@/components/Form/Button/button";
import { PlusIcon } from "lucide-react";
import { AddNewItems, InventorySectionComp } from "./category/components";
import { inventoryData } from "./category/data";
import { useState } from "react";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import LogbookModalDemo from "../hrm/logbook/LogbookModal";
const Category = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <section>
      <div className="button flex justify-end">
        <Modal
          state={{
            isOpen: isModalOpen,
            setIsOpen: setIsModalOpen,
          }}
        >
          <ModalTrigger asChild>
            <Button className="bg-brand-9 flex items-center gap-2 text-white">
              <PlusIcon className="size-5" /> Add Item
            </Button>
          </ModalTrigger>
          <ModalContent>
            <AddNewItems />
          </ModalContent>
        </Modal>
      </div>

      <div className="items py-8">
        <FilterBar
          isDateTrue
          hasGridListToggle={false}
          pageTitle="Category"
          aboutPageModalData={{
            title: "Applications",
            description:
              "This page contains a list of Applications on the platform.",
            video: "",
          }}
          searchInputPlaceholder="Search application"
          handleFilterApply={() => {}}
          // filterOptionsMenu={DocumentssFilterOptionsWithDropdown}
        />
      </div>

      <div className="p-6 space-y-6">
        {inventoryData.map((section) => (
          <InventorySectionComp key={section.id} section={section} />
        ))}
      </div>
    </section>
  );
};
export default Category;
