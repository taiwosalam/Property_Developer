import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import {
  BankAPIResponse,
  BankPageData,
  transformBank,
} from "@/app/(nav)/settings/data";
import useRefetchOnEvent from "./useRefetchOnEvent";

// This hook fetches the bank details from the "/banks" endpoint,
// transforms the response using transformBank,
// and returns the companyBankDetails along with loading and error states.
export function useCompanyBankDetails() {
  const [companyBankDetails, setCompanyBankDetails] = useState<BankPageData>({
    bank_name: "",
    account_name: "",
    account_number: "",
    bank_code: "",
  });

  const { data, error, loading, refetch } = useFetch<BankAPIResponse>("/banks");
  useRefetchOnEvent("fetch-banks", () => refetch({ silent: true }));

  useEffect(() => {
    if (data) {
      const transformed = transformBank(data);
      if (transformed) {
        setCompanyBankDetails(transformed);
      }
    }
  }, [data]);

  return { companyBankDetails, error, loading, refetch };
}
