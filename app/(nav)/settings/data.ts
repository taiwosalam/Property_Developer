interface SignatureAPIResponse {
  signatures: {
    // company_id: number;
    // created_at: string;
    // id: number;
    // signatories: {
    id: number;
    name: string;
    professional_title: string;
    signature: string;
    title: string;
  }[];
  // updated_at: string;
  // }
}

export interface SignaturePageData {
  id: number;
  name: string;
  professional_title: string;
  signature_image: string;
  title: string;
}
[];

export interface BankAPIResponse {
  data: {
    id: number;
    bank_name: string;
    bank_code: string;
    account_number: string;
    account_name: string;
    is_default: number;
    bankable_type: string;
    bankable_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  }[];
}

export interface BankPageData {
  // id: number;
  bank_name: string;
  account_name: string;
  account_number: string;
  bank_code: string;
}

export const transformSignature = (
  data: SignatureAPIResponse
): SignaturePageData[] => {
  return data?.signatures?.map((item) => ({
    id: item.id,
    name: item.name,
    professional_title: item.professional_title,
    signature_image: item.signature,
    title: item.title,
  }));
};

export const transformBank = (data: BankAPIResponse): BankPageData => {
  // console.log("data rec", data)
  return data.data.map((b) => ({
    bank_name: b.bank_name,
    account_name: b.account_name,
    account_number: b.account_number,
    bank_code: b.bank_code,
  }))[0];
};
