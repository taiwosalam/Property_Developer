"use client";

// Imports
import Button from "@/components/Form/Button/button";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import MaintenanceCard from "@/components/tasks/maintenance/maintenance-card";
import { useEffect, useState } from "react";
import {
  getALLMaintenance,
  maintenanceFilterOptionsWithDropdown,
} from "./data";
import FilterBar from "@/components/FIlterBar/FilterBar";

const Maintenance = () => {
  const [maintenanceData, setMaintenanceData] = useState([]);

  useEffect(() => {
    // getALLMaintenance;
  }, []);

  return (
    <div className="custom-flex-col gap-8">
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Total Maintenance"
            newData={34}
            total={657}
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
      <AutoResizingGrid minWidth={380} gap={32}>
        {Array(10)
          .fill(null)
          .map((_, index) => {
            const statuses: ("not started" | "ongoing" | "completed")[] = [
              "not started",
              "ongoing",
              "completed",
            ];
            return (
              <MaintenanceCard
                key={index}
                maintenanceId="12345678"
                status={statuses[index % 3]}
                propertyName="David Hall, Moniya"
                dateCreated="21/01/2024"
                serviceProvider="Lawyer"
                startEndDate="21ST - 26TH JAN 2024"
                priority="High"
                serviceType="Legal Work"
              />
            );
          })}
      </AutoResizingGrid>
    </div>
  );
};

export default Maintenance;
