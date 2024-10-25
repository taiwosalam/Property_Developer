"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Pagination from "@/components/Pagination/pagination";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsCallsFilterOptionsWithDropdown,
  callRequestTablefields,
} from "./data";

const Call = () => {
  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      id: "123456789",
      branch: "Akinyele Branch",
      property_name: "Property Name",
      requester: "Ajayi David",
      request_date: "12/02/2024",
      resolve_date_time: "12/02/2024 - 03:30am",
    }));
  };

  const tableData = generateTableData(10);

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Call Request"
          newData={34}
          total={657}
          colorScheme={1}
        />
        <ManagementStatistcsCard
          title="Resolved"
          newData={34}
          total={657}
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Unresolved"
          newData={34}
          total={657}
          colorScheme={3}
        />
      </div>
      <FilterBar
        exports
        isDateTrue
        azFilter
        onStateSelect={() => {}}
        pageTitle="Calls Request"
        aboutPageModalData={{
          title: "calls request",
          description:
            "This page contains a list of calls request on the platform.",
        }}
        searchInputPlaceholder="Search for calls request"
        handleFilterApply={() => {}}
        filterOptions={[]}
        filterWithOptionsWithDropdown={reportsCallsFilterOptionsWithDropdown}
        exportHref="/reports/call/export"
        hasGridListToggle={false}
      />
      <CustomTable
        fields={callRequestTablefields}
        data={tableData}
        tableHeadClassName="h-[45px]"
      />
      <Pagination totalPages={2} currentPage={2} onPageChange={() => {}} />
    </div>
  );
};

export default Call;
