
interface Company {
  name: string;
  logo: string;
  address: string;
  website: string | null;
  email: string;
  phone: string;
}

interface Image {
  path: string;
}

interface InspectionChecklistItem {
  [key: string]: string; // Allows dynamic keys with string values
}

interface InspectionSummaryItem {
  [key: string]: string;
}

interface ResponseData {
  id: number;
  title: string;
  description: string;
  examine_date: string;
  company: Company;
  added_guest: string;
  image: Image[];
  service: string[];
  inspection_checklist: InspectionChecklistItem[];
  inspection_summary: InspectionSummaryItem[];
  send_to_landlord: boolean;
  send_to_tenant: boolean;
  inspection_summary_note: string;
}

interface ExamineSingleDataResponse {
  status: "success";
  data: ResponseData;
}
