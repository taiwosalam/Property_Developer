

"use client";

import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { reportsSmsFilterOptionsWithDropdown } from "@/app/(nav)/reports/sms/data";
import EmptyList from "@/components/EmptyList/Empty-List";
import { clientReportTableFields, reportsClientFilterOptionsWithDropdown } from "./data";
import Pagination from "@/components/Pagination/pagination";

const PropertyDeveloperRequestReportVariantA = () => {
  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      id: `${index + 1}`,
      date: `2023-01-${index + 1}`,
      name: `Client ${index + 1}`,
      project_type: Math.random() > 0.5 ? "outright" : "installments",
      budget: `₦${index + 1}, 000`,
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
       
      </div>
      <FilterBar
        //azFilter
        isDateTrue
        exports
        pageTitle="Requests"
        aboutPageModalData={{
          title: "Referral",
          description: "This page contains a list of requests on the platform.",
        }}
        searchInputPlaceholder="Search for request"
        handleFilterApply={() => {}}
        filterOptionsMenu={reportsClientFilterOptionsWithDropdown}
        hasGridListToggle={false}
        exportHref="/reports/request/export"
        
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
            title="No Request Information Available Yet"
            body={
              <p>
                There are currently no Request records. This section will
                automatically update with Request information as it becomes
                available. These records are typically triggered by rent-related
                activities or other actions carried out through the platform.
                Once activity begins, all relevant Request logs will appear here.
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

export default PropertyDeveloperRequestReportVariantA;
