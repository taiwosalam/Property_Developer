"use client";

import CustomTable from "@/components/Table/table";
import { visitorsRequestTableFields, VisitorsRequestTableData } from "../data";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import BackButton from "@/components/BackButton/back-button";
import Signature from "@/components/Signature/signature";
import ExportPageFooter from "@/components/reports/export-page-footer";
import { useGlobalStore } from "@/store/general-store";
import { useRef, useState } from "react";
import dayjs from "dayjs";

const ExportVisitors = () => {
  const filterVisitorsRequest = useGlobalStore((s) => s.visitorsRequest);
  const exportRef = useRef<HTMLDivElement>(null);
  const [fullContent, setFullContent] = useState(false);

  return (
    <div className="space-y-9 pb-[100px]">
      <BackButton as="p">Back</BackButton>
      <div ref={exportRef} className="space-y-9">
        <ExportPageHeader />
        <h1 className="text-center text-black text-lg md:text-xl lg:text-2xl font-medium">
          Summary{" "}
          <span className="px-2">{`(${dayjs().format("Do MMMM YYYY")})`}</span>
        </h1>
        <CustomTable
          className={`${fullContent && "max-h-none"}`}
          fields={visitorsRequestTableFields}
          data={filterVisitorsRequest?.visitors || []}
          tableHeadClassName="h-[45px]"
        />
        <Signature />
      </div>
      <ExportPageFooter printRef={exportRef} setFullContent={setFullContent} />
    </div>
  );
};

export default ExportVisitors;
