"use client";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsVehiclesFilterOptionsWithDropdown,
  vehicleRecordReportTableFields,
  vehiclesRecordTableData,
} from "./data";

const VehiclesRecordReport = () => {
  return (
    <div className="space-y-9">
      <FilterBar
        azFilter
        isDateTrue
        exports
        pageTitle="vehicle records"
        aboutPageModalData={{
          title: "vehicle records",
          description:
            "This page contains a list of vehicle records on the platform.",
        }}
        searchInputPlaceholder="Search for vehicle records"
        handleFilterApply={() => {}}
        filterOptionsMenu={reportsVehiclesFilterOptionsWithDropdown}
        hasGridListToggle={false}
        exportHref="/reports/vehicles-record/export"
      />
      <CustomTable
        fields={vehicleRecordReportTableFields}
        data={vehiclesRecordTableData}
        tableHeadClassName="h-[45px]"
      />
    </div>
  );
};

export default VehiclesRecordReport;
