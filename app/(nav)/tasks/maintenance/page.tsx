"use client";

// Imports
import Button from "@/components/Form/Button/button";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import MaintenanceCard from "@/components/tasks/maintenance/maintenance-card";
import { useEffect, useState } from "react";
import {
  getALLMaintenance,
  IMaintenanceCard,
  maintenanceFilterOptionsWithDropdown,
  transformMaintenanceCard,
} from "./data";
import FilterBar from "@/components/FIlterBar/FilterBar";
import useFetch from "@/hooks/useFetch";
import ServerError from "@/components/Error/ServerError";
import NetworkError from "@/components/Error/NetworkError";
import CardsLoading from "@/components/Loader/CardsLoading";
import { MaintenanceApiResponse } from "./type";
import PageLoader from "next/dist/client/page-loader";
import { PropertyrequestSkeletonLoader } from "@/components/Loader/property-request-loader";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";

const Maintenance = () => {
  const [maintenanceData, setMaintenanceData] =
    useState<IMaintenanceCard | null>(null);

  const {
    data: apiData,
    silentLoading,
    error,
    loading,
    isNetworkError,
    refetch,
  } = useFetch<MaintenanceApiResponse>(`maintenance`);

  useRefetchOnEvent("dispatchMaintenance", () => refetch({ silent: true }));

  useEffect(() => {
    // getALLMaintenance;
    if (apiData) {
      const transformData = transformMaintenanceCard(apiData);
      setMaintenanceData(transformData);
    }
  }, [apiData]);

  if (loading) {
    return (
      <AutoResizingGrid gap={28} minWidth={380}>
        <PropertyrequestSkeletonLoader length={10} />
      </AutoResizingGrid>
    );
  }
  if (error) return <ServerError error={error} />;
  if (isNetworkError) return <NetworkError />;

  return (
    <div className="custom-flex-col gap-8">
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Total Maintenance"
            newData={maintenanceData?.stats.this_month || 0}
            total={maintenanceData?.stats.total || 0}
            colorScheme={1}
          />
        </div>
        <div className="flex items-center">
          <Button
            href="/tasks/maintenance/create-new"
            className="page-header-button"
          >
            + create maintenance
          </Button>
        </div>
      </div>
      <FilterBar
        hasGridListToggle={false}
        azFilter
        pageTitle="Maintenance"
        aboutPageModalData={{
          title: "Maintenance",
          description:
            "This page contains a list of Maintenance on the platform.",
        }}
        searchInputPlaceholder="Search maintenance"
        handleFilterApply={() => {}}
        isDateTrue
        filterOptionsMenu={maintenanceFilterOptionsWithDropdown}
      />
      <section className="w-full">
        <AutoResizingGrid minWidth={380} gap={32}>
          {maintenanceData
            ? maintenanceData?.data.map((card, i) => {
                return (
                  <MaintenanceCard
                    key={i}
                    card={card.card}
                    modal={card.modal}
                  />
                );
              })
            : "No Maintenance Yet"}
        </AutoResizingGrid>
      </section>
    </div>
  );
};

export default Maintenance;
