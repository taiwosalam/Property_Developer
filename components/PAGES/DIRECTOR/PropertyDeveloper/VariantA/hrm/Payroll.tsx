import AccountStatsCard from "@/components/Accounting/account-stats-card";
import FilterBar from "@/components/FIlterBar/FilterBar";
import Button from "@/components/Form/Button/button";
import { PlusBoldIcon, PlusIcon } from "@/public/icons/icons";
import { statsData } from "./payroll/data";
import CustomTable from "@/components/Table/table";
import StaffTable, { CalendarAndStaffPanel } from "./payroll/card";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { useState } from "react";
import Pagination from "@/components/Pagination/pagination";

const Payroll = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <section>
      <div className="flex justify-end">
        <Modal
          state={{
            isOpen: isModalOpen,
            setIsOpen: setIsModalOpen,
          }}
        >
          <ModalTrigger asChild>
            <Button className="bg-brand-9 flex items-center gap-2 text-white">
              Create Logbook
            </Button>
          </ModalTrigger>
          <ModalContent>
            <CalendarAndStaffPanel />
          </ModalContent>
        </Modal>
      </div>

      <div className="items py-8">
        <FilterBar
          isDateTrue
          hasGridListToggle={false}
          pageTitle="Payroll"
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

      <div className="overflow-x-auto no-scrollbar py-4">
        <div className="flex no-scrollbar gap-4 min-w-max">
          {statsData.map((card) => (
            <AccountStatsCard
              key={card.id}
              variant={card.variant}
              title={card.title}
              balance={card.balance}
              percentage={card.percentage}
              trendDirection={card.trendDirection}
              timeRangeLabel={card.timeRangeLabel}
              className="min-w-[250px]" // ensures cards have a minimum width for horizontal scroll
            />
          ))}
        </div>
      </div>

      <StaffTable />

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
export default Payroll;
