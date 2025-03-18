"use client";

import React from "react";
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

const DocumentPreview: React.FC = () => {
  return (
    <div className="w-full">
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
  );
};

export default DocumentPreview;
