"use client";

// Imports
import KeyValueList from "@/components/KeyValueList/key-value-list";
import AccountingTitleSection from "@/components/Accounting/accounting-title-section";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import BackButton from "@/components/BackButton/back-button";
import { useParams, useRouter } from "next/navigation";
import Signature from "@/components/Signature/signature";
import ExportPageFooter from "@/components/reports/export-page-footer";
import { useEffect, useState } from "react";
import { InvoicePageData, InvoiceResponse } from "../manage/types";
import useFetch from "@/hooks/useFetch";
import { defaultInvoiceData, transformInvoiceData } from "../manage/data";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import NetworkError from "@/components/Error/NetworkError";
import { formatNumber } from "@/utils/number-formatter";
import { BankAPIResponse, BankPageData, transformBank } from "@/app/(nav)/settings/data";
import { useCompanyBankDetails } from "@/hooks/useCompanyBankDetails";

const PreviewExpenses = () => {
  const router = useRouter();
  const { invoiceId } = useParams();
  const [pageData, setPageData] = useState<InvoicePageData>(defaultInvoiceData);
  const { companyBankDetails, error: bankError, loading: bankLoading } = useCompanyBankDetails();
  const { data, error, loading, isNetworkError } = useFetch<InvoiceResponse>(
    `/invoice/${invoiceId}`
  );
console.log("bank ", companyBankDetails)
  useEffect(() => {
    if (data) {
      setPageData(transformInvoiceData(data.data));
    }
  }, [data]);

  if (loading) return <PageCircleLoader />;
  if (error) return <div>Error loading invoice data.</div>;
  if (isNetworkError) return <NetworkError />;

  return (
    <div className="custom-flex-col gap-10 pb-28">
      <div className="custom-flex-col gap-[18px]">
        <BackButton as="p">Back</BackButton>
        <ExportPageHeader />
        <h1 className="text-center my-7 font-medium text-2xl">Invoice</h1>
        <div className="rounded-lg bg-white p-8 flex gap-6 lg:gap-0 flex-col lg:flex-row">
          <KeyValueList
            data={{
              "invoice id": pageData.invoice_id,
              "property name": pageData.property_name,
              "Customer name": pageData.client_name,
              date: pageData.invoice_date,
              "account officer": pageData.account_officer,
              "unit id": pageData.unit_id,
            }}
            chunkSize={2}
            direction="column"
            referenceObject={{
              "invoice id": "",
              "Customer name": "",
              "property name": "",
              date: "",
              "account officer": "",
              "unit id": "",
            }}
          />
        </div>
        <AccountingTitleSection title="Details">
          <p className="font-normal text-[14px] text-[#6C6D6D]">
            New rent payment for 3 bedroom bungalow at Ajibade road 2, Lekki
            Lagos
          </p>
          <div className="p-6 rounded-lg space-y-5 bg-white">
            <div className="flex gap-6 lg:gap-0 flex-col lg:flex-row">
              <KeyValueList
                data={{
                  "Annual fee": formatNumber(pageData.annual_fee),
                  "non refundable agency fee": formatNumber(
                    pageData.agency_fee
                  ),
                  "service charge": formatNumber(pageData.service_charge),
                  "refundable caution fee": formatNumber(pageData.caution_fee),
                  "non refundable legal fee": "",
                }}
                chunkSize={2}
                direction="column"
                referenceObject={{
                  "Annual fee": "",
                  "non refundable agency fee": "",
                  "service charge": "",
                  "non refundable legal fee": "",
                  "refundable caution fee": "",
                }}
              />
            </div>
            <div className="w-full h-[2px] bg-opacity-20 bg-[#C0C2C8]" />
            <div className="flex-1 text-base font-medium capitalize custom-flex-col gap-1">
              <p className="text-[#747474]">total package</p>
              <p className="text-brand-primary text-xl font-bold">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                })
                  .format(Number(pageData.total_package))
                  .split(".")}
              </p>
            </div>
          </div>
        </AccountingTitleSection>
        <AccountingTitleSection title="Account Details">
          <div className="p-6 rounded-lg bg-white">
            <div className="flex gap-6 lg:gap-0 flex-col lg:flex-row">
              <KeyValueList
                data={{
                  "account name": companyBankDetails.account_name,
                  "account number": companyBankDetails.account_number,
                  "bank name": companyBankDetails.bank_name
                }}
                chunkSize={1}
                direction="column"
                referenceObject={{
                  "account number": "",
                  "account name": "",
                  "bank name": "",
                }}
              />
            </div>
          </div>
          <Signature />
        </AccountingTitleSection>
      </div>
      <ExportPageFooter />
    </div>
  );
};

export default PreviewExpenses;
