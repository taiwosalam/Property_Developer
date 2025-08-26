"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { propertiesReportTablefields } from "@/app/(nav)/reports/properties/data";

import { clientReportTableFields, reportsClientFilterOptionsWithDropdown } from "./data";

const PropertyDeveloperReferralReportVariantA = () => {
  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      id: `${index + 1}`,
      properties: `Bodija Property ${index + 1}`,

      branch: `Branch ${index + 1}`,
      branch_manager: `Adedimeji Oluwokan ${index + 1}`,
      date: `20/03/1${index}`,
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
          title="Installment Sales"
          newData={500}
          total={23}
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Outright Sales"
          newData={500}
          total={23}
          colorScheme={3}
        />
      </div>
      <FilterBar
        //azFilter
        isDateTrue
        exports
        pageTitle="referrals"
        aboutPageModalData={{
          title: "Referral",
          description:
            "This page contains a list of referrals on the platform.",
        }}
        searchInputPlaceholder="Search for sms"
        handleFilterApply={() => {}}
        filterOptionsMenu={reportsClientFilterOptionsWithDropdown}
        hasGridListToggle={false}
        exportHref="/reports/properties/export"
      />
      <section>
        <CustomTable
          fields={clientReportTableFields}
          data={generateTableData(15)}
          tableHeadClassName="h-[45px]"
        />
      </section>
    </div>
  );
};

export default PropertyDeveloperReferralReportVariantA;
