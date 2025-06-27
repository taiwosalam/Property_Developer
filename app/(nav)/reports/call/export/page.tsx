"use client";

import CustomTable from "@/components/Table/table";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import { callRequestTablefields, CallRequestTableData } from "../data";
import BackButton from "@/components/BackButton/back-button";
import Signature from "@/components/Signature/signature";
import ExportPageFooter from "@/components/reports/export-page-footer";
import { useGlobalStore } from "@/store/general-store";
import { useRef, useState } from "react";

const ExportCall = () => {
  const exportRef = useRef<HTMLDivElement>(null);
  const [fullContent, setFullContent] = useState(false);
  const filteredTenants = useGlobalStore((s) => s.callback_requests);

  return (
    <div className="space-y-9 pb-[100px]">
      <BackButton as="p">Back</BackButton>
      <div ref={exportRef} className="space-y-9">
        <ExportPageHeader />
        <h1 className="text-center text-black dark:text-white text-lg md:text-xl lg:text-2xl font-medium">
          Summary
        </h1>
        <CustomTable
          className={`${fullContent && "max-h-none"}`}
          fields={callRequestTablefields}
          data={filteredTenants || []}
          tableHeadClassName="h-[45px]"
        />
        <Signature />
      </div>
      <ExportPageFooter printRef={exportRef} setFullContent={setFullContent} />
    </div>
  );
};

export default ExportCall;
