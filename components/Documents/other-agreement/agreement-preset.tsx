"use client";

import React, { useEffect, useState } from "react";
import AgreementHeader from "./doc-header";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { useGlobalStore } from "@/store/general-store";
import {
  CompanyDataApiResponse,
  initialPageData,
  ProfileSettingsPageState,
  transformProfileApiResponse,
} from "@/app/(nav)/settings/company/data";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { formatPhoneNumbers } from "@/app/(nav)/management/agent-community/data";

interface AgreementLayoutProps {
  children: React.ReactNode;
}

const AgreementLayout = ({ children }: AgreementLayoutProps) => {
  const company_id = usePersonalInfoStore((state) => state.company_id);
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const currentCompanyData = useGlobalStore.getState()?.profileSettingsData;
  const [state, setState] = useState<ProfileSettingsPageState>(initialPageData);
  // FETCH API DATA
  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch(`/companies/${company_id}`);
  useRefetchOnEvent("refetchProfile", () => refetch({ silent: true }));

  useEffect(() => {
    if (apiData) {
      const transformedData: ProfileSettingsPageState =
        transformProfileApiResponse(apiData as CompanyDataApiResponse);
      if (
        JSON.stringify(currentCompanyData) !== JSON.stringify(transformedData)
      ) {
        setGlobalStore("profileSettingsData", transformedData);
      }
      setState(transformedData);
    }
  }, [apiData]);

  console.log("currentCompanyData", currentCompanyData);

  return (
    <div className="flex flex-col items-start p-6 bg-cover bg-center bg-no-repeat">
      {/* Header */}
      <AgreementHeader />

      {/* Main Content with Sidebar */}
      <div className="flex w-full mt-8 min-h-[65vh]">
        {/* Sidebar (10% width) */}
        {/* <div className="flex w-[10%] h-full flex-col justify-between text-white">
          <p className="writing-mode-vertical-rl transform rotate-90 text-sm flex-1 flex text-black items-center justify-center">
            {formatPhoneNumbers(currentCompanyData?.companyData?.phone_number)}
          </p>
          <p className="writing-mode-vertical-rl transform rotate-90 text-sm flex-1 flex text-black items-center justify-center">
            {currentCompanyData?.companyData?.email ?? ""}
          </p>
          {currentCompanyData?.companyData?.head_office_address && (
            <p className="writing-mode-vertical-rl transform rotate-90 text-sm flex-1 flex text-black items-center justify-center">
              {currentCompanyData?.companyData?.head_office_address},{" "}
              {currentCompanyData?.companyData?.city}, {currentCompanyData?.companyData?.state}
            </p>
          )}
        </div> */}

        <div className="w-[10%] flex items-center justify-center text-black min-h-[65vh]">
          <div className="transform -rotate-90 text-sm whitespace-pre text-center leading-6">
            {formatPhoneNumbers(currentCompanyData?.companyData?.phone_number)}
            {"\n"}
            {currentCompanyData?.companyData?.email ?? ""}
            {"\n"}
            {currentCompanyData?.companyData?.head_office_address},{" "}
            {currentCompanyData?.companyData?.city},{" "}
            {currentCompanyData?.companyData?.state}
          </div>
        </div>

        {/* Main Content Area (90% width) */}
        <div
          className="flex w-[90%]"
          style={{
            backgroundImage: "url(/empty/agreement.svg)",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {children}
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-8 flex items-center justify-center w-full">
        <h2 className="text-center uppercase text-3xl font-bold mx-auto">
          {currentCompanyData?.companyData?.company_name || ""}
        </h2>
      </div>
    </div>
  );
};

export default AgreementLayout;
