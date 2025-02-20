import dayjs from "dayjs";
import { formatHtmlDescription } from "../../data";
import api, { handleAxiosError } from "@/services/api";
import { UnitOptionTypes, UnitsApiResponse } from "@/components/Management/Rent And Unit/Edit-Rent/data";
// Raw API response interfaces
export interface DisburseApiResponse {
  status: string;
  data: Data;
  message: string;
}

export interface Data {
  id: number;
  property_id: number;
  property: string;
  landlord: string | null;
  picture: string | null;
  description: string;
  account_officer: string | null;
  account_officer_updated: string | null;
  total_amount: string;
  disbursement: Disbursement[];
  disburse_mode: string;
  created_at: string;
  updated_at: string;
}

export interface Disbursement {
  amount: number;
  unit_id: number;
}

export interface ManageDisbursementPageData {
  disbursementId: string;
  property_name: string;
  property_id: number;
  unit_names: any; 
  landlord: string;
  date: string;
  disbursement_mode: string;
  description: string;
  total_amount: string;
  disbursement: Disbursement[];
}

export const transformDisburseData = (
  apiResponse: DisburseApiResponse
): ManageDisbursementPageData => {
  const data = apiResponse.data;
  return {
    disbursementId: `${data.id}`,
    property_name: data.property,
    property_id: data.property_id,
    unit_names: [], 
    landlord: data.landlord || "",
    date: dayjs(data.created_at).format("MMM DD YYYY"),
    disbursement_mode: data.disburse_mode,
    description: formatHtmlDescription(data.description),
    total_amount: data.total_amount,
    disbursement: data.disbursement, // Array of { amount, unit_id }
  };
};


export const transformUnitOptions = (data: UnitsApiResponse): UnitOptionTypes[] => {
  return data.data
      .filter(unit => unit.is_active === 'vacant')
      .map(unit => ({
          value: unit.id.toString(),
          label: unit.unit_name,
      }));
};


export const addDisburse = async (data: any, id: number) => {
  try {
    const res = await api.post(`/disburses/${id}/disbursement`, data);
    if(res.status === 201){
      return true
    }
  } catch (error) {
    handleAxiosError(error)
    return false
  }
}