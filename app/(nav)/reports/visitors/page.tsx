"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsVisitorsFilterOptionsWithDropdown,
  visitorsRequestTableFields,
  VisitorsRequestTableData,
} from "./data";
import { useState } from "react";
import type { DataItem } from "@/components/Table/types";
import { Modal, ModalContent } from "@/components/Modal/modal";
import VisitorRequestModal from "@/components/tasks/visitors-requests/visitor-request-modal";
import type { VisitorRequestModalProps } from "@/components/tasks/visitors-requests/types";

const Visitors = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState<VisitorRequestModalProps | null>(null);

  const handleTableItemClick = (record: DataItem) => {
    setSelectedRecord(record as VisitorRequestModalProps);
    setModalOpen(true);
  };

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Visitors Request"
          newData={34}
          total={657}
          colorScheme={1}
        />
        <ManagementStatistcsCard
          title="Checked In Visitors"
          newData={34}
          total={657}
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Check Out Visitors"
          newData={34}
          total={657}
          colorScheme={3}
        />
      </div>
      <FilterBar
        azFilter
        exports
        isDateTrue
        onStateSelect={() => {}}
        pageTitle="visitors request"
        aboutPageModalData={{
          title: "visitors request",
          description:
            "This page contains a list of visitors request on the platform.",
        }}
        searchInputPlaceholder="Search for visitors request"
        handleFilterApply={() => {}}
        filterOptions={[]}
        filterWithOptionsWithDropdown={reportsVisitorsFilterOptionsWithDropdown}
        hasGridListToggle={false}
        exportHref="/reports/visitors/export"
      />
      <CustomTable
        fields={visitorsRequestTableFields}
        data={VisitorsRequestTableData}
        tableHeadClassName="h-[45px]"
        handleSelect={handleTableItemClick}
      />
      <Modal
        state={{
          isOpen: modalOpen,
          setIsOpen: setModalOpen,
        }}
      >
        <ModalContent>
          <VisitorRequestModal
            id="12"
            pictureSrc="/empty/SampleLandlord.jpeg"
            status="completed"
            userName="Ajayi David"
            visitorName="Ajayi David"
            visitorPhoneNumber="09022312133"
            requestDate="12/02/2024"
            secretQuestion="What is your favorite color?"
            secretAnswer="Blue"
          />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Visitors;
