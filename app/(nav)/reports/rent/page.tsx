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

const RentReport = () => {
  const fields: Field[] = [
    { id: "0", label: "S/N", accessor: "S/N" },
    { id: "1", label: "Unit ID", accessor: "unit_id" },
    {
      id: "2",
      label: "Property Name",
      accessor: "property_name",
    },
    { id: "3", label: "Tenant / Occupant", accessor: "tenant_name" },
    {
      id: "5",
      label: "Start Date",
      accessor: "start_date",
    },
    { id: "6", label: "End Date", accessor: "end_date" },
    { id: "7", label: "Status", accessor: "status" },
    { id: "8", label: "First Deposit", accessor: "first_deposit" },
  ];

  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      unit_id: (index + 1).toString(),
      property_name: `Property ${index + 1}`,
      tenant_name: `Tenant ${index + 1}`,
      unit_description: `unit desc ${index + 1}`,
      start_date: "12/12/12",
      end_date: "12/12/12",
      status: index % 2 === 0 ? "vacant" : "occupied",
      first_deposit: `2,600,800`,
    }));
  };

  const tableData = generateTableData(10);

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Rent / Due"
          newData={23}
          total={200}
        />
      </div>
      <div className="page-title-container">
        <PageTitle title="Rent / Due Roll" />
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput placeholder="Search for Rent Roll" />
          <FilterButton />
          <ExportButton type="pdf" href="/reports/rent/export" />
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

export default RentReport;
