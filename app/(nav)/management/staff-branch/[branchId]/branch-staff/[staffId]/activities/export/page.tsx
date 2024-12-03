"use client";
import BackButton from "@/components/BackButton/back-button";
import Signature from "@/components/Signature/signature";
import ExportPageFooter from "@/components/reports/export-page-footer";
import CustomTable from "@/components/Table/table";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import { staffActivitiesTableFields, activitiesTableData } from "../../data";

const StaffActivitiesExportPage = () => {
  return (
    <div className="space-y-9 pb-[100px]">
      <BackButton as="p">Barrister Ademola Adedeji</BackButton>
      <ExportPageHeader />
      <h1 className="text-center text-black dark:text-white text-lg md:text-xl lg:text-2xl font-medium">
        Summary
      </h1>
      <CustomTable
        fields={staffActivitiesTableFields}
        data={activitiesTableData}
      />
      <Signature />
      <ExportPageFooter />
    </div>
  );
};

export default StaffActivitiesExportPage;
