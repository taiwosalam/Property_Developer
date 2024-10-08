"use client";

// Imports
import Button from "@/components/Form/Button/button";
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import ExamineCard from "@/components/tasks/Examine/examine-card";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import FilterButton from "@/components/FilterButton/filter-button";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";

const Examine = () => {
  return (
    <div className="space-y-9">
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Total Examine"
            newData={34}
            total={657}
          />
        </div>
        <Button href="" className="page-header-button">
          + create new
        </Button>
      </div>
      <div className="page-title-container">
        <PageTitle title="Examine" />
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
      <AutoResizingGrid minWidth={350} gap={32}>
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <ExamineCard key={index} />
          ))}
      </AutoResizingGrid>
    </div>
  );
};

export default Examine;
