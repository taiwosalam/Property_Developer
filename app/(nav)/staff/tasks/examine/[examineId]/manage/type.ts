
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

interface InspectionItem {
  [key: string]: string;
}

interface ResponseData {
  id: number;
  title: string;
  description: string;
  examine_date: string;
  company: Company;
  property_name: string;
  branch_name: string;
  added_guest: string;
  assign_staff: string;
  image: Image[];
  service: string[];
  inspection_checklist: InspectionItem[];
  inspection_summary: InspectionItem[];
  send_to_landlord: boolean;
  send_to_tenant: boolean;
  inspection_summary_note: string;
}

interface ExamineSingleDataResponse {
  status: "success";
  data: ResponseData;
}
