"use client";
import { useState } from "react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { Modal, ModalContent } from "@/components/Modal/modal";
import CustomTable from "@/components/Table/table";
import type { DataItem } from "@/components/Table/types";
import UndoModal from "@/components/reports/undo-modal";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsUndoFilterOptionsWithDropdown,
  undoRequestTableFields,
} from "./data";

const Undo = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const handleItemSelect = (event: DataItem) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  // Design Purpose
  const generateTableData = () => {
    const events = [
      { event_deleted: "Landlord/Landlady Profile", category: "Management" },
      { event_deleted: "Branch Details", category: "Management" },
      { event_deleted: "Staff Profile", category: "Management" },
      { event_deleted: "Inventory", category: "Management" },
      { event_deleted: "Property", category: "Task" },
      { event_deleted: "Complaint", category: "Task" },
      { event_deleted: "Service Provider", category: "Task" },
      { event_deleted: "Examine", category: "Task" },
      { event_deleted: "Maintenance", category: "Task" },
      { event_deleted: "Announcement", category: "Task" },
      { event_deleted: "Invoice", category: "Accounting" },
      { event_deleted: "Expenses", category: "Accounting" },
      { event_deleted: "Disbursement", category: "Accounting" },
      { event_deleted: "Examine Ajibode Apartment", category: "Examine" },
      { event_deleted: "Tenancy Agreement", category: "Documents" },
      { event_deleted: "Personalized Domain", category: "Settings" },
    ];

    return events.map((event, index) => ({
      ...event,
      branch: "Akinyele Branch",
      deleted_by: "Ajadi David",
      date_deleted: "12/02/2024",
      time: "03:30am",
    }));
  };

  const tableData = generateTableData();

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total"
          newData={34}
          total={657}
          colorScheme={1}
        />
      </div>
      <FilterBar
        azFilter
        isDateTrue
        pageTitle="undo"
        aboutPageModalData={{
          title: "undo",
          description: "This page contains a list of undo on the platform.",
        }}
        searchInputPlaceholder="Search for undo"
        handleFilterApply={() => {}}
        filterOptionsMenu={reportsUndoFilterOptionsWithDropdown}
        hasGridListToggle={false}
      />
      <CustomTable
        fields={undoRequestTableFields}
        data={tableData}
        tableHeadClassName="h-[45px]"
        handleSelect={handleItemSelect}
      />
      <Modal
        state={{
          isOpen: modalOpen,
          setIsOpen: setModalOpen,
        }}
      >
        <ModalContent>
          <UndoModal
            event={selectedEvent?.event_deleted}
            // eventData={selectedEvent}
          />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Undo;
