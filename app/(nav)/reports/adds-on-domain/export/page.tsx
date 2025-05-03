"use client";

import CustomTable from "@/components/Table/table";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import BackButton from "@/components/BackButton/back-button";
import Signature from "@/components/Signature/signature";
import ExportPageFooter from "@/components/reports/export-page-footer";
import useFetch from "@/hooks/useFetch";
import { config } from "process";
import { useEffect, useRef, useState } from "react";

import NetworkError from "@/components/Error/NetworkError";
import CustomLoader from "@/components/Loader/CustomLoader";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useGlobalStore } from "@/store/general-store";
import { DomainFields, SponsorFields } from "@/app/(nav)/settings/add-on/data";

dayjs.extend(advancedFormat);

const ExportAddsOnSponsor = () => {
  const exportRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="space-y-9 pb-[100px]">
      <BackButton as="p">Back</BackButton>
      <div ref={exportRef} className="space-y-9">
        <ExportPageHeader />
        <div className="space-y-3">
          <h1 className="text-center text-black text-lg md:text-xl lg:text-2xl font-medium">
            Summary{" "}
            <span className="px-2">{`(${dayjs().format(
              "Do MMMM YYYY"
            )})`}</span>
          </h1>
        </div>
        <CustomTable
          //className={`${fullContent && "max-h-none"}`}
          fields={DomainFields}
          data={[]}
          tableHeadClassName="h-[45px]"
        />
        <Signature />
      </div>
      <ExportPageFooter
        printRef={exportRef}
        //setFullContent={setFullContent}
        //fullContent={fullContent}
      />
    </div>
  );
};

export default ExportAddsOnSponsor;
