"use client";

import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { reportsSmsFilterOptionsWithDropdown } from "@/app/(nav)/reports/sms/data";
import EmptyList from "@/components/EmptyList/Empty-List";
import { clientReportTableFields, reportsClientFilterOptionsWithDropdown } from "./data";
import Pagination from "@/components/Pagination/pagination";

const PropertyDeveloperClientReportVariantA = () => {
  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      id: `${index + 1}`,
      client_id: `76878280${index + 1}`,

      name: `Client ${index + 1}`,
      contact_address: `Address ${index + 1}`,
      telephone: `Phone ${index + 1}`,
      email: `client${index + 1}@example.com`,
    }));
  };

  const tableData = generateTableData(15);

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total"
          newData={34}
          total={200}
          colorScheme={1}
        />
        <ManagementStatistcsCard
          title="Mobile"
          newData={34}
          total={200}
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Web"
          newData={24}
          total={200}
          colorScheme={3}
        />
      </div>
      <FilterBar
        //azFilter
        isDateTrue
        exports
        pageTitle="Owner"
        aboutPageModalData={{
          title: "client",
          description: "This page contains a list of owners on the platform.",
        }}
        searchInputPlaceholder="Search for sms"
        handleFilterApply={() => {}}
        filterOptionsMenu={reportsClientFilterOptionsWithDropdown}
        hasGridListToggle={false}
        exportHref="/reports/owner/export"
        
      />
      {tableData.length > 0 ? (
        <CustomTable
          fields={clientReportTableFields}
          data={tableData}
          tableHeadClassName="h-[45px]"
        />
      ) : (
        <section>
          <EmptyList
            noButton
            title="No Owners Information Available Yet"
            body={
              <p>
                There are currently no Owners records. This section will
                automatically update with Owner information as it becomes
                available. These records are typically triggered by rent-related
                activities or other actions carried out through the platform.
                Once activity begins, all relevant Owner logs will appear here.
              </p>
            }
          />
        </section>
      )}

      <Pagination
        className="!pb-3"
        totalPages={10}
        currentPage={1}
        onPageChange={() => {}}
      />
    </div>
  );
};

export default PropertyDeveloperClientReportVariantA;
