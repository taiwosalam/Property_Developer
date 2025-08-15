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
import { capitalizeWords } from "@/hooks/capitalize-words";
import SwitchUnitPaymentStatus from "@/components/Accounting/invoice/create-invoice/payment_status";
import { WalletDataResponse } from "@/app/(nav)/wallet/data";

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

  const {
    data: walletData,
    error: walletError,
    refetch: walletRefetch,
  } = useFetch<WalletDataResponse>("/wallets/dashboard");

  useEffect(() => {
    if (data) {
      setPageData(transformInvoiceData(data.data));
    }
  }, [data]);

  const printRef = useRef<HTMLDivElement>(null);

  const BANK_DETAILS = pageData.branchBankDetails;

  console.log("BANK_DETAILS", BANK_DETAILS);
  const CURRENCY = pageData.currency || "naira"; //TODO: change to real currency from endpount
  const IS_PAID = pageData.status.toLowerCase() === "paid";
  const UNIT_ID = pageData.unit_id;

  const UnitKeyValData = {
    "invoice id": pageData.invoice_id,
    "property name": pageData.property_name,
    "Client name": capitalizeWords(pageData.client_name),
    date: pageData.invoice_date,
    "account officer": pageData.account_officer,
    "unit name": pageData.unit_name,
    "invoice type": pageData.invoice_type,
    status: pageData.status,
  };

  const NoUnitKeyValData = {
    "invoice id": pageData.invoice_id,
    "property name": pageData.property_name,
    "client name": capitalizeWords(pageData.client_name),
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
    "unit name": "",
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
                        "agency fee": formatFee(pageData.agency_fee, CURRENCY),
                        "service charge": formatFee(
                          pageData.service_charge,
                          CURRENCY
                        ),
                        "inspection fee": formatFee(
                          pageData.inspection_fee,
                          CURRENCY
                        ),
                        "caution fee": formatFee(
                          pageData.caution_fee,
                          CURRENCY
                        ),
                        "management fee": formatFee(
                          pageData.management_fee,
                          CURRENCY
                        ),
                        "other charge": formatFee(
                          pageData.other_charge,
                          CURRENCY
                        ),
                        "legal fee": formatFee(pageData.legal_fee, CURRENCY),
                        "security fee": formatFee(
                          pageData.security_fee,
                          CURRENCY
                        ),
                        vat: formatFee(pageData.vat_amount, CURRENCY),
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
                        "agency fee": "",
                        "service charge": "",
                        "inspection fee": "",
                        "legal fee": "",
                        "caution fee": "",
                        "security fee": "",
                        vat: "",
                        "other charge": "",
                        "management fee": "",
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

            {pageData.payment_status_desc && (
              <>
                <SwitchUnitPaymentStatus
                  desc={pageData.payment_status_desc}
                  amount={pageData.payment_status_amount || 0}
                />
              </>
            )}

            <div className="w-full h-[2px] bg-opacity-20 bg-[#C0C2C8]" />
            <div className="flex-1 text-base font-medium capitalize custom-flex-col gap-1 mb-4">
              <p className="text-[#747474]">total package</p>
              <p className="text-brand-primary text-xl font-bold">
                {formatFee(Number(pageData.total_package), CURRENCY)}
              </p>
            </div>
          </AccountingTitleSection>
          {(BANK_DETAILS?.account_name || companyBankDetails.account_name) && (
            <AccountingTitleSection title="Account Details">
              <div className="p-6 rounded-lg bg-white dark:bg-darkText-primary">
                <div className="flex gap-6 lg:gap-0 flex-col lg:flex-row">
                  <div className="flex flex-col gap-4 w-full">
                    {/* Primary Account */}
                    <div className="flex w-full">
                      {(BANK_DETAILS?.account_name ||
                        companyBankDetails.account_name) && (
                        <KeyValueList
                          data={{
                            "Account Name":
                              BANK_DETAILS?.account_name ||
                              companyBankDetails.account_name,
                            "Account Number":
                              BANK_DETAILS?.account_number ||
                              companyBankDetails.account_number,
                            "Bank Name":
                              BANK_DETAILS?.bank_name ||
                              companyBankDetails.bank_name,
                          }}
                          chunkSize={1}
                          direction="column"
                          referenceObject={{
                            "Account Name": "",
                            "Account Number": "",
                            "Bank Name": "",
                          }}
                        />
                      )}
                    </div>

                    {/* Wallet Account */}
                    <div className="flex w-full">
                      {walletData?.account.account_name && (
                        <KeyValueList
                          data={{
                            "Account Name": walletData?.account.account_name,
                            "Account Number":
                              walletData?.account.account_number,
                            "Bank Name": walletData?.account.bank,
                          }}
                          chunkSize={1}
                          direction="column"
                          referenceObject={{
                            "Account Name": "",
                            "Account Number": "",
                            "Bank Name": "",
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </AccountingTitleSection>
          )}
          <Signature />
        </div>
        <ExportPageFooter printRef={printRef} />
      </div>
    </div>
  );
};

export default PreviewExpenses;
