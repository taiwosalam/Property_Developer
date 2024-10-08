"use client";
// import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import FilterButton from "@/components/FilterButton/filter-button";
import Pagination from "@/components/Pagination/pagination";
import CustomTable from "@/components/Table/table";
import type { Field } from "@/components/Table/types";

const SMSReport = () => {
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
      user_id: `User ${index + 1}`,
      client_name: `Client ${index + 1}`,
      branch: `Branch ${index + 1}`,
      date: "12/12/12",
      time: "3:20pm",
    }));
  };

  const tableData = generateTableData(10);

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard title="Total Emails" newData={23} total={200} />
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
      />
      <Pagination totalPages={2} currentPage={2} onPageChange={() => {}} />
    </div>
  );
};

export default SMSReport;
