"use client";
import { useState } from "react";
import PageTitle from "@/components/PageTitle/page-title";
import FilterButton from "@/components/FilterButton/filter-button";
import SearchInput from "@/components/SearchInput/search-input";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Button from "@/components/Form/Button/button";
import CustomTable from "@/components/Table/table";
import type { Field, DataItem } from "@/components/Table/types";
import Pagination from "@/components/Pagination/pagination";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import VehicleRecordModal from "@/components/tasks/vehicles-record/vehicle-record-modal";
import CreateRecordModal from "@/components/tasks/vehicles-record/create-record-modal";
import type { VehicleRecord } from "@/components/tasks/vehicles-record/types";
import { VehicleRecordData } from "./data";

const VehiclesRecordPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<VehicleRecord | null>(
    null
  );

  const fields: Field[] = [
    { id: "1", accessor: "pictureSrc", isImage: true, picSize: 40 },
    { id: "2", label: "Name", accessor: "name" },
    { id: "3", label: "Plate Number", accessor: "plate_number" },
    { id: "4", label: "Guest / Visitor", accessor: "category" },
    { id: "5", label: "Last Update", accessor: "last_update" },
    { id: "6", label: "Status", accessor: "status" },
    { id: "7", accessor: "action" },
  ];

  const handleActionClick = (record: DataItem) => {
    setSelectedRecord(record as VehicleRecord);
    setModalOpen(true);
  };

  return (
    <div className="space-y-9">
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard title="Check In" newData={657} total={34} />
          <ManagementStatistcsCard title="Check Out" newData={657} total={34} />
          <ManagementStatistcsCard title="Pending" newData={657} total={34} />
        </div>
        <Modal>
          <ModalTrigger asChild>
            <Button type="button" className="page-header-button">
              + Create New Record
            </Button>
          </ModalTrigger>
          <ModalContent>
            <CreateRecordModal />
          </ModalContent>
        </Modal>
      </div>
      <div className="page-title-container">
        <PageTitle title="Vehicles Record" />
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput placeholder="Search for vehicle record" />
          <FilterButton />
        </div>
      </div>
      <CustomTable
        fields={fields}
        data={VehicleRecordData}
        evenRowColor="#fff"
        oddRowColor="#EFF6FF"
        tableHeadClassName="bg-brand-5 h-[76px]"
        tableHeadCellSx={{
          fontSize: 16,
          color: "#050901",
          fontWeight: 500,
          border: "none",
          textAlign: "left",
        }}
        tableBodyCellSx={{
          fontWeight: 500,
          fontSize: 15,
          color: "#050901",
          border: "none",
          textAlign: "left",
          padding: "18px 16px",
        }}
        onActionClick={handleActionClick}
      />
      <Modal
        state={{
          isOpen: modalOpen,
          setIsOpen: setModalOpen,
        }}
      >
        <ModalContent>
          <VehicleRecordModal {...(selectedRecord as VehicleRecord)} />
        </ModalContent>
      </Modal>
      <Pagination
        totalPages={3}
        currentPage={1}
        onPageChange={() => alert("function not implemented!")}
      />
    </div>
  );
};

export default VehiclesRecordPage;
