"use client";

import BackButton from "@/components/BackButton/back-button";
import FilterBar from "@/components/FIlterBar/FilterBar";
import CustomTable from "@/components/Table/table";
import { useParams } from "next/navigation";
import { trackingTableFields } from "../data";

const UserTrackingPage = () => {
  const { userId } = useParams();
  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      username: `User ${index + 1}`,
      page_visited: `Landlord Page ${index + 1}`,
      action_taken: `Login successful ${index + 1}`,
      ip_address: `IP ${index + 1}`,
      location: `Location ${index + 1}`,
      date: "12/12/12",
      time: "3:20pm",
    }));
  };
  const tableData = generateTableData(10);

  return (
    <div className="space-y-6">
      <BackButton bold>Barrister Abimbola Adedeji</BackButton>

      <FilterBar
        pageTitle="Tracking"
        azFilter
        isDateTrue
        noExclamationMark
        handleFilterApply={() => {}}
        searchInputPlaceholder="Search for Audit Trail"
        hasGridListToggle={false}
        exports
        exportHref={`/reports/tracking/${userId}/export`}
      />
      <CustomTable data={tableData} fields={trackingTableFields} />
    </div>
  );
};

export default UserTrackingPage;
