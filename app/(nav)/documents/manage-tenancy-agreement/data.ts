export interface DocumentArticle {
  title: string;
  content: string;
  section: string;
  summary: string;
}

export interface LawyerDetails {
  type: string;
  category: string;
  property_type: string;
  property_sub_type: string;
  lawyer_fullname: string;
  lawyer_office_address: string;
  lawyer_firm_name: string;
  lawyer_email: string;
  lawyer_phone_number: string;
  lawyer_legal_seal: string;
  lawyer_signature: string;
}

export interface PropertyDocument {
  document_id: number;
  property_name: string;
  property_description: string;
  property_address: string;
  landlord_name: string;
  landlord_id: number | string;
  landlord_type: string;
  document_type: string;
  property_id: number;
  total_unit: number;
  created_date: string;
  articles: DocumentArticle[];
  document: LawyerDetails;
}

export interface ManageDocumentsAPIResponse {
  status: string;
  document: PropertyDocument;
}

export interface CheckboxOption {
  title: string;
  value: string;
  description: string;
  section: string;
  summary: string;
}

export const transformDocumentArticleResponse = (
  response: ManageDocumentsAPIResponse
): CheckboxOption[] => {
  return response.document.articles.map((article) => ({
    title: article.title,
    value: article.title.toLowerCase().replace(/\s+/g, "_"),
    description: article.content,
    section: article.section,
    summary: article.summary,
  }));
};
