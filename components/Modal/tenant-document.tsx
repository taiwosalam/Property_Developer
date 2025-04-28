"use client";

import React, { useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Parties,
  PropertyDescription,
  AttorneyInfo,
  LawFirmInfo,
  Attestation,
  ClauseList,
  WitnessSignatureDate,
} from "@/app/(nav)/documents/preview/component";
import {
  witnessLandlord,
  witnessTenant,
  witness,
} from "@/app/(nav)/documents/preview/data";
import { DocumentPreviewData } from "@/app/(nav)/documents/preview/types";
import Button from "../Form/Button/button";
import { useAgreementData } from "@/hooks/useAgreementData";
import { useAgreementExport } from "@/hooks/useAgreementExport";

interface AgreementPreviewProps {
  onClose?: () => void; // Optional callback for closing modal
}

export const AgreementPreview = ({ onClose }: AgreementPreviewProps) => {
  const router = useRouter();
  const firstPageRef = useRef<HTMLDivElement>(null);
  const restOfContentRef = useRef<HTMLDivElement>(null);

  // Fetch and transform agreement data
  const { documentData, unitName, isLoading, error } = useAgreementData();

  // Handle export functionality
  const { handleDownload, isDownloading } = useAgreementExport({
    firstPageRef,
    restOfContentRef,
  });

  // Handle errors
  if (error) {
    toast.error(error);
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
    return null;
  }

  // Show loading state
  if (isLoading || !documentData) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400 py-4">
        Loading agreement...
      </div>
    );
  }

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
    <div className="agreement-preview-container">
      <div className="agreement-preview-header">
        {/* <h2 className="agreement-preview-title">Tenancy Agreement Preview</h2> */}
        {onClose && (
          <Button
            type="button"
            onClick={onClose}
            size="custom"
            className="agreement-preview-close-button"
            variant="sky_blue"
            aria-label="Close modal"
          >
            Close
          </Button>
        )}
      </div>
      <div className="agreement-preview-content">
        <div ref={firstPageRef} className="agreement-preview-first-page">
          <Parties landlord={parties.landlord} tenant={parties.tenant} />
          <div className="agreement-preview-section">
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
            lawFirm={witnessLawFirm}
          />
        </div>
      </div>
      <div className="agreement-preview-footer">
        <Button
          type="button"
          onClick={() => handleDownload(unitName)}
          size="custom"
          className="agreement-preview-download-button"
          variant="sky_blue"
          disabled={isDownloading}
          aria-label="Download agreement"
        >
          {isDownloading ? "Downloading..." : "Download"}
        </Button>
      </div>
    </div>
  );
};
