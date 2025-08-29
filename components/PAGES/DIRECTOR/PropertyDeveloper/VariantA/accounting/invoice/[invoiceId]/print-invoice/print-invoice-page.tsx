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
import {
  defaultInvoiceData,
  generateTableDataManageInvoice,
  invoiceManageTableFields,
  transformInvoiceData,
} from "../manage/data";
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
import CustomTable from "@/components/Table/table";

const PreviewExpenses = () => {
  const router = useRouter();
  const { invoiceId } = useParams();
//  const [pageData, setPageData] = useState<InvoicePageData>(defaultInvoiceData);
  // const {
  //   companyBankDetails,
  //   error: bankError,
  //   loading: bankLoading,
  // } = useCompanyBankDetails();
  // const { data, error, loading, isNetworkError } = useFetch<InvoiceResponse>(
  //   `/invoice/${invoiceId}`
  // );

  // const {
  //   data: walletData,
  //   error: walletError,
  //   refetch: walletRefetch,
  // } = useFetch<WalletDataResponse>("/wallets/dashboard");

  // useEffect(() => {
  //   if (data) {
  //     setPageData(transformInvoiceData(data.data));
  //   }
  // }, [data]);

   const printRef = useRef<HTMLDivElement>(null);

  // const BANK_DETAILS = pageData.branchBankDetails;

  // const CURRENCY = pageData.currency || "naira"; //TODO: change to real currency from endpount
  // const IS_PAID = pageData.status.toLowerCase() === "paid";
  // const UNIT_ID = pageData.unit_id;

  // const UnitKeyValData = {
  //   "invoice id": pageData.invoice_id,
  //   "property name": pageData.property_name,
  //   "Client name": capitalizeWords(pageData.client_name),
  //   date: pageData.invoice_date,
  //   "account officer": pageData.account_officer,
  //   "unit name": pageData.unit_name,
  //   "invoice type": pageData.invoice_type,
  //   status: pageData.status,
  // };

  // const NoUnitKeyValData = {
  //   "invoice id": pageData.invoice_id,
  //   "property name": pageData.property_name,
  //   "client name": capitalizeWords(pageData.client_name),
  //   date: pageData.invoice_date,
  //   status: pageData.status,
  //   "Auto Generate": pageData.auto_generate,
  // };

  // const UnitRefObj = {
  //   "invoice id": "",
  //   "Client name": "",
  //   "property name": "",
  //   date: "",
  //   "account officer": "",
  //   "unit name": "",
  //   "invoice type": "",
  //   status: "",
  // };

  // const NoUnitRefObj = {
  //   "invoice id": "",
  //   "property name": "",
  //   "client name": "",
  //   "Auto Generate": "",
  //   date: "",
  //   status: "",
  // };

  // const KEY_VALUE_DATA = UNIT_ID ? UnitKeyValData : NoUnitKeyValData;
  // const KEY_VALUE_REF_OBJ = UNIT_ID ? UnitRefObj : NoUnitRefObj;

  // if (loading) return <PageCircleLoader />;
  // if (error) return <ServerError error={error} />;
  // if (isNetworkError) return <NetworkError />;

  return (
    <div className="custom-flex-col gap-10 pb-28">
      <div className="custom-flex-col gap-[18px]">
        <BackButton as="p">Back</BackButton>
        <div ref={printRef}>
          <ExportPageHeader />
          <h1 className="text-center my-7 font-medium text-2xl">Invoice</h1>
          <div className="rounded-lg bg-white dark:bg-darkText-primary p-8 flex gap-6 lg:gap-0 flex-col lg:flex-row">
            <KeyValueList
              data={{
                "invoice id": "6736878",
                "property name": "House On Hill",
                "account officer": "Ajadi Kola",
                "customer name": "Kunle Afod",
                date: "12 July 1990",
                "unit id": "767638932",
              }}
              direction={"column"}
              chunkSize={2}
              referenceObject={{
                "invoice id": "",
                "property name": "",
                "account officer": "",
                "customer name": "",
                date: "",
                "unit id": "",
              }}
            />
          </div>

          <AccountingTitleSection title="Details">
            <CustomTable
              fields={invoiceManageTableFields}
              //displayTableHead={false}
              data={generateTableDataManageInvoice(4)}
              //tableHeadStyle={{ height: "76px" }}
              //tableHeadCellSx={{ fontSize: "1rem" }}
            />
          </AccountingTitleSection>
          <AccountingTitleSection title="account Details">
            <div className="rounded-lg bg-white dark:bg-darkText-primary p-8 flex gap-6 lg:gap-0 flex-col lg:flex-row">
              <KeyValueList
                data={{
                  "account number": "673687822",
                  "account name": "Ajadi Kola",
                  "bank name": "Ajoke Kola",
                }}
                direction="column"
                chunkSize={1}
                referenceObject={{
                  "account number": "",
                  "account name": "",
                  "bank name": "",
                }}
              />
            </div>
          </AccountingTitleSection>
          <div className="flex justify-end text-right py-12 flex-col items-end space-y-6">
            <Signature />
          </div>
        </div>
        <ExportPageFooter printRef={printRef} />
      </div>
    </div>
  );
};

export default PreviewExpenses;
