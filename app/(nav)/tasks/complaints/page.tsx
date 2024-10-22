"use client";

import { KanbanBoard } from "@/components/dashboard/kanban/KanbanBoard";
import { TaskCard } from "@/components/dashboard/kanban/TaskCard";
import FilterBar from "@/components/FIlterBar/FilterBar";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Pagination from "@/components/Pagination/pagination";
import { SectionContainer } from "@/components/Section/section-components";
import useWindowWidth from "@/hooks/useWindowWidth";
import { complaintsFilterOptionsWithDropdown } from "./data";

const ComplaintsPage = () => {
  const { isMobile } = useWindowWidth();
  return (
    <div className="space-y-7">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Complaints"
          newData={23}
          total={232}
        />
        <ManagementStatistcsCard
          title="Total Completed"
          newData={23}
          total={34}
        />
        <ManagementStatistcsCard
          title="Total Rejected"
          newData={32}
          total={453}
        />
      </div>

      <SectionContainer heading="Recent Complains" href="/donottouch">
        <div className="bg-white dark:bg-[#3C3D37] p-6 border-2 border-dashed rounded-lg border-gray-300 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <TaskCard
                statusChanger={true}
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
                    status: "approved",
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
      <FilterBar azFilter onStateSelect={() => { }} pageTitle="Complains" aboutPageModalData={
        { title: "Complains", description: "This page contains a list of Complains on the platform." }
      } searchInputPlaceholder="Search for Task" handleFilterApply={() => { }} isDateTrue filterOptions={[]} filterWithOptionsWithDropdown={complaintsFilterOptionsWithDropdown} />
      {!isMobile && (
        <SectionContainer heading="All Complaints" href="/tasks/complaints">
          <KanbanBoard />
        </SectionContainer>
      )}

      <Pagination totalPages={0} currentPage={0} onPageChange={() => { }} />
    </div>
  );
};

export default ComplaintsPage;
