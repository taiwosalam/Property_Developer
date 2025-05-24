import { useState, useEffect } from "react";
import { useGlobalStore } from "@/store/general-store";
import { transformDocumentData } from "@/app/(nav)/documents/preview/data";
import { DocumentPreviewData } from "@/app/(nav)/documents/preview/types";
import { toast } from "sonner";
import { useOccupantStore } from "./occupant-store";

export const useAgreementData = () => {
  const { selectedOccupant, unitData, rentStartDate, rentEndDate,  } = useGlobalStore();
  const { occupant } = useOccupantStore();
  const [documentData, setDocumentData] = useState<DocumentPreviewData | null>(
    null
  );
  const [unitName, setUnitName] = useState<string>("Property");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      if (!selectedOccupant && !occupant) {
        setError("No Tenant/Occupant Found");
        setIsLoading(false);
        return;
      }

      if (!unitData?.property_document) {
        setError("The Property does not have a document.");
        setIsLoading(false);
        return;
      }

      if (!unitData.property_document?.property) {
        setError(
          "No Document in the Property Yet. Please add Document before continuing"
        );
        setIsLoading(false);
        return;
      }

      const selectedTenant = occupant || selectedOccupant;
      try {
        const transformed = transformDocumentData(
          { document: unitData.property_document },
          // selectedOccupant,
          selectedTenant || undefined,
          unitData,
          rentStartDate || undefined,
          rentEndDate || undefined
        );
        setDocumentData(transformed);
        setUnitName(unitData.unit_name || "Property");
      } catch (err) {
        console.error("Error in transformDocumentData:", err);
        setError("Failed to load agreement preview.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedOccupant, unitData, occupant]);

  return { documentData, unitName, isLoading, error };
};
