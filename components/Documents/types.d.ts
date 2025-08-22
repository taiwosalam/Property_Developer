// types.ts
export interface Article {
  title: string;
  content: string;
  section: string;
  summary: string;
}

export interface DocumentData {
  document_id: number;
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
  articles: Article[];
}

export interface DocumentsAPIResponse {
  status: string;
  document: DocumentData;
}

// This is the structure expected by DocumentCheckbox components
export interface CheckboxOption {
  title: string;
  value: string;
  section: string;
  summary: string;
  description: string;
}

export interface ArticlePayload {
  title: string;
  content: string;
  section: string;
  summary: string;
}

// Overall payload interface for creating/editing the tenancy agreement
export interface TenancyAgreementPayload {
  property_id: number;
  document_id: number;
  _method?: string;
  articles: ArticlePayload[];
}

export interface Document {
  document_id: number;
  property_name: string;
  document_type: string;
  property_id: number;
  total_unit: number;
  created_date: string;
  last_updated: string;
  page?: 'manager' | 'account';
}

export interface DocumentsPageAPIResponse {
  status: string;
  documents: any[]; // API may return extra fields; we'll transform them
  total_document: number;
  total_month: number;
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}


export interface DocumentFilterParams {
  date_from?: string;
  date_to?: string;
  branch_id?: string[];
  state?: string[];
  property_id?: string[];
  sort_by?: "desc";
  search?: string;
}