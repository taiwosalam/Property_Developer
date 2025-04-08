"use client";

import CustomTable from "@/components/Table/table";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import BackButton from "@/components/BackButton/back-button";
import {
  TenantListResponse,
  TenantReport,
  tenantsReportTableFields,
  transformTenantData,
} from "../data";
import Signature from "@/components/Signature/signature";
import ExportPageFooter from "@/components/reports/export-page-footer";
import { useEffect, useRef, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

const ExportTenants = () => {
  const exportRef = useRef<HTMLDivElement>(null);
  const [fullContent, setFullContent] = useState(false);
  const [tenant_reports, setTenant_reports] = useState<TenantReport>({
    total_tenants: 0,
    monthly_tenants: 0,
    tenants: [],
  });

  const { data, loading, error, isNetworkError } =
    useFetch<TenantListResponse>("/report/tenants");

  useEffect(() => {
    if (data) {
      setTenant_reports(transformTenantData(data));
    }
  }, [data]);

  const { total_tenants, monthly_tenants, tenants } = tenant_reports;
  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Tenants/Occupants" view="table" />
    );
  if (isNetworkError) return <NetworkError />;
  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;
  return (
    <div className="space-y-9 pb-[100px]">
      <BackButton as="p">Back</BackButton>
      <div ref={exportRef} className="space-y-9">
        <ExportPageHeader />
        <div className="space-y-3">
          <h1 className="text-center text-black text-lg md:text-xl lg:text-2xl font-medium">
            Summary{" "}
            <span className="px-2">{`(${dayjs().format(
              "Do MMMM YYYY"
            )})`}</span>
          </h1>
        </div>

        <CustomTable
          className={`${fullContent && "max-h-none"}`}
          fields={tenantsReportTableFields}
          data={tenants}
          tableHeadClassName="h-[45px]"
          tableBodyCellSx={{ color: "#3F4247" }}
        />
        <Signature />
      </div>
      <ExportPageFooter printRef={exportRef} setFullContent={setFullContent} />
    </div>
  );
};

export default ExportTenants;
