"use client";

import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { reportsSmsFilterOptionsWithDropdown } from "@/app/(nav)/reports/sms/data";
import EmptyList from "@/components/EmptyList/Empty-List";
import {
  clientReportTableFields,
  reportsClientFilterOptionsWithDropdown,
} from "./data";
import Pagination from "@/components/Pagination/pagination";

const PropertyDeveloperItemRequestReportVariantA = () => {
  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      id: `${index + 1}`,
      request_id: `5778723${index + 1}`,
      staff_name: `Adelakun Tunde ${index + 1}`,
      categories: `Food, Drink, Beverages`,
      units: `KG`,
      quantity: Math.floor(Math.random() * 100),
      amount: `₦${(index + 1) * 1000}`,
      status: Math.random() > 0.5 ? "Completed" : "Cancelled",
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
          title="Completed"
          newData={34}
          total={200}
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Cancelled"
          newData={24}
          total={200}
          colorScheme={3}
        />
      </div>
      <FilterBar
        //azFilter
        isDateTrue
        exports
        pageTitle="Item Requests"
        aboutPageModalData={{
          title: "Item Requests",
          description:
            "This page contains a list of item requests on the platform.",
        }}
        searchInputPlaceholder="Search for item requests"
        handleFilterApply={() => {}}
        filterOptionsMenu={reportsClientFilterOptionsWithDropdown}
        hasGridListToggle={false}
        exportHref="/reports/item-request/export"
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
            title="No Item Requests Information Available Yet"
            body={
              <p>
                There are currently no Item Requests records. This section will
                automatically update with Item Requests information as it becomes
                available. These records are typically triggered by rent-related
                activities or other actions carried out through the platform.
                Once activity begins, all relevant Item Requests logs will appear
                here.
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

export default PropertyDeveloperItemRequestReportVariantA;
