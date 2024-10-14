"use client";
import { useState } from "react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import FilterButton from "@/components/FilterButton/filter-button";
import Pagination from "@/components/Pagination/pagination";
import CustomTable from "@/components/Table/table";
import type { Field, DataItem } from "@/components/Table/types";
import SMSModal, { type SMSRecord } from "@/components/reports/sms-modal";
import { Modal, ModalContent } from "@/components/Modal/modal";
import FilterBar from "@/components/FIlterBar/FilterBar";

const SMSReport = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSMS, setSelectedSMS] = useState<SMSRecord | null>(null);

  const handleActionClick = (record: DataItem) => {
    setSelectedSMS(record as SMSRecord);
    setModalOpen(true);
  };

  const fields: Field[] = [
    { id: "0", label: "S/N", accessor: "S/N" },
    { id: "1", label: "User ID", accessor: "user_id" },
    {
      id: "2",
      label: "Client Name",
      accessor: "client_name",
    },
    { id: "3", label: "Phone Number", accessor: "phone_number" },
    {
      id: "5",
      label: "Date",
      accessor: "date",
    },
    { id: "8", label: "Time", accessor: "time" },
    { id: "9", accessor: "action" },
  ];

  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      id: `${index + 1}`,
      user_id: `User ${index + 1}`,
      client_name: `Client ${index + 1}`,
      phone_number: `Phone ${index + 1}`,
      date: "12/12/12",
      time: "3:20pm",
      message: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    }));
  };

  const tableData = generateTableData(10);

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard title="Total SMS" newData={23} total={200} />
      </div>
      <FilterBar azFilter isDateTrue onStateSelect={() => { }} pageTitle="sms" aboutPageModalData={
        { title: "sms", description: "This page contains a list of sms on the platform." }
      } searchInputPlaceholder="Search for sms" handleFilterApply={() => { }} filterOptions={[]} filterWithOptionsWithDropdown={[]} />
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
          <SMSModal {...(selectedSMS as SMSRecord)} />
        </ModalContent>
      </Modal>
      <Pagination totalPages={2} currentPage={2} onPageChange={() => { }} />
    </div>
  );
};

export default SMSReport;
