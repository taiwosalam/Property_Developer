"use client";
import { LocationIcon } from "@/public/icons/icons";
import BackButton from "@/components/BackButton/back-button";
import FilterBar from "@/components/FIlterBar/FilterBar";
import CustomTable from "@/components/Table/table";
import { useParams } from "next/navigation";
import { staffActivitiesTableFields, activitiesTableData } from "../data";

const StaffActivitiesPage = () => {
  const { branchId, staffId } = useParams();
  return (
    <div className="space-y-6">
      <div className="custom-flex-col gap-2">
        <BackButton bold>Moniya Branch</BackButton>
        <div className="flex">
          <div className="w-10"></div>
          <div className="flex items-center gap-1 text-text-disabled">
            <LocationIcon />
            <p className="text-sm font-normal">
              Street 23, All Avenue, Nigeria
            </p>
          </div>
        </div>
      </div>
      <FilterBar
        pageTitle="Barrister Abimbola Adedeji"
        azFilter
        isDateTrue
        noExclamationMark
        handleFilterApply={() => {}}
        searchInputPlaceholder="Search for Audit Trail"
        hasGridListToggle={false}
        exports
        exportHref={`/management/staff-branch/${branchId}/branch-staff/${staffId}/activities/export`}
      />
      <CustomTable
        data={activitiesTableData}
        fields={staffActivitiesTableFields}
      />
    </div>
  );
};

export default StaffActivitiesPage;
