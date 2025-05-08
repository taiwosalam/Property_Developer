"use client";

import React, { useEffect, useRef, useState } from "react";
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
  transformDocumentData,
  witness,
  witnessLandlord,
  witnessLawFirm,
  witnessTenant,
} from "./data";
import ExportPageFooter from "@/components/reports/export-page-footer";
import useFetch from "@/hooks/useFetch";
import { useSearchParams } from "next/navigation";
import { DocumentPreviewData } from "./types";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import ServerError from "@/components/Error/ServerError";
import NetworkError from "@/components/Error/NetworkError";

const DocumentPreview: React.FC = () => {
  const printRef = useRef(null);
  const documentId = useSearchParams().get("d") ?? "";
  const firstPageRef = useRef<HTMLDivElement>(null);
  const restOfContentRef = useRef<HTMLDivElement>(null);
  const [documentData, setDocumentData] = useState<DocumentPreviewData | null>(
    null
  );

  const { data, loading, error, isNetworkError } = useFetch<any>(
    `property-document/${documentId}`
  );

  useEffect(() => {
    if (data) {
      const transformed = transformDocumentData(data);
      setDocumentData(transformed);
    }
  }, [data]);

  if (loading) return <PageCircleLoader />;
  if (error) return <ServerError error={error} />;
  if (isNetworkError) return <NetworkError />;
  if (!documentData) return null;

  const {
    parties,
    propertyDescription,
    attorney,
    lawFirm,
    attestation,
    witnessLawFirm,
    clauses,
  } = documentData;

  return (
    <>
      <div ref={printRef} className="w-full mb-[150px]">
        <div
          ref={firstPageRef}
          className="flex flex-col justify-between border-4 border-black p-8 min-h-[2422.42px]"
        >
          <Parties landlord={parties.landlord} tenant={parties.tenant} />
          {/* <Parties landlord={landlord.name} tenant={tenant.name} /> */}
          <div className="flex flex-col gap-4">
            <PropertyDescription description={propertyDescription} />
            <AttorneyInfo attorney={attorney} />
          </div>
          <LawFirmInfo lawFirm={lawFirm} />
        </div>
        <div ref={restOfContentRef}>
          <Attestation
            date={attestation.date}
            landlord={attestation.landlord}
            tenant={attestation.tenant}
          />
          <ClauseList clauses={clauses} />
          <WitnessSignatureDate
            landlord={witnessLandlord}
            tenant={witnessTenant}
            witness={witness}
            // lawFirm={witnessLawFirm}
            lawFirm={lawFirm}
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
