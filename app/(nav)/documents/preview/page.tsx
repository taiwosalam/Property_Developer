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
  return (
    <>
      <div ref={printRef} className="w-full mb-[150px]">
        <Parties landlord={landlord.name} tenant={tenant.name} />
        <PropertyDescription description={propertyDescription} />
        <AttorneyInfo attorney={attorney} />
        <LawFirmInfo lawFirm={lawFirm} />
        <Attestation date={date} landlord={landlord} tenant={tenant} />
        <ClauseList clauses={clauses} />
        <WitnessSignatureDate
          landlord={witnessLandlord}
          tenant={witnessTenant}
          witness={witness}
          lawFirm={witnessLawFirm}
        />
      </div>
      <ExportPageFooter printRef={printRef} />
    </>
  );
};

export default DocumentPreview;
