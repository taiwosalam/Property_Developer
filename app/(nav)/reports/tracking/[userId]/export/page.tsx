"use client";
import BackButton from "@/components/BackButton/back-button";
import Signature from "@/components/Signature/signature";
import ExportPageFooter from "@/components/reports/export-page-footer";
import CustomTable from "@/components/Table/table";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import { trackingTableFields } from "../../data";

const UserActivitiesExportPage = () => {
  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      id: index + 1,
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
    <div className="space-y-9 pb-[100px]">
      <BackButton as="p">Barrister Ademola Adedeji</BackButton>
      <ExportPageHeader />
      <h1 className="text-center text-black dark:text-white text-lg md:text-xl lg:text-2xl font-medium">
        Summary
      </h1>
      <CustomTable fields={trackingTableFields} data={tableData} />
      <Signature />
      <ExportPageFooter />
    </div>
  );
};

export default UserActivitiesExportPage;
