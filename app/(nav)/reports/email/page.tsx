"use client";
import { Modal, ModalContent } from "@/components/Modal/modal";
import { useState } from "react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import FilterButton from "@/components/FilterButton/filter-button";
import Pagination from "@/components/Pagination/pagination";
import CustomTable from "@/components/Table/table";
import EmailModal, { type EmailRecord } from "@/components/reports/email-modal";
import type { Field, DataItem } from "@/components/Table/types";

const EmailReport = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSMS, setSelectedSMS] = useState<EmailRecord | null>(null);

  const handleActionClick = (record: DataItem) => {
    setSelectedSMS(record as EmailRecord);
    setModalOpen(true);
  };
  const fields: Field[] = [
    { id: "0", label: "S/N", accessor: "S/N" },
    { id: "1", label: "User ID", accessor: "user_id" },
    { id: "3", label: "Branch", accessor: "branch" },
    {
      id: "2",
      label: "Client Name",
      accessor: "client_name",
    },
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
      branch: `Branch ${index + 1}`,
      date: "12/12/12",
      time: "3:20pm",
      from: "user@gmail.com",
      to: "client@gmail.com",
      headline: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      message:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, quisquam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, quisquam.",
    }));
  };

  const tableData = generateTableData(10);

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Emails"
          newData={23}
          total={200}
        />
      </div>
      <div className="page-title-container">
        <PageTitle title="Email" />
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput placeholder="Search for email" />
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
          <EmailModal {...(selectedSMS as EmailRecord)} />
        </ModalContent>
      </Modal>
      <Pagination totalPages={2} currentPage={2} onPageChange={() => {}} />
    </div>
  );
};

export default EmailReport;
