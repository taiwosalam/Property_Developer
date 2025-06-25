"use client";

import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import Button from "@/components/Form/Button/button";
import ExportPageHeader from "@/components/reports/export-page-header";
import { SectionContainer } from "@/components/Section/section-components";
import { LandlordTenantInfoBox } from "@/components/Management/landlord-tenant-info-components";
import { examineService, inspectionCheckList } from "../manage/data";
import useFetch from "@/hooks/useFetch";
import { useParams } from "next/navigation";
import ServerError from "@/components/Error/ServerError";
import NetworkError from "@/components/Error/NetworkError";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { ExamineReportApiResponse } from "./type";
import { IExamineReportPageData, transformExamineReportPageData } from "./data";
import { useEffect, useRef, useState } from "react";
import ExportPageFooter from "@/components/reports/export-page-footer";

const ExamineReportpage = () => {
  const params = useParams();
  const paramId = params?.examineId as string;

  const exportRef = useRef<HTMLDivElement | null>(null);

  const [pageData, setPageData] = useState<IExamineReportPageData | null>(null);

  const commonBoxStyle: React.CSSProperties = {
    boxShadow:
      "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
  };
  const commonBoxClassName = "py-6 px-4 rounded-lg space-y-2";

  const {
    data: apiData,
    loading,
    silentLoading,
    error,
    isNetworkError,
  } = useFetch<ExamineReportApiResponse>(`/examine/${paramId}`);

  useEffect(() => {
    if (apiData) {
      const transformData = transformExamineReportPageData(apiData);
      setPageData(transformData);
    }
  }, [apiData]);

  const summaryLookup = (pageData?.inspection_summary || []).reduce(
    (acc, obj) => {
      if (obj && typeof obj === "object") {
        const [key, value] = Object.entries(obj)[0];
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, string>
  );
  const checkListLookup = (pageData?.inspection_checklist || []).reduce(
    (acc, obj) => {
      if (obj && typeof obj === "object") {
        const [key, value] = Object.entries(obj)[0];
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, string>
  );

  if (loading) <PageCircleLoader />;
  if (error) <ServerError error={error} />;
  if (isNetworkError) <NetworkError />;

  return (
    <div className="space-y-8 pb-[100px]">
      <BackButton as="p">Back</BackButton>
      <div className="space-y-8 pb-[100px]" ref={exportRef}>
        <ExportPageHeader />
        <h1 className="text-black dark:text-white text-lg md:text-xl lg:text-2xl font-medium text-center">
          Property Inspection Report
        </h1>
        <div className="grid md:grid-cols-2 gap-8">
          <LandlordTenantInfoBox
            className={`${commonBoxClassName}`}
            style={commonBoxStyle}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-text-tertiary dark:text-darkText-1 text-[16px] font-medium">
                Inspected Date:
              </p>
              <p className="text-sm font-medium text-text-secondary dark:text-darkText-2 text-right">
                {pageData?.inspection_date}
              </p>
            </div>
            <div className="flex items-start justify-between gap-2">
              <p className="text-text-tertiary dark:text-darkText-1 text-[16px] font-medium">
                Added Guest:
              </p>
              <p className="text-sm font-medium text-text-secondary dark:text-darkText-2 text-right">
                {pageData?.guest}
              </p>
            </div>
          </LandlordTenantInfoBox>
          <LandlordTenantInfoBox
            className={`${commonBoxClassName}`}
            style={commonBoxStyle}
          >
            <p className="text-base font-medium text-text-tertiary dark:text-darkText-1">
              Description
            </p>
            {pageData?.description && (
              <div
                className="text-sm font-medium text-text-secondary dark:text-darkText-2"
                dangerouslySetInnerHTML={{ __html: pageData.description }}
              />
            )}
          </LandlordTenantInfoBox>
        </div>

        <SectionContainer heading="Service connected to property">
          {pageData && pageData?.services?.length > 0 ? (
            <AutoResizingGrid minWidth={220}>
              {pageData?.services?.map((service, index) => (
                <span key={index}>{service}</span>
              ))}
            </AutoResizingGrid>
          ) : (
            "--- ---"
          )}
        </SectionContainer>

        <SectionContainer heading="Site Summary">
          <AutoResizingGrid minWidth={340}>
            {[
              "Age of Building",
              "Construction Type",
              "Roof",
              "Condition",
              "Extension/ Renovation",
              "Out Buildings",
              "Sub Floor",
              "Site",
              "Compare to others",
            ].map((item, index) => (
              <ExamineKeyValue
                key={item + index}
                itemKey={item}
                value={summaryLookup[item] || "N/A"}
              />
            ))}
          </AutoResizingGrid>
        </SectionContainer>
        <SectionContainer heading="Inspection Checklist">
          <AutoResizingGrid minWidth={340}>
            {inspectionCheckList.map((item, index) => (
              <ExamineKeyValue
                key={item + index}
                itemKey={item}
                value={checkListLookup[item] || "N/A"}
              />
            ))}
          </AutoResizingGrid>
        </SectionContainer>
        <SectionContainer heading="Inspection Summary Note">
          {pageData && (
            <div
              className="text-text-secondary dark:text-darkText-2 text-[16px] font-normal"
              dangerouslySetInnerHTML={{
                __html: pageData?.summary_note ?? "--- ---",
              }}
            />
          )}
        </SectionContainer>
      </div>
      <ExportPageFooter printRef={exportRef} noBack={false}/>
    </div>
  );
};

export default ExamineReportpage;

const ExamineKeyValue: React.FC<{
  itemKey: string;
  value?: string;
}> = ({ itemKey, value = "N/A" }) => {
  return (
    <div className="w-full">
      <span className="text-text-secondary dark:text-darkText-2 text-[16px] font-normal">
        {itemKey} --------- {value}
      </span>
    </div>
  );
};
