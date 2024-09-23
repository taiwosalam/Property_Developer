"use client";

// Imports
import useWindowWidth from "@/hooks/useWindowWidth";
import Button from "@/components/Form/Button/button";
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import FilterButton from "@/components/FilterButton/filter-button";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";
import MaintenanceCard from "@/components/tasks/maintenance/maintenance-card";
const Maintenance = () => {
  const { isSmallTablet } = useWindowWidth();

  return (
    <div className="custom-flex-col gap-8">
      <div className="page-header-container gap-6">
        {!isSmallTablet && (
          <AutoResizingGrid minWidth={280}>
            <ManagementStatistcsCard
              title="Total Maintenance"
              newData={34}
              total={657}
            />
          </AutoResizingGrid>
        )}
        <div className="flex items-center">
          <Button href="/tasks/maintenance/create-new" className="page-header-button">
            + create maintenance
          </Button>
        </div>
      </div>
      <div className="page-title-container">
        <PageTitle title="Maintenance" />
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput placeholder="Search" />
          <Modal>
            <ModalTrigger asChild>
              <FilterButton />
            </ModalTrigger>
            <ModalContent>Hi</ModalContent>
          </Modal>
        </div>
      </div>
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
