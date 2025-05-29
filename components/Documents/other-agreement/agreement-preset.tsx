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
import { formatPhoneNumbers } from "@/app/(nav)/community/agent-forum/data";
import AgreementSidebarInfo from "./agreement-sidebar";
import AgreementBackground from "@/public/icons/icons";

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

  return (
    <div className="flex flex-col items-start p-6 bg-cover bg-center bg-no-repeat">
      {/* Header */}
      <AgreementHeader />

      {/* Main Content with Sidebar */}
      <div className="flex w-full mt-8 min-h-[65vh]">
        <AgreementSidebarInfo />
        <div className="relative flex w-[90%] min-h-[65vh]">
          {/* Background */}
          <AgreementBackground stroke="var(--secondary-color)" />

          {/* Foreground content */}
          <div className="relative z-10 w-full">{children}</div>
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
