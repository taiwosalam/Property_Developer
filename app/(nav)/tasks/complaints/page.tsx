"use client";

import { KanbanBoard } from "@/components/dashboard/kanban/KanbanBoard";
import FilterModal from "@/components/Management/Landlord/filters-modal";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import PageTitle from "@/components/PageTitle/page-title";
import Pagination from "@/components/Pagination/pagination";
import SearchInput from "@/components/SearchInput/search-input";
import { SectionContainer } from "@/components/Section/section-components";
import useWindowWidth from "@/hooks/useWindowWidth";
import Image from "next/image";

const ComplaintsPage = () => {
  const { isMobile } = useWindowWidth();

  return (
    <main className="space-y-7">
      <div className="hidden md:w-3/4 md:grid md:grid-cols-2 xl:grid-cols-3 gap-4">
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
      <div className="page-title-container">
        <PageTitle title="Complains" />
        <div className="flex items-center space-x-4 flex-wrap">
          <SearchInput placeholder="Search for Task" />

          <div className="bg-white rounded-lg p-2 flex items-center space-x-2">
            <Modal>
              <ModalTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Image
                    src="/icons/sliders.svg"
                    alt="filters"
                    width={20}
                    height={20}
                  />
                  <p>Filters</p>
                </div>
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
      </div>

      {!isMobile && (
        <SectionContainer heading="Recent Complains" href="/tasks/complaints">
          <KanbanBoard />
        </SectionContainer>
      )}

      <Pagination
        totalPages={0}
        currentPage={0}
        onPageChange={function (page: number): void {
          throw new Error("Function not implemented.");
        }}
      />
    </main>
  );
};

export default ComplaintsPage;
