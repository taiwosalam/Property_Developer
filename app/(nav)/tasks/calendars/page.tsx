"use client";
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import FilterButton from "@/components/FilterButton/filter-button";
import CustomTable from "@/components/Table/table";
import Pagination from "@/components/Pagination/pagination";
import { Field } from "@/components/Table/types";

const CalendarPage = () => {
  const fields: Field[] = [
    { id: "1", label: "Date & Time", accessor: "date" },
    { id: "2", label: "Event", accessor: "event" },
    { id: "3", label: "creator", accessor: "creator" },
    { id: "4", label: "property name", accessor: "property_name" },
    { id: "5", label: "branch", accessor: "branch" },
    { id: "6", label: "account officer", accessor: "account_officer" },
  ];

  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      id: (index + 1).toString(),
      date: `28/01/2024 (0${index + 1}:30 pm)`,
      event: `EVENT ${index + 1}`,
      creator: `CREATOR ${index + 1}`,
      property_name: `PROPERTY ${index + 1}`,
      branch: `BRANCH ${index + 1}`,
      account_officer: `OFFICER ${index + 1}`,
    }));
  };

  const tableData = generateTableData(10);

  return (
    <div className="space-y-9">
      <div className="page-title-container">
        <PageTitle title="Calendar" />
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput placeholder="Search" />
          <Modal>
            <ModalTrigger asChild>
              <FilterButton />
            </ModalTrigger>
            <ModalContent>Nothing here</ModalContent>
          </Modal>
        </div>
      </div>
      <div className="page-title-container">
        <PageTitle title="up coming events" />
        <p className="text-text-label text-sm md:text-base font-medium">
          25TH - 28TH JAN 2024
        </p>
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
          textTransform: "uppercase",
        }}
        evenRowColor="#fff"
        oddRowColor="#FAFAFA"
      />
      <Pagination totalPages={2} currentPage={2} onPageChange={() => {}} />
    </div>
  );
};

export default CalendarPage;
