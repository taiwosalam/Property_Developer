"use client";
import React from "react";

// Imports
import ApplicationCard from "@/components/Applications/application-card";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { DocumentssFilterOptionsWithDropdown } from "@/app/(nav)/documents/data";
import { applicationDummyData } from "./data";
import Pagination from "@/components/Pagination/pagination";

const PropertyDeveloperApplicationVariantA = () => {
  return (
    <div className="custom-flex-col gap-8">
      <div className="flex gap-5 overflow-x-auto hide-scrollbar md:flex-wrap">
        <ManagementStatistcsCard
          title="Total Application"
          newData={34}
          total={657}
          colorScheme={1}
        />
        <ManagementStatistcsCard
          title="Mobile Application"
          newData={34}
          total={657}
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Web Application"
          newData={34}
          total={657}
          colorScheme={3}
        />
      </div>
      <div className="custom-flex-col gap-5">
        <FilterBar
          isDateTrue
          hasGridListToggle={false}
          pageTitle="Applications"
          aboutPageModalData={{
            title: "Applications",
            description:
              "This page contains a list of Applications on the platform.",
            video: "",
          }}
          searchInputPlaceholder="Search application"
          handleFilterApply={() => {}}
          filterOptionsMenu={DocumentssFilterOptionsWithDropdown}
        />
        <AutoResizingGrid minWidth={300} gap={32} containerClassName="w-full">
          {applicationDummyData.map((application) => (
            <ApplicationCard
              key={Number(application.id)}
              status={
                application.flagged === "flagged" ? "flagged" : "unflagged"
              }
              pd
              type={
                application.application_status as
                  | "pending"
                  | "mobile"
                  | "evaluated"
                  | "approved"
                  | "rejected"
                  | undefined
              }
              data={{
                ...application,
                id: Number(application.id),
                tier_id: Number(application.tier_id),
                flag_details: application.flag_details
                  ? application.flag_details.map((flag: any) => ({
                      flagger_id: Number(flag.flagger_id),
                      flagger_name: flag.flagger_name,
                      email: flag.email,
                      phone: flag.phone,
                      tier_id: Number(flag.tier_id),
                      picture:
                        flag.picture === null || flag.picture === undefined
                          ? null
                          : flag.picture,
                      is_flagged: flag.is_flagged,
                      reason:
                        flag.reason === null || flag.reason === undefined
                          ? null
                          : flag.reason,
                      company_name: flag.company_name,
                      appeal_reason:
                        flag.appeal_reason === null ||
                        flag.appeal_reason === undefined
                          ? null
                          : flag.appeal_reason,
                      status:
                        flag.status === "pending" ||
                        flag.status === "approved" ||
                        flag.status === "rejected"
                          ? flag.status
                          : "pending",
                    }))
                  : [],
              }}
            />
          ))}
        </AutoResizingGrid>
      </div>

      <Pagination
        className="!pb-3 "
        totalPages={10}
        currentPage={1}
        onPageChange={() => {}}
      />
    </div>
  );
};

export default PropertyDeveloperApplicationVariantA;
