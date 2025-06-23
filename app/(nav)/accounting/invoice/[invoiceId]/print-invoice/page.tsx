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
import { useEffect, useRef, useState } from "react";
import { InvoicePageData, InvoiceResponse } from "../manage/types";
import useFetch from "@/hooks/useFetch";
import { defaultInvoiceData, transformInvoiceData } from "../manage/data";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import NetworkError from "@/components/Error/NetworkError";
import { formatNumber } from "@/utils/number-formatter";
import {
  BankAPIResponse,
  BankPageData,
  transformBank,
} from "@/app/(nav)/settings/data";
import { useCompanyBankDetails } from "@/hooks/useCompanyBankDetails";
import { formatFee } from "@/app/(nav)/management/rent-unit/data";
import Breakdown from "@/components/Accounting/invoice/create-invoice/Breakdown";
import ServerError from "@/components/Error/ServerError";

const PreviewExpenses = () => {
  const router = useRouter();
  const { invoiceId } = useParams();
  const [pageData, setPageData] = useState<InvoicePageData>(defaultInvoiceData);
  const {
    companyBankDetails,
    error: bankError,
    loading: bankLoading,
  } = useCompanyBankDetails();
  const { data, error, loading, isNetworkError } = useFetch<InvoiceResponse>(
    `/invoice/${invoiceId}`
  );

  useEffect(() => {
    if (data) {
      setPageData(transformInvoiceData(data.data));
    }
  }, [data]);

  const printRef = useRef<HTMLDivElement>(null);

  const BANK_DETAILS = pageData.branchBankDetails;

  const CURRENCY = pageData.currency || "naira"; //TODO: change to real currency from endpount
  const IS_PAID = pageData.status.toLowerCase() === "paid";
  const UNIT_ID = pageData.unit_id;

  const UnitKeyValData = {
    "invoice id": pageData.invoice_id,
    "property name": pageData.property_name,
    "Client name": pageData.client_name,
    date: pageData.invoice_date,
    "account officer": pageData.account_officer,
    "unit id": pageData.unit_id,
    "invoice type": pageData.invoice_type,
    status: pageData.status,
  };

  const NoUnitKeyValData = {
    "invoice id": pageData.invoice_id,
    "property name": pageData.property_name,
    "client name": pageData.client_name,
    date: pageData.invoice_date,
    status: pageData.status,
    "Auto Generate": pageData.auto_generate,
  };

  const UnitRefObj = {
    "invoice id": "",
    "Client name": "",
    "property name": "",
    date: "",
    "account officer": "",
    "unit id": "",
    "invoice type": "",
    status: "",
  };

  const NoUnitRefObj = {
    "invoice id": "",
    "property name": "",
    "client name": "",
    "Auto Generate": "",
    date: "",
    status: "",
  };

  const KEY_VALUE_DATA = UNIT_ID ? UnitKeyValData : NoUnitKeyValData;
  const KEY_VALUE_REF_OBJ = UNIT_ID ? UnitRefObj : NoUnitRefObj;

  if (loading) return <PageCircleLoader />;
  if (error) return <ServerError error={error} />;
  if (isNetworkError) return <NetworkError />;

  return (
    <div className="custom-flex-col gap-10 pb-28">
      <div className="custom-flex-col gap-[18px]">
        <BackButton as="p">Back</BackButton>
        <div ref={printRef}>
          <ExportPageHeader />
          <h1 className="text-center my-7 font-medium text-2xl">Invoice</h1>
          <div className="rounded-lg bg-white dark:bg-darkText-primary p-8 flex gap-6 lg:gap-0 flex-col lg:flex-row">
            <KeyValueList
              data={KEY_VALUE_DATA}
              chunkSize={2}
              direction="column"
              referenceObject={KEY_VALUE_REF_OBJ}
            />
          </div>
          <AccountingTitleSection title="Details">
            {UNIT_ID ? (
              <>
                <p className="font-normal text-[14px] text-[#6C6D6D] capitalize">
                  {pageData.details} Payment for {pageData.unit_name}
                </p>
                <div className="p-6 rounded-lg space-y-5 bg-white dark:bg-darkText-primary">
                  <div className="flex gap-6 lg:gap-0 flex-col lg:flex-row">
                    <KeyValueList
                      data={{
                        "Annual fee": formatFee(pageData.annual_fee, CURRENCY),
                        "non refundable agency fee": formatFee(
                          pageData.agency_fee,
                          CURRENCY
                        ),
                        "service charge": formatFee(
                          pageData.service_charge,
                          CURRENCY
                        ),
                        "refundable caution fee": formatFee(
                          pageData.caution_fee,
                          CURRENCY
                        ),
                        "non refundable legal fee": "",
                        "Tenant Owe": formatFee(pageData.tenant_owed, CURRENCY),
                        "Company Owe": formatFee(
                          pageData.company_owed,
                          CURRENCY
                        ),
                      }}
                      chunkSize={2}
                      direction="column"
                      referenceObject={{
                        "Annual fee": "",
                        "non refundable agency fee": "",
                        "service charge": "",
                        "non refundable legal fee": "",
                        "refundable caution fee": "",
                        "Tenant Owe": "",
                        "Company Owe": "",
                      }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <Breakdown data={pageData} />
            )}
            <div className="w-full h-[2px] bg-opacity-20 bg-[#C0C2C8]" />
            <div className="flex-1 text-base font-medium capitalize custom-flex-col gap-1">
              <p className="text-[#747474]">total package</p>
              <p className="text-brand-primary text-xl font-bold">
                {formatFee(Number(pageData.total_package), CURRENCY)}
              </p>
            </div>
          </AccountingTitleSection>
          {BANK_DETAILS?.account_name ||
            (companyBankDetails.account_name && (
              <>
                <AccountingTitleSection title="Account Details">
                  <div className="p-6 rounded-lg bg-white dark:bg-darkText-primary">
                    <div className="flex gap-6 lg:gap-0 flex-col lg:flex-row">
                      <KeyValueList
                        data={{
                          "account name":
                            BANK_DETAILS?.account_name ||
                            companyBankDetails.account_name,
                          "account number":
                            BANK_DETAILS?.account_number ||
                            companyBankDetails.account_number,
                          "bank name":
                            BANK_DETAILS?.bank_name ||
                            companyBankDetails.bank_name,
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
                </AccountingTitleSection>
              </>
            ))}
          <Signature />
        </div>
        <ExportPageFooter printRef={printRef} />
      </div>
    </div>
  );
};

export default PreviewExpenses;
