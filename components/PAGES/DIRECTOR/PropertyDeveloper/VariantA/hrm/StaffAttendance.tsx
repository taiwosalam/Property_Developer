import Button from "@/components/Form/Button/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { useState } from "react";
import { CalendarAndStaffPanel } from "./payroll/card";
import FilterBar from "@/components/FIlterBar/FilterBar";
import StaffAttendanceSystem from "./payroll/logbook";

const StaffAttendance = () => {
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

      <div className="py-4">
        <StaffAttendanceSystem />
      </div>
    </section>
  );
};
export default StaffAttendance;
