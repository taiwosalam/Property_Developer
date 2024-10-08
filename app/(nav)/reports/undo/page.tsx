"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
// import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import FilterButton from "@/components/FilterButton/filter-button";
import ExportButton from "@/components/reports/export-button";
import Pagination from "@/components/Pagination/pagination";
import CustomTable from "@/components/Table/table";
import type { Field } from "@/components/Table/types";

const Undo = () => {
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

  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      event_deleted: 'Landlord/Landlady Profile',
      category: index < 5 ? "management" : "Task",
      branch: 'Akinyele Branch',
      deleted_by: 'Ajadi David',
      date_deleted: '12/02/2024',
      time: '03:30am',
    }));
  };

  const tableData = generateTableData(10);

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
      />
      <Pagination totalPages={2} currentPage={2} onPageChange={() => {}} />
    </div>
  );
};

export default Undo;
