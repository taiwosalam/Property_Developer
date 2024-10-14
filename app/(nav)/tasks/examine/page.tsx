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
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authstrore";
import { getAllExamine } from "./data";
import FilterBar from "@/components/FIlterBar/FilterBar";

const Examine = () => {
  const access_token = useAuthStore((state) => state.access_token);
  const [examineData, setExamineData] = useState();

  useEffect(() => {
    const fetchExamineData = (): void => {
      getAllExamine(access_token)
        .then((data) => {
          setExamineData(data);
        })
        .catch((error) => {
          console.error("Error fetching examines:", error);
        });
    };

    fetchExamineData();
  }
    , [access_token]);
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
      <FilterBar azFilter onStateSelect={() => { }} pageTitle="Examine" aboutPageModalData={
        { title: "Examine", description: "This page contains a list of Examine on the platform." }
      } searchInputPlaceholder="Search" handleFilterApply={() => { }} isDateTrue filterOptions={[]} filterWithOptionsWithDropdown={[]} />
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
