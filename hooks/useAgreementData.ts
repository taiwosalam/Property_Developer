import { useState, useEffect } from "react";
import { useGlobalStore } from "@/store/general-store";
import { transformDocumentData } from "@/app/(nav)/documents/preview/data";
import { DocumentPreviewData } from "@/app/(nav)/documents/preview/types";
import { toast } from "sonner";

export const useAgreementData = () => {
  const { selectedOccupant, unitData } = useGlobalStore();
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

      if (!selectedOccupant) {
        setError("No tenant selected.");
        setIsLoading(false);
        return;
      }

      if (!unitData?.property_document) {
        setError("Missing document information.");
        setIsLoading(false);
        return;
      }

      if (!unitData.property_document?.property) {
        setError("Invalid document structure: missing property data.");
        setIsLoading(false);
        return;
      }

      try {
        const transformed = transformDocumentData(
          { document: unitData.property_document },
          selectedOccupant,
          unitData
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
  }, [selectedOccupant, unitData]);

  return { documentData, unitName, isLoading, error };
};
