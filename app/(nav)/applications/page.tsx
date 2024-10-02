import React from "react";

// Imports
import Picture from "@/components/Picture/picture";
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import ApplicationCard from "@/components/Applications/application-card";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";

const Applications = () => {
  return (
    <div className="custom-flex-col gap-8">
      <AutoResizingGrid minWidth={270}>
        <ManagementStatistcsCard
          title="Total Application"
          newData={34}
          total={657}
        />
        <ManagementStatistcsCard
          title="Mobile Application"
          newData={34}
          total={657}
        />
        <ManagementStatistcsCard
          title="Web Application"
          newData={34}
          total={657}
        />
      </AutoResizingGrid>
      <div className="custom-flex-col gap-5">
        <div className="page-title-container">
          <PageTitle title="Applications" />
          <div className="flex items-center gap-4">
            <SearchInput placeholder="Search for Staff and Branch" />
            <div className="bg-white rounded-lg p-2 flex items-center space-x-2">
              <button>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Picture src="/icons/sliders.svg" alt="filters" size={20} />
                  <p className="text-[#344054] text-base font-medium">
                    Filters
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
        <AutoResizingGrid minWidth={350} gap={32}>
          <ApplicationCard />
          <ApplicationCard type="guest" />
        </AutoResizingGrid>
      </div>
    </div>
  );
};

export default Applications;
