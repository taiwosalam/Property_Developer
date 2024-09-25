"use client";

import { KanbanBoard } from "@/components/dashboard/kanban/KanbanBoard";
import { TaskCard } from "@/components/dashboard/kanban/TaskCard";
import FilterButton from "@/components/FilterButton/filter-button";
import FilterModal from "@/components/Management/Landlord/filters-modal";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import PageTitle from "@/components/PageTitle/page-title";
import Pagination from "@/components/Pagination/pagination";
import SearchInput from "@/components/SearchInput/search-input";
import { SectionContainer } from "@/components/Section/section-components";
import useWindowWidth from "@/hooks/useWindowWidth";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";

const ComplaintsPage = () => {
  const { isMobile, isSmallTablet } = useWindowWidth();

  return (
    <div className="space-y-7">
      {!isSmallTablet && (
        <AutoResizingGrid>
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
        </AutoResizingGrid>
      )}
      <SectionContainer heading="Recent Complains" href="/donottouch">
        <div className="bg-white p-6 border-2 border-dashed rounded-lg border-gray-300 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <TaskCard
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
      <div className="page-title-container">
        <PageTitle title="Complains" />
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput placeholder="Search for Task" />
          <Modal>
            <ModalTrigger asChild>
              <FilterButton />
            </ModalTrigger>
            <ModalContent>
              <FilterModal
                filterOptionsWithDropdown={[]}
                filterOptions={[]}
                onApply={() => {}}
                date
                //   onStateSelect={(state: string) => setSelectedState(state)}
              />
            </ModalContent>
          </Modal>
        </div>
      </div>

      {!isMobile && (
        <SectionContainer heading="Recent Complains" href="/tasks/complaints">
          <KanbanBoard />
        </SectionContainer>
      )}

      <Pagination totalPages={0} currentPage={0} onPageChange={() => {}} />
    </div>
  );
};

export default ComplaintsPage;
