"use client";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import { EmployeeCard } from "@/components/HRM/LogbookCard";
import { employees } from "./logbook/data";
import FilterBar from "@/components/FIlterBar/FilterBar";
import Button from "@/components/Form/Button/button";
import { PlusIcon } from "lucide-react";
import Pagination from "@/components/Pagination/pagination";
import LogbookModalDemo from "./logbook/LogbookModal";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { useState } from "react";

const Logbook = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <section>
      <div className=" py-3 pt-8 sm:pt-2 flex justify-end">
        <Modal
          state={{
            isOpen: isModalOpen,
            setIsOpen: setIsModalOpen,
          }}
        >
          <ModalTrigger asChild>
            <Button className="bg-brand-9 flex items-center gap-2 text-white">
              <PlusIcon className="size-5" /> Create Logbook
            </Button>
          </ModalTrigger>
          <ModalContent>
            <LogbookModalDemo
              onClose={() => {
                setIsModalOpen(false);
              }}
            />
          </ModalContent>
        </Modal>
      </div>
      <div className="py-4">
        <FilterBar
          isDateTrue
          hasGridListToggle={false}
          pageTitle="Log Book"
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

      <div className="cards">
        <AutoResizingGrid minWidth={200}>
          {employees.map((employee, index) => {
            return (
              <EmployeeCard
                action={() => console.log("hello")}
                key={index}
                {...employee}
              />
            );
          })}
        </AutoResizingGrid>
      </div>

      <div className="pagination">
        <Pagination
          className="!pb-3 "
          totalPages={10}
          currentPage={1}
          onPageChange={() => {}}
        />
      </div>
    </section>
  );
};
export default Logbook;
