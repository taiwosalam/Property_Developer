import FilterBar from "@/components/FIlterBar/FilterBar";
import Button from "@/components/Form/Button/button";
import UserCard from "@/components/Management/landlord-and-tenant-card";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { PlusIcon } from "@/public/icons/icons";
import UserCardList, { SupplierCreateModal } from "./suppliers/card";
import Pagination from "@/components/Pagination/pagination";
import { useState } from "react";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { ManageInventoryModal } from "./inventory/cards";

const Suppliers = () => {
  const cardData = [
    { title: "Total Users", total: 120, newData: 25, colorScheme: 1 },
    { title: "Web Users", total: 80, newData: 10, colorScheme: 2 },
    { title: "Mobile Users", total: 90, newData: 30, colorScheme: 3 },
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <section>
      <div className="itsms flex justify-between items-center">
        <div className="flex flex-wrap gap-4">
          {cardData.map((card, index) => (
            <ManagementStatistcsCard
              key={index}
              title={card.title}
              total={card.total}
              newData={card.newData}
              colorScheme={card.colorScheme as 1}
            />
          ))}
        </div>
        <Modal
          state={{
            isOpen: isModalOpen,
            setIsOpen: setIsModalOpen,
          }}
        >
          <ModalTrigger asChild>
            <Button className="bg-brand-9 flex items-center gap-2">
              <PlusIcon /> Create New Supplier
            </Button>
          </ModalTrigger>
          <ModalContent>
            <SupplierCreateModal />
          </ModalContent>
        </Modal>
      </div>

      <div className="items py-8">
        <FilterBar
          isDateTrue
          hasGridListToggle={false}
          pageTitle="Suppliers"
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

      <div className="users">
        <UserCardList />
        <Pagination
          totalPages={8}
          currentPage={4}
          onPageChange={() => console.log("change")}
        />
      </div>
    </section>
  );
};
export default Suppliers;
