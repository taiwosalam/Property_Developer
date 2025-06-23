"use client";

// Imports
import Button from "@/components/Form/Button/button";
import ExamineCard from "@/components/tasks/Examine/examine-card";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { useEffect, useState } from "react";
import { examineFilterOptionsWithDropdown, getAllExamine } from "./data";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import CreateExamineModal from "@/components/tasks/Examine/create-examine-modal";
import useFetch from "@/hooks/useFetch";
import { ExamineApiResponse } from "./type";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";

const Examine = () => {
  const [examineData, setExamineData] = useState<ExamineApiResponse | null>(
    null
  );

  const [isOpen, setIsOpen] = useState(false); 

  const {
    data: apiData,
    loading,
    silentLoading,
    error,
    isNetworkError,
    refetch,
  } = useFetch<ExamineApiResponse>(`examine`);

  useRefetchOnEvent("dispatchExamine", () => refetch({ silent: true }));

  useEffect(() => {
    if (apiData) {
      setExamineData(apiData);
    }
  }, [apiData]);

  return (
    <div className="space-y-9">
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Total Examine"
            newData={examineData?.total_examine_month || 0}
            total={examineData?.total_examine || 0}
            colorScheme={1}
          />
        </div>
        <Modal state={{
          isOpen: isOpen,
          setIsOpen: setIsOpen,
        }}>
          <ModalTrigger asChild>
            <Button className="page-header-button">+ create new</Button>
          </ModalTrigger>
          <ModalContent>
            <CreateExamineModal setIsOpen={setIsOpen}/>
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
        {examineData && examineData?.data.length > 0
          ? examineData.data.map((examine) => {
              return (
                <ExamineCard
                  key={examine.id}
                  id={examine.id}
                  viewOnly={false}
                  title={examine.title}
                  description={examine.description}
                  examine_date={examine.examine_date}
                  image={examine.image}
                />
              );
            })
          : "Np examine Data"}
      </AutoResizingGrid>
    </div>
  );
};

export default Examine;
