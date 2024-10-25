"use client";
import { Modal, ModalContent } from "@/components/Modal/modal";
import { useState } from "react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Pagination from "@/components/Pagination/pagination";
import CustomTable from "@/components/Table/table";
import EmailModal, { type EmailRecord } from "@/components/reports/email-modal";
import type { DataItem } from "@/components/Table/types";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsEmailFilterOptionsWithDropdown,
  emailTablefields,
} from "./data";

const EmailReport = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSMS, setSelectedSMS] = useState<EmailRecord | null>(null);

  const handleActionClick = (record: DataItem) => {
    setSelectedSMS(record as EmailRecord);
    setModalOpen(true);
  };

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
          colorScheme={1}
        />
      </div>
      <FilterBar
        azFilter
        isDateTrue
        onStateSelect={() => {}}
        pageTitle="Email"
        aboutPageModalData={{
          title: "Email",
          description: "This page contains a list of Email on the platform.",
        }}
        searchInputPlaceholder="Search for Email"
        handleFilterApply={() => {}}
        filterOptions={[]}
        filterWithOptionsWithDropdown={reportsEmailFilterOptionsWithDropdown}
        hasGridListToggle={false}
        exportHref="/reports/email/export"
      />
      <CustomTable
        fields={emailTablefields}
        data={tableData}
        tableHeadClassName="h-[45px]"
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
