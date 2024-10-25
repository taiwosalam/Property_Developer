"use client";
import Pagination from "@/components/Pagination/pagination";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsVehiclesFilterOptionsWithDropdown,
  vehicleRecordReportTableFields,
} from "./data";

const VehiclesRecordReport = () => {
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
      <FilterBar
        azFilter
        isDateTrue
        exports
        onStateSelect={() => {}}
        pageTitle="vehicle records"
        aboutPageModalData={{
          title: "vehicle records",
          description:
            "This page contains a list of vehicle records on the platform.",
        }}
        searchInputPlaceholder="Search for vehicle records"
        handleFilterApply={() => {}}
        filterOptions={[]}
        filterWithOptionsWithDropdown={reportsVehiclesFilterOptionsWithDropdown}
        hasGridListToggle={false}
        exportHref="/reports/vehicles-record/export"
      />
      <CustomTable
        fields={vehicleRecordReportTableFields}
        data={tableData}
        tableHeadClassName="h-[45px]"
      />
      <Pagination totalPages={2} currentPage={2} onPageChange={() => {}} />
    </div>
  );
};

export default VehiclesRecordReport;
