import Button from "@/components/Form/Button/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { PlusIcon } from "lucide-react";
import { AddNewItems } from "./category/components";
import { useState } from "react";
import FilterBar from "@/components/FIlterBar/FilterBar";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManageInventoryForm, {
  InventoryCard,
  ManageInventoryModal,
} from "./inventory/cards";
import { mockInventoryData } from "./inventory/data";
import Pagination from "@/components/Pagination/pagination";

const Inventory = () => {
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
              <PlusIcon className="size-5" /> Add Inventory
            </Button>
          </ModalTrigger>
          <ModalContent>
            <ManageInventoryModal onDelete={() => console.log("hello there")} />
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

      <AutoResizingGrid gap={30} minWidth={400}>
        {mockInventoryData.map((data) => (
          <InventoryCard
            key={data.id}
            data={data}
            onManage={(d) => console.log("Manage clicked:", d)}
            onPreview={(id) => console.log("Preview clicked:", id)}
          />
        ))}
      </AutoResizingGrid>
      <Pagination currentPage={3} onPageChange={() => {}} totalPages={10} />
    </section>
  );
};
export default Inventory;
