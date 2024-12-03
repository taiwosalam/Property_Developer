"use client";

import CustomTable from "@/components/Table/table";
import { visitorsRequestTableFields, VisitorsRequestTableData } from "../data";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import BackButton from "@/components/BackButton/back-button";
import Signature from "@/components/Signature/signature";
import ExportPageFooter from "@/components/reports/export-page-footer";

const ExportVisitors = () => {
  return (
    <div className="space-y-9 pb-[100px]">
      <BackButton as="p">Back</BackButton>
      <ExportPageHeader />
      <h1 className="text-center text-black dark:text-white text-lg md:text-xl lg:text-2xl font-medium">
        Summary
      </h1>
      <CustomTable
        fields={visitorsRequestTableFields}
        data={VisitorsRequestTableData}
        tableHeadClassName="h-[45px]"
      />
      <Signature />
      <ExportPageFooter />
    </div>
  );
};

export default ExportVisitors;
