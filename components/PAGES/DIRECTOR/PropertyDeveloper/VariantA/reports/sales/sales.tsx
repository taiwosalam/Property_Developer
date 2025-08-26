"use client";

import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import EmptyList from "@/components/EmptyList/Empty-List";
import { clientReportTableFields, reportsClientFilterOptionsWithDropdown } from "./data";
import Pagination from "@/components/Pagination/pagination";

const PropertyDeveloperReportSalesVariantA = () => {
  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      unit_id: `${index + 1}`,
     property_name: `Alabata Road 3 Room 7${index + 1}`,

      clients: `Client ${index + 1}`,
      start_date: `01/01/2000`,
      end_date: `20/06/2005`,
      status: [Math.random() > 0.5 ? "Sold" : "Vacant"],
      annual_rent: `₦${index + 1},000`,
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
        pageTitle="Sales"
        aboutPageModalData={{
          title: "sales",
          description: "This page contains a list of sales on the platform.",
        }}
        searchInputPlaceholder="Search for sms"
        handleFilterApply={() => {}}
        filterOptionsMenu={reportsClientFilterOptionsWithDropdown}
        hasGridListToggle={false}
        exportHref="/reports/sales/export"
        
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
            title="No Sales Information Available Yet"
            body={
              <p>
                There are currently no Sales records. This section will
                automatically update with Sales information as it becomes
                available. These records are typically triggered by rent-related
                activities or other actions carried out through the platform.
                Once activity begins, all relevant Sales logs will appear here.
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

export default PropertyDeveloperReportSalesVariantA;
