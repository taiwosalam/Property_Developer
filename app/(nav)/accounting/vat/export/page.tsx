"use client";

// Imports
import Signature from "@/components/Signature/signature";
import CustomTable from "@/components/Table/table";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import AccountStatsCard from "@/components/Accounting/account-stats-card";
import BackButton from "@/components/BackButton/back-button";
import {
  VATAPIResponse,
  VATPageState,
  initialVATPageState,
  transformVATAPIResponse,
  vatTableData,
  vatTableFields,
} from "../data";
import ExportPageFooter from "@/components/reports/export-page-footer";
import { useEffect, useRef, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { variants } from "@/utils/slider";
import NetworkError from "@/components/Error/NetworkError";

const ExportVat = () => {
  const [pageData, setPageData] = useState<VATPageState>(initialVATPageState);
  const {
    total_paid_vat,
    total_pending_vat,
    total_vat_created,
    percentage_change_paid,
    percentage_change_pending,
    percentage_change_total,
    vats,
  } = pageData;

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
  } = useFetch<VATAPIResponse>("/vat/list");

  useEffect(() => {
    if (apiData) {
      setPageData((x) => ({
        ...x,
        ...transformVATAPIResponse(apiData),
      }));
    }
  }, [apiData]);

  const transformedTableData = vats.map((item) => ({
    ...item,
    total_vat: (
      <p className={item.total_vat ? "text-status-success-3" : ""}>
        {item.total_vat ? item.total_vat : "--- ---"}
      </p>
    ),
  }));

  const printRef = useRef<HTMLDivElement>(null);

  if (isNetworkError) return <NetworkError />;
  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <div className="custom-flex-col gap-[18px]">
        <BackButton as="p">Back</BackButton>
        <div ref={printRef}>
          <ExportPageHeader />
          <div className="rounded-lg bg-white dark:bg-darkText-primary p-8 flex">
            <KeyValueList
              data={{
                "summary id": "123456",
                "start date": "02/03/2024",
                "end date": "02/03/2024",
              }}
              chunkSize={1}
              direction="column"
              referenceObject={{
                "summary id": "",
                "start date": "",
                "end date": "",
              }}
            />
          </div>
          <div className="custom-flex-col gap-6">
            <h1 className="text-black dark:text-white text-2xl font-medium text-center">
              VAT Summary
            </h1>
            <AutoResizingGrid gap={24} minWidth={300}>
              <AccountStatsCard
                title="Total Vat Created"
                balance={total_vat_created}
                percentage={percentage_change_total}
                variant="blueIncoming"
                trendDirection="up"
                trendColor="green"
              />
              <AccountStatsCard
                title="Total Paid Vat"
                balance={total_paid_vat}
                variant="greenIncoming"
                trendDirection="down"
                trendColor="red"
                percentage={percentage_change_paid}
              />
              <AccountStatsCard
                title="Total Pending Vat"
                balance={total_pending_vat}
                variant="yellowCard"
                trendDirection="down"
                trendColor="red"
                percentage={percentage_change_pending}
              />
            </AutoResizingGrid>
            <CustomTable
              fields={vatTableFields}
              data={transformedTableData}
              tableHeadStyle={{ height: "76px" }}
              tableHeadCellSx={{ fontSize: "1rem" }}
              tableBodyCellSx={{
                fontSize: "1rem",
                paddingTop: "12px",
                paddingBottom: "12px",
              }}
            />
            <Signature />
          </div>
        </div>
      </div>
      <ExportPageFooter printRef={printRef} />
    </div>
  );
};

export default ExportVat;
