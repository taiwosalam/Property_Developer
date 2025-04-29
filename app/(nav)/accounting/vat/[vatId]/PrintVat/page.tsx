"use client";

import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import AccountingTitleSection from "@/components/Accounting/accounting-title-section";
import Button from "@/components/Form/Button/button";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import Signature from "@/components/Signature/signature";
import CustomTable from "@/components/Table/table";
import {
  PaymentStatus,
  printVatTableData,
  printVatTableFields,
  TransformedVatData,
  transformVatData,
  VatPreviewResponse,
} from "./data";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import NetworkError from "@/components/Error/NetworkError";
import ServerError from "@/components/Error/ServerError";
import CustomLoader from "@/components/Loader/CustomLoader";
import ExportPageFooter from "@/components/reports/export-page-footer";

const PrintVatPage = () => {
  const { vatId } = useParams();
  const [fullContent, setFullContent] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const [pageData, setPageData] = useState<TransformedVatData>({
    keyValueData: {
      "VAT ID": "--- ---",
      "Payer name": "--- ---",
      "Payment status": "--- ---" as PaymentStatus,
      "date and time": "--- ---",
      description: "--- ---",
    },
    tableData: [],
  });
  const { data, loading, error, isNetworkError } = useFetch<VatPreviewResponse>(
    `/vat/${vatId}`
  );

  // Transform and set pageData when data is fetched
  useEffect(() => {
    const transformedData = transformVatData(data);
    setPageData(transformedData);
  }, [data]);

  const { keyValueData, tableData } = pageData;

  // Handle loading state
  if (loading)
    return <CustomLoader layout="page" view="table" pageTitle="VAT Preview" />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="custom-flex-col gap-10 pb-28">
      <div className="custom-flex-col gap-[18px]">
        <BackButton as="p">Back</BackButton>
        <div ref={printRef}>
          <ExportPageHeader />
          <h1 className="text-center my-7 font-medium text-2xl">VAT</h1>
          <div className="rounded-lg bg-white dark:bg-darkText-primary p-8 flex gap-6 lg:gap-0 flex-col lg:flex-row">
            <KeyValueList
              data={keyValueData}
              chunkSize={2}
              direction="column"
              referenceObject={{
                "VAT ID": "",
                "Payer name": "",
                "Payment status": "",
                "date and time": "",
                description: "",
              }}
            />
          </div>
          <AccountingTitleSection title="Payment Details">
            <div className="h-[2px] w-full max-w-[670px] bg-[#C0C2C8]" />
            <CustomTable
              className={`${fullContent && "max-h-none"}`}
              fields={printVatTableFields}
              data={tableData}
              tableHeadStyle={{ height: "76px" }}
              tableHeadCellSx={{ fontSize: "1rem" }}
              tableBodyCellSx={{
                fontSize: "1rem",
                paddingTop: "16px",
                paddingBottom: "16px",
              }}
            />
          </AccountingTitleSection>
          <Signature />
        </div>
      </div>
      <ExportPageFooter printRef={printRef} setFullContent={setFullContent} />
    </div>
  );
};

export default PrintVatPage;
