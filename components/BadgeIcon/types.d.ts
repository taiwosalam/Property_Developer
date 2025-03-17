// Interface for individual articles in the API response
interface Article {
    title: string;
    content: string;
    section: string;
    summary: string;
  }
  
  // Interface for each document in the API response
  interface DocumentItem {
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
    amount?: number; 
  }
  
  // Interface for the full API response
  interface DocumentsAPIResponse {
    status: string;
    document: DocumentItem[];
  }
  
  // Interface for transformed checkbox options
  interface CheckboxOption {
    title: string;
    value: string;
    id?: number;
    summary: string;
    section: string;
    amount?: number;
    description: string;
  }
  