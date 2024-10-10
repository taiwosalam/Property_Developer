"use client";
import { useState } from "react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { Modal, ModalContent } from "@/components/Modal/modal";
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import FilterButton from "@/components/FilterButton/filter-button";
import Pagination from "@/components/Pagination/pagination";
import CustomTable from "@/components/Table/table";
import type { Field, DataItem } from "@/components/Table/types";
import UndoModal from "@/components/reports/undo-modal";

const Undo = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const handleActionClick = (event: DataItem) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };
  const fields: Field[] = [
    { id: "0", label: "S/N", accessor: "S/N" },
    { id: "1", label: "Event Deleted", accessor: "event_deleted" },
    {
      id: "2",
      label: "Category",
      accessor: "category",
    },
    { id: "3", label: "Branch", accessor: "branch" },
    {
      id: "5",
      label: "Deleted By",
      accessor: "deleted_by",
    },
    { id: "6", label: "Date Deleted", accessor: "date_deleted" },
    { id: "7", label: "Time", accessor: "time" },
    { id: "8", accessor: "action" },
  ];

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
        <ManagementStatistcsCard title="Total" newData={34} total={657} />
      </div>
      <div className="page-title-container">
        <PageTitle title="Undo" />
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput placeholder="Search for Undo" />
          <FilterButton />
        </div>
      </div>
      <CustomTable
        fields={fields}
        data={tableData}
        tableHeadClassName="bg-brand-9 h-[45px]"
        tableHeadCellSx={{
          color: "#EFF6FF",
          fontWeight: 500,
          border: "none",
          textAlign: "left",
          fontSize: "14px",
        }}
        tableBodyCellSx={{
          border: "none",
          textAlign: "left",
          fontWeight: 500,
          color: "#050901",
          fontSize: "14px",
        }}
        evenRowColor="#fff"
        oddRowColor="#FAFAFA"
        onActionClick={handleActionClick}
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
      <Pagination totalPages={20} currentPage={10} onPageChange={() => {}} />
    </div>
  );
};

export default Undo;
