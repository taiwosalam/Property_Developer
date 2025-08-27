"use client";

import Pagination from "@/components/Pagination/pagination";
import { reportsClientFilterOptionsWithDropdown } from "../properties/data";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import { unitsReportTableFields } from "./data";
import FilterBar from "@/components/FIlterBar/FilterBar";

const UnitsReport = () => {
  const generateTableData = (numItems: number) => {
    const unitTypes = ["Apartment", "Flat", "Hotel"];

    return Array.from({ length: numItems }, (_, index) => ({
      id: `${index + 1}`,
      unit_id: `76280${index + 1}`,
      property_name: `Property ${index + 1}`,
      unit_name: `Unit ${index + 1}`,
      unit_type: unitTypes[Math.floor(Math.random() * unitTypes.length)],
      status: Math.random() > 0.5 ? "Vacant" : "Sold",
      amount: `client${index + 1}@example.com`,
    }));
  };

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total"
          newData={500}
          total={23}
          colorScheme={1}
        />
        <ManagementStatistcsCard
          title="Sold"
          newData={500}
          total={23}
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Vacant"
          newData={500}
          total={23}
          colorScheme={3}
        />
      </div>
      <FilterBar
        //azFilter
        isDateTrue
        exports
        pageTitle="Units"
        aboutPageModalData={{
          title: "Units",
          description: "This page contains a list of units on the platform.",
        }}
        searchInputPlaceholder="Search for units"
        handleFilterApply={() => {}}
        filterOptionsMenu={reportsClientFilterOptionsWithDropdown}
        hasGridListToggle={false}
        exportHref="/reports/units/export"
      />
      <section>
        <CustomTable
          fields={unitsReportTableFields}
          data={generateTableData(15)}
          tableHeadClassName="h-[45px]"
        />
      </section>

      <Pagination
        className="!pb-3"
        totalPages={10}
        currentPage={1}
        onPageChange={() => {}}
      />
    </div>
  );
};

export default UnitsReport;
