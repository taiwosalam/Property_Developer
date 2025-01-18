"use client";

import { complaintsFilterOptionsWithDropdown } from "@/app/(nav)/tasks/complaints/data";
import BackButton from "@/components/BackButton/back-button";
import { KanbanBoard } from "@/components/dashboard/kanban/KanbanBoard";
import { TaskCard } from "@/components/dashboard/kanban/TaskCard";
import FilterBar from "@/components/FIlterBar/FilterBar";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { SectionContainer } from "@/components/Section/section-components";
import useWindowWidth from "@/hooks/useWindowWidth";
import { LocationIcon } from "@/public/icons/icons";
import useBranchStore from "@/store/branch-store";

const BranchComplaintsPage = () => {
  const { isMobile } = useWindowWidth();
  const { branch } = useBranchStore();
  return (
    <div className="space-y-7">
      <div className="w-full gap-2 flex items-center justify-between flex-wrap">
        <BackButton reducePaddingTop as="div" className="items-start">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white">
            {branch?.branch_name}
          </h1>
          <div className="text-text-disabled flex items-center space-x-1">
            <LocationIcon />
            <p className="text-sm font-medium">{branch?.address}</p>
          </div>
        </BackButton>
      </div>
      <FilterBar
        hasGridListToggle={false}
        azFilter
        pageTitle="Complains"
        aboutPageModalData={{
          title: "Complains",
          description:
            "This page contains a list of Complains on the platform.",
        }}
        searchInputPlaceholder="Search for Task"
        handleFilterApply={() => {}}
        isDateTrue
        filterOptionsMenu={complaintsFilterOptionsWithDropdown}
      />
      <SectionContainer heading="Recent Complains">
        <div className="bg-white dark:bg-[#3C3D37] p-6 border-2 border-dashed rounded-lg border-gray-300 gap-4 flex items-center overflow-x-scroll no-scrollbar">
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <TaskCard
                styles="min-w-[352.66px]"
                statusChanger={false}
                noDrag
                isNew
                key={index}
                task={{
                  id: "task9",
                  columnId: "approved",
                  content: {
                    messageCount: 2,
                    linkCount: 1,
                    userAvatars: [
                      "/empty/avatar.png",
                      "/empty/avatar.png",
                      "/empty/avatar.png",
                    ],
                    date: "25 Jan 2024",
                    status: "pending",
                    progress: 50,
                  },
                  name: "John Doe",
                  title: "Project Manager",
                  message:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                  avatarSrc: "/empty/avatar.png",
                }}
              />
            ))}
        </div>
      </SectionContainer>
      {!isMobile && (
        <SectionContainer heading="All Complaints">
          <KanbanBoard />
        </SectionContainer>
      )}

      {/* infinite scroll later */}
    </div>
  );
};

export default BranchComplaintsPage;
