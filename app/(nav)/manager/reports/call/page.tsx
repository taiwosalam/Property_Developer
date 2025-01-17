"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsCallsFilterOptionsWithDropdown,
  callRequestTablefields,
  CallRequestTableData,
} from "./data";

const Call = () => {
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
        pageTitle="Calls Request"
        aboutPageModalData={{
          title: "calls request",
          description:
            "This page contains a list of calls request on the platform.",
        }}
        searchInputPlaceholder="Search for calls request"
        handleFilterApply={() => {}}
        filterOptionsMenu={reportsCallsFilterOptionsWithDropdown}
        exportHref="/reports/call/export"
        hasGridListToggle={false}
      />
      <CustomTable
        fields={callRequestTablefields}
        data={CallRequestTableData}
        tableHeadClassName="h-[45px]"
      />
    </div>
  );
};

export default Call;
