"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Pagination from "@/components/Pagination/pagination";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsVisitorsFilterOptionsWithDropdown,
  visitorsRequestTableFields,
} from "./data";

const Visitors = () => {
  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      id: "123456789",
      branch: "Akinyele Branch",
      property_name: "Property Name",
      requester: "Ajayi David",
      visitor: "Ajayi David",
      date: "12/02/2024",
      check_in: "08:30am",
      check_out: "08:30am",
    }));
  };

  const tableData = generateTableData(10);

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Visitors Request"
          newData={34}
          total={657}
          colorScheme={1}
        />
        <ManagementStatistcsCard
          title="Checked In Visitors"
          newData={34}
          total={657}
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Check Out Visitors"
          newData={34}
          total={657}
          colorScheme={3}
        />
      </div>
      <FilterBar
        azFilter
        exports
        isDateTrue
        onStateSelect={() => {}}
        pageTitle="visitors request"
        aboutPageModalData={{
          title: "visitors request",
          description:
            "This page contains a list of visitors request on the platform.",
        }}
        searchInputPlaceholder="Search for visitors request"
        handleFilterApply={() => {}}
        filterOptions={[]}
        filterWithOptionsWithDropdown={reportsVisitorsFilterOptionsWithDropdown}
        hasGridListToggle={false}
        exportHref="/reports/visitors/export"
      />
      <CustomTable
        fields={visitorsRequestTableFields}
        data={tableData}
        tableHeadClassName="h-[45px]"
      />
      <Pagination totalPages={2} currentPage={2} onPageChange={() => {}} />
    </div>
  );
};

export default Visitors;
