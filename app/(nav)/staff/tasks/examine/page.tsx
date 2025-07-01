"use client";

// Imports
import Button from "@/components/Form/Button/button";
import ExamineCard from "@/components/tasks/Examine/examine-card";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { useState } from "react";
import { examineFilterOptionsWithDropdown, getAllExamine } from "./data";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import CreateExamineModal from "@/components/tasks/Examine/create-examine-modal";

const Examine = () => {
  const [examineData, setExamineData] = useState();

  return (
    <div className="space-y-9">
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Total Examine"
            newData={34}
            total={657}
            colorScheme={1}
          />
        </div>
        <Modal>
          <ModalTrigger asChild>
            <Button className="page-header-button">+ create new</Button>
          </ModalTrigger>
          <ModalContent>
            <CreateExamineModal />
          </ModalContent>
        </Modal>
      </div>
      <FilterBar
        azFilter
        pageTitle="Examine"
        aboutPageModalData={{
          title: "Examine",
          description: "This page contains a list of Examine on the platform.",
        }}
        searchInputPlaceholder="Search for Examine"
        handleFilterApply={() => {}}
        isDateTrue
        filterOptionsMenu={examineFilterOptionsWithDropdown}
        hasGridListToggle={false}
      />
      <AutoResizingGrid minWidth={350} gap={32}>
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <ExamineCard key={index} image={[{ path: "/placeholder-image.png" }]} service={[]} />
          ))}
      </AutoResizingGrid>
    </div>
  );
};

export default Examine;
