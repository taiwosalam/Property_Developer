"use client";

import React, { useRef, useState, useEffect } from "react";
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
  // witnessLandlord,
  // witnessTenant,
  witness,
} from "@/app/(nav)/documents/preview/data";
import Button from "../Form/Button/button";
import { useAgreementData } from "@/hooks/useAgreementData";
import { useAgreementExport } from "@/hooks/useAgreementExport";
import { compressImage } from "@/utils/compress-image";
import PageCircleLoader from "../Loader/PageCircleLoader";
import { useModal } from "./modal";

interface AgreementPreviewProps {
  onClose?: () => void;
  onContinue?: (file: File) => void;
  isWebTenant?: boolean;
}

export const AgreementPreview = ({
  onClose,
  onContinue,
  isWebTenant,
}: AgreementPreviewProps) => {
  const router = useRouter();
  const { setIsOpen } = useModal();
  const firstPageRef = useRef<HTMLDivElement>(null);
  const restOfContentRef = useRef<HTMLDivElement>(null);
  const [compressedData, setCompressedData] = useState<any>(null);

  const { documentData, unitName, isLoading, error } = useAgreementData();
  const { handleDownload, generatePdfFile, isDownloading } = useAgreementExport(
    {
      firstPageRef,
      restOfContentRef,
    }
  );

  useEffect(() => {
    const compressImages = async () => {
      if (!documentData) return;

      const compressIfValid = async (url: string | undefined) =>
        url && url !== "" ? await compressImage(url) : url;

      const compressedLawFirm = {
        ...documentData.lawFirm,
        logoSrc: await compressIfValid(documentData.lawFirm.logoSrc),
        sealSrc: await compressIfValid(documentData.lawFirm.sealSrc),
      };

      // const compressedWitnessLandlord = {
      //   ...witnessLandlord,
      //   signatureSrc: await compressIfValid(witnessLandlord.signatureSrc),
      // };

      // const compressedWitnessTenant = {
      //   ...witnessTenant,
      //   signatureSrc: await compressIfValid(witnessTenant.signatureSrc),
      // };

      // const compressedWitness = {
      //   ...witness,
      //   signatureSrc: await compressIfValid(witness.signatureSrc),
      // };

      setCompressedData({
        ...documentData,
        lawFirm: compressedLawFirm,
        // witnessLandlord: compressedWitnessLandlord,
        // witnessTenant: compressedWitnessTenant,
        witness,
      });
    };

    compressImages();
  }, [documentData]);

  const handleContinue = async () => {
    if (!unitName || !onContinue) return;
    try {
      const pdfFile = await generatePdfFile(`agreement_${unitName}`);
      onContinue(pdfFile);
      if (pdfFile) setIsOpen(false);
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.error("Failed to generate agreement PDF.");
    }
  };

  if (error) {
    toast.error(error);
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
    return null;
  }

  if (isLoading || !documentData || !compressedData) {
    return <PageCircleLoader />;
  }

  const {
    parties,
    propertyDescription,
    attorney,
    lawFirm,
    attestation,
    witnessLawFirm,
    clauses,
  } = compressedData;

  return (
    <div className="agreement-preview-container">
      <div className="agreement-preview-header">
        {/* {onClose && (
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
        )} */}
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
            landlord={attestation.landlord}
            tenant={attestation.tenant}
            // landlord={witnessLandlord}
            // tenant={witnessTenant}
            witness={witness}
            lawFirm={lawFirm}
          />
        </div>
      </div>
      <div className="agreement-preview-footer flex gap-4">
        <Button
          type="button"
          onClick={() => handleDownload(unitName)}
          size="custom"
          className="agreement-preview-download-button"
          variant="sky_blue"
          disabled={isDownloading}
          aria-label="Download agreement"
        >
          {isDownloading ? "Please wait..." : "Download"}
        </Button>
        {onContinue && (
          <Button
            type="button"
            onClick={handleContinue}
            className="px-8 py-2"
            disabled={isDownloading}
            aria-label="Continue with agreement"
          >
            {isDownloading ? "Please wait..." : "Start Rent"}
          </Button>
        )}
      </div>
    </div>
  );
};
