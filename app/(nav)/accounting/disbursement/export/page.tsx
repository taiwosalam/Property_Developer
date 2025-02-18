"use client";

// Imports

import Signature from "@/components/Signature/signature";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import BackButton from "@/components/BackButton/back-button";
import ExportPageFooter from "@/components/reports/export-page-footer";
import CustomTable from "@/components/Table/table";
import { DisburseApiResponse, disbursementTableData, disbursementTableFields, transformDisburseData, TransformedDisburseItem } from "../data";
import useFetch from "@/hooks/useFetch";
import { useEffect, useRef, useState } from "react";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";

const ExportDisbursement = () => {
  const exportRef = useRef<HTMLDivElement>(null);
  const [tableData, setTableData] = useState<TransformedDisburseItem[]>([]);
  // Filter out the action field for the export page
  const exportTableFields = disbursementTableFields.filter(
    (field) => field.accessor !== "action"
  );

  const { data, loading, error, isNetworkError } = useFetch<DisburseApiResponse>("/disburses");

  useEffect(() => {
    if (data) {
      const transformed = transformDisburseData(data);
      setTableData(transformed);
    }
  }, [data]);

  if (loading) return <CustomLoader layout="page" pageTitle="Disbursement" view="table" />
  if (isNetworkError) return <NetworkError />;
  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;



  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <div className="custom-flex-col gap-[18px]">
        <BackButton as="p">Back</BackButton>
        <div ref={exportRef} className="space-y-9">
          <ExportPageHeader />
          <div className="rounded-lg bg-white dark:bg-darkText-primary p-8 flex gap-6 lg:gap-0 flex-col lg:flex-row">
            <KeyValueList
              data={{}}
              chunkSize={1}
              direction="column"
              referenceObject={{
                "summary id": "",
                "start date": "",
                "end date": "",
              }}
            />
          </div>
        </div>
        <div className="custom-flex-col gap-6">
          <h1 className="text-black dark:text-white text-2xl font-medium text-center">
            Disbursement Summary
          </h1>
          <CustomTable
            fields={exportTableFields}
            data={tableData}
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
      <ExportPageFooter printRef={exportRef} />
    </div>
  );
};

export default ExportDisbursement;
