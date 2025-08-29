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
  getOtherCurrencyFromVats,
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
import { useGlobalStore } from "@/store/general-store";
import dayjs from "dayjs";

const ExportVat = () => {
  const [fullContent, setFullContent] = useState(false);
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
  const filteredAccountingVat = useGlobalStore((s) => s.accounting_vat);
  const filteredData = useGlobalStore((s) => s.accounting_vat_data);
  const vatTimeRangeLabel =
    useGlobalStore((s) => s.vatTimeRangeLabel) || "Last 3 months";

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

  const otherCurrency = getOtherCurrencyFromVats(apiData?.data.vats || []);

  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <div className="custom-flex-col gap-[18px]">
        <BackButton as="p">Back</BackButton>
        <div ref={printRef}>
          <ExportPageHeader />
          <div className="rounded-lg my-4 bg-white dark:bg-darkText-primary p-8 flex">
            <KeyValueList
              data={{
                "export id": "638798",
                branch: "Bodija Branch",
                "branch manager": "Ajadi Ola",
                "start date": "29th July 2009",
                "end date": "30th June 2009",
              }}
              chunkSize={2}
              direction="column"
              referenceObject={{
                "export id": "",
                branch: "",
                "branch manager": "",
                "start date": "",
                "end date": "",
              }}
            />
          </div>
          <div className="custom-flex-col gap-6">
            <h1 className="text-black my-4 dark:text-white text-lg md:text-xl lg:text-2xl font-medium text-center">
              VAT Summary -{" "}
              <span className="px-2">{`(${dayjs().format(
                "Do MMMM YYYY"
              )})`}</span>
            </h1>
            <AutoResizingGrid gap={24} minWidth={300}>
              <AccountStatsCard
                className="!min-w-[320px] shrink-0"
                title="Total VAT Created"
                balance={"500,000"}
                variant="redOutgoing"
                trendDirection={20 < 0 ? "down" : "up"}
                trendColor={10 < 0 ? "red" : "green"}
                percentage={20}
              />
              <AccountStatsCard
                className="!min-w-[320px] shrink-0"
                title="Total Paid VAT"
                balance={"200,000"}
                variant="blueIncoming"
                trendDirection={20 < 0 ? "down" : "up"}
                trendColor={3 < 0 ? "red" : "green"}
                percentage={10}
              />
              <AccountStatsCard
                className="!min-w-[320px] shrink-0"
                title="Total Pending VAT"
                balance={"320,000"}
                variant="yellowCard"
                trendDirection={20 > 0 ? "down" : "up"}
                trendColor={20 < 0 ? "red" : "green"}
                percentage={20}
              />
            </AutoResizingGrid>
            <CustomTable
              fields={vatTableFields}
              data={vatTableData}
              tableHeadStyle={{ height: "76px" }}
              tableHeadCellSx={{ fontSize: "1rem" }}
              tableBodyCellSx={{
                fontSize: "1rem",
                paddingTop: "12px",
                paddingBottom: "12px",
              }}
              // handleSelect={handleRowClick}
            />
            <Signature />
          </div>
        </div>
      </div>
      <ExportPageFooter printRef={printRef} setFullContent={setFullContent} />
    </div>
  );
};

export default ExportVat;
