"use client";

import React, { useRef } from "react";
import {
  Attestation,
  AttorneyInfo,
  ClauseList,
  LawFirmInfo,
  Parties,
  PropertyDescription,
  WitnessSignatureDate,
} from "./component";
import {
  attorney,
  clauses,
  date,
  landlord,
  lawFirm,
  propertyDescription,
  tenant,
  witness,
  witnessLandlord,
  witnessLawFirm,
  witnessTenant,
} from "./data";
import ExportPageFooter from "@/components/reports/export-page-footer";

const DocumentPreview: React.FC = () => {
  const printRef = useRef(null);
  const firstPageRef = useRef<HTMLDivElement>(null);
  const restOfContentRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <div ref={printRef} className="w-full mb-[150px]">
        <div
          ref={firstPageRef}
          className="flex flex-col justify-between border-4 border-black p-8 min-h-[2422.42px]"
        >
          <Parties landlord={landlord.name} tenant={tenant.name} />
          <div className="flex flex-col gap-4">
            <PropertyDescription description={propertyDescription} />
            <AttorneyInfo attorney={attorney} />
          </div>
          <LawFirmInfo lawFirm={lawFirm} />
        </div>
        <div ref={restOfContentRef}>
          <Attestation date={date} landlord={landlord} tenant={tenant} />
          <ClauseList clauses={clauses} />
          <WitnessSignatureDate
            landlord={witnessLandlord}
            tenant={witnessTenant}
            witness={witness}
            lawFirm={witnessLawFirm}
          />
        </div>
      </div>
      {/* <ExportPageFooter printRef={printRef} /> */}
      <ExportPageFooter
        firstPageRef={firstPageRef}
        restOfContentRef={restOfContentRef}
      />
    </>
  );
};

export default DocumentPreview;
