import { LandlordPageData } from "@/app/(nav)/management/landlord/types";

export const groupDocumentsByType = (
  documents: LandlordPageData["documents"]
) => {
  return documents?.reduce((acc, document) => {
    if (!acc[document.document_type]) {
      acc[document.document_type] = [];
    }
    acc[document.document_type]?.push(document);
    return acc;
  }, {} as Record<string, LandlordPageData["documents"]>);
};
