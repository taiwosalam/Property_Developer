import { Attestation, AttorneyInfo, ClauseList, LawFirmInfo, Parties, PropertyDescription, WitnessSignatureDate } from "@/app/(nav)/documents/preview/component";
import { transformDocumentData } from "@/app/(nav)/documents/preview/data";
import useExport from "@/hooks/useExport";
import { useGlobalStore } from "@/store/general-store";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Button from "../Form/Button/button";

export const AgreementPreview = () => {
  const { selectedOccupant, unitData } = useGlobalStore();
  const [documentData, setDocumentData] = useState<any | null>(
    null
  );
  const [unitName, setUnitName] = useState<string>("Property");
  const firstPageRef = useRef<HTMLDivElement>(null);
  const restOfContentRef = useRef<HTMLDivElement>(null);
  // const { handleDownload } = useExport({
  //   firstPageRef,
  //   restOfContentRef,
  // });

  useEffect(() => {
    if (!unitData?.property_document || !selectedOccupant) {
      toast.error("Missing document or tenant information.");
      return;
    }

    try {
      const tenantData: any = {
        name: selectedOccupant.name || "Unknown Tenant",
        address: selectedOccupant.address
          ? `${selectedOccupant.address}, ${selectedOccupant.city}, ${selectedOccupant.lg}, ${selectedOccupant.state}`
          : unitData.address || "Unknown Address",
        email: selectedOccupant.email || undefined,
        phone: selectedOccupant.phone || undefined,
      };

      const unitDataMapped: any = {
        unit_name: unitData.unit_name,
        address: unitData.address,
        city_area: unitData.property_address?.split(", ")[1],
        local_government: unitData.localGovernment,
        state: unitData.state,
        currency: unitData.currency,
        newTenantPrice: unitData.newTenantPrice,
        inspectionFee: unitData.inspectionFee,
        legalFee: unitData.legalFee,
        vat_amount: unitData.vat_amount,
        renew_vat_amount: unitData.renew_vat_amount,
        renewalTenantPrice: unitData.renewalTenantPrice,
        renew_service_charge: unitData.renew_service_charge,
        renew_other_charge: unitData.renew_other_charge,
        management_fee: unitData.management_fee,
        caution_fee: unitData.caution_fee,
        security_fee: unitData.security_fee,
        other_charge: unitData.other_charge,
        unitAgentFee: unitData.unitAgentFee,
        service_charge: unitData.service_charge,
      };

      const transformed = transformDocumentData(
        { document: unitData.property_document },
        tenantData,
        // unitDataMapped
      );

      setDocumentData(transformed);
      setUnitName(unitData.unit_name);
    } catch (error) {
      toast.error("Failed to load agreement preview.");
      console.error(error);
    }
  }, [unitData, selectedOccupant]);

  if (!documentData) return <div>Loading agreement...</div>;

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
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      <div ref={firstPageRef} className="border-4 border-black p-8 mb-4">
        <Parties landlord={parties.landlord} tenant={parties.tenant} />
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
        {/* <WitnessSignatureDate
          landlord={witnessLandlord}
          tenant={witnessTenant}
          witness={witness}
          lawFirm={witnessLawFirm}
        /> */}
      </div>
      <div className="mt-4 flex justify-end">
        <Button
          size="base_medium"
          className="py-2 px-6"
          // disabled={isDownloading}
          // onClick={() => handleDownload(unitName)}
        >
          download
          {/* {isDownloading ? "Downloading..." : "Download Agreement"} */}
        </Button>
      </div>
    </div>
  );
};
