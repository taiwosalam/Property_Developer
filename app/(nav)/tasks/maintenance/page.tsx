"use client";

// Imports
import Button from "@/components/Form/Button/button";
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import FilterButton from "@/components/FilterButton/filter-button";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";
import MaintenanceCard from "@/components/tasks/maintenance/maintenance-card";
import { useAuthStore } from "@/store/authstrore";
import { useEffect, useState } from "react";
import { getALLMaintenance, maintenanceFilterOptionsWithDropdown, maintenanceFilterOptionsWithRadio } from "./data";
import FilterBar from "@/components/FIlterBar/FilterBar";
const Maintenance = () => {
  const accessToken = useAuthStore((state) => state.access_token);
  const [maintenanceData, setMaintenanceData] = useState([]);

  useEffect(() => {
    const fetchMaintenanceData = async () => {
      const response = await getALLMaintenance(accessToken).then((res) => res);
      console.log(response);
    };

    fetchMaintenanceData();
  }, [accessToken]);

  return (
    <div className="custom-flex-col gap-8">
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Total Maintenance"
            newData={34}
            total={657}
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
      <FilterBar azFilter onStateSelect={() => { }} pageTitle="Maintenance" aboutPageModalData={
        { title: "Maintenance", description: "This page contains a list of Maintenance on the platform." }
      } searchInputPlaceholder="Search" handleFilterApply={() => { }} isDateTrue filterOptions={[]} filterWithOptionsWithDropdown={maintenanceFilterOptionsWithDropdown} filterOptionsWithRadio={maintenanceFilterOptionsWithRadio} />
      <AutoResizingGrid minWidth={380} gap={32}>
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <MaintenanceCard
              key={index}
              maintenanceId="12345678"
              status="not started"
              propertyName="David Hall, Moniya"
              dateCreated="21/01/2024"
              serviceProvider="Lawyer"
              startEndDate="21ST - 26TH JAN 2024"
              priority="High"
              serviceType="Legal Work"
            />
          ))}
      </AutoResizingGrid>
    </div>
  );
};

export default Maintenance;
