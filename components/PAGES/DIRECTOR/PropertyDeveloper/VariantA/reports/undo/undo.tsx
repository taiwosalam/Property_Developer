"use client";

import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import EmptyList from "@/components/EmptyList/Empty-List";
import {
  clientReportTableFields,
  reportsClientFilterOptionsWithDropdown,
} from "./data";
import Pagination from "@/components/Pagination/pagination";
import { Modal, ModalContent } from "@/components/Modal/modal";
import { useState } from "react";
import { DataItem } from "@/components/Table/types";
import UndoModalPreset from "@/components/reports/undo-modal-preset";
import UndoModal from "@/components/reports/undo-modal";
import TableMenu from "@/components/Table/table-menu";

interface UndoRecord {
  id: number;
  event_deleted: string;
  category: string;
  branch: string;
  deleted_by: string;
  date_deleted: string;
  time: string;
}
const PropertyDeveloperReportUndoVariantA = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<UndoRecord | null>(null);
  const [undoItem, setUndoItem] = useState<UndoRecord | null>(null);
  const handleMenuOpen = (item: DataItem, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setSelectedItem(item as UndoRecord);
    setAnchorEl(e.currentTarget);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      id: index + 1,
      event_deleted: `${index + 1}`,
      category: Math.random() < 0.5 ? "Management" : "Accounting",

      branch: `Bodija Branch ${index + 1}`,
      deleted_by: `Ajadi Joseph ${index + 1}`,
      date_deleted: `01/01/2000`,
      time: `12:00 PM`,
    }));
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleTableItemClick = (record: DataItem) => {
    // Map DataItem to UndoRecord, adjust field names as necessary
    const undoRecord: UndoRecord = {
      id: (record as any).id ?? 0,
      event_deleted: (record as any).event_deleted ?? "",
      category: (record as any).category ?? "",
      branch: (record as any).branch ?? "",
      deleted_by: (record as any).deleted_by ?? "",
      date_deleted: (record as any).date_deleted ?? "",
      time: (record as any).time ?? "",
    };
    setUndoItem(undoRecord);
    // Remove or adjust the following lines if setSelectedEmailId and setModalOpen are not defined
    // if (record.id) {
    //   setSelectedEmailId(Number(record.email_id));
    // }
    // setModalOpen(true);
    setIsOpen(true);
  };

  const tableData = generateTableData(15);

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total"
          newData={34}
          total={200}
          colorScheme={1}
        />
      </div>
      <FilterBar
        //azFilter
        isDateTrue
        exports
        pageTitle="Undo"
        aboutPageModalData={{
          title: "undo",
          description:
            "This page contains a list of undo actions on the platform.",
        }}
        searchInputPlaceholder="Search for undo items"
        handleFilterApply={() => {}}
        filterOptionsMenu={reportsClientFilterOptionsWithDropdown}
        hasGridListToggle={false}
        exportHref="/reports/undo/export"
      />
      {tableData.length > 0 ? (
        <section>
          <CustomTable
            fields={clientReportTableFields}
            data={tableData}
            handleSelect={handleTableItemClick}
            tableHeadClassName="h-[45px]"
            
          />
        </section>
      ) : (
        <section>
          <EmptyList
            noButton
            title="No Undo Information Available Yet"
            body={
              <p>
                There are currently no Undo records. This section will
                automatically update with Undo information as it becomes
                available. These records are typically triggered by rent-related
                activities or other actions carried out through the platform.
                Once activity begins, all relevant Undo logs will appear here.
              </p>
            }
          />
        </section>
      )}

      <Pagination
        className="!pb-3"
        totalPages={10}
        currentPage={1}
        onPageChange={() => {}}
      />

      <Modal
        state={{
          isOpen,
          setIsOpen,
        }}
      >
        <ModalContent>
          <UndoModal event="Landlord/Landlady Profile" />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PropertyDeveloperReportUndoVariantA;
