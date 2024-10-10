"use client";
// import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import FilterButton from "@/components/FilterButton/filter-button";
import ExportButton from "@/components/reports/export-button";
import Pagination from "@/components/Pagination/pagination";
import CustomTable from "@/components/Table/table";
import type { Field } from "@/components/Table/types";

const TrackingReport = () => {
  const fields: Field[] = [
    { id: "0", label: "S/N", accessor: "S/N" },
    { id: "1", label: "Username", accessor: "username" },
    {
      id: "2",
      label: "Page Visited",
      accessor: "page_visited",
    },
    { id: "3", label: "Action Taken", accessor: "action_taken" },
    {
      id: "5",
      label: "IP Address",
      accessor: "ip_address",
    },
    { id: "6", label: "Location", accessor: "location" },
    { id: "7", label: "Date", accessor: "date" },
    { id: "8", label: "Time", accessor: "time" },
  ];

  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      username: `User ${index + 1}`,
      page_visited: `Landlord Page ${index + 1}`,
      action_taken: `Login successful ${index + 1}`,
      ip_address: `IP ${index + 1}`,
      location: `Location ${index + 1}`,
      date: "12/12/12",
      time: "3:20pm",
    }));
  };

  const tableData = generateTableData(10);

  return (
    <div className="space-y-9">
      <div className="page-title-container">
        <PageTitle title="Tracking" />
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput placeholder="Search for audit trail" />
          <FilterButton />
          <ExportButton type="pdf" href="/reports/tracking/export" />
          <ExportButton type="csv" />
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

export default TrackingReport;
