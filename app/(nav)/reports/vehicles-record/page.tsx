"use client";
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import FilterButton from "@/components/FilterButton/filter-button";
import ExportButton from "@/components/reports/export-button";
import Pagination from "@/components/Pagination/pagination";
import CustomTable from "@/components/Table/table";
import type { Field } from "@/components/Table/types";
import FilterBar from "@/components/FIlterBar/FilterBar";

const VehiclesRecordReport = () => {
  const fields: Field[] = [
    { id: "0", label: "S/N", accessor: "S/N" },
    { id: "1", label: "ID", accessor: "id" },
    {
      id: "2",
      label: "Full Name",
      accessor: "full_name",
    },
    { id: "3", label: "Plate Number", accessor: "plate_number" },
    { id: "4", label: "Guest / Visitor", accessor: "guest_visitor" },
    { id: "5", label: "Check In", accessor: "check_in" },
    { id: "6", label: "Check Out", accessor: "check_out" },
    { id: "7", label: "Passenger In", accessor: "passenger_in" },
    { id: "8", label: "Passenger Out", accessor: "passenger_out" },
    { id: "9", label: "Status", accessor: "status" },
  ];

  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      id: (index + 1).toString(),
      full_name: `full_name ${index + 1}`,
      plate_number: `plate_number ${index + 1}`,
      guest_visitor: index % 2 === 0 ? "Guest" : "Visitor",
      check_in: `check_in ${index + 1}`,
      check_out: `check_out ${index + 1}`,
      passenger_in: `${index + 1} People`,
      passenger_out: `${index + 1} People`,
      status: index % 2 === 0 ? "Completed" : "Pending",
    }));
  };

  const tableData = generateTableData(10);

  return (
    <div className="space-y-9">
      <FilterBar azFilter isDateTrue exports onStateSelect={() => { }} pageTitle="vehicle records" aboutPageModalData={
        { title: "vehicle records", description: "This page contains a list of vehicle records on the platform." }
      } searchInputPlaceholder="Search for vehicle records" handleFilterApply={() => { }} filterOptions={[]} filterWithOptionsWithDropdown={[]} />
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
      <Pagination totalPages={2} currentPage={2} onPageChange={() => { }} />
    </div>
  );
};

export default VehiclesRecordReport;
