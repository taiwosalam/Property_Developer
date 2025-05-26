"use client";

import { useEffect, useState } from "react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Button from "@/components/Form/Button/button";
import AnnouncementCard from "@/components/tasks/announcements/announcement-card";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import {
  announcementrFilterOptionsWithDropdown,
  getAllAnnouncements,
} from "./data";
import { Announcement } from "./types";
import FilterBar from "@/components/FIlterBar/FilterBar";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import template1 from "@/public/templates/template1.png";
import CardsLoading from "@/components/Loader/CardsLoading";
import ServerError from "@/components/Error/ServerError";
import NetworkError from "@/components/Error/NetworkError";
import EmptyList from "@/components/EmptyList/Empty-List";
import { hasActiveFilters } from "../../reports/data/utils";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { AxiosRequestConfig } from "axios";
import { FilterResult, InspectionRequestParams } from "../inspections/data";

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
    } as InspectionRequestParams,
  });
  const [appliedFilter, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  const {
    data: apiData,
    loading,
    silentLoading,
    error,
    refetch,
    isNetworkError,
  } = useFetch<{ announcements: Announcement[] }>(`/announcements`);
  useRefetchOnEvent("dispatchAnnouncement", () => refetch({ silent: true }));

  useEffect(() => {
    if (apiData) {
      setAnnouncements(apiData?.announcements);
    }
  }, [apiData]);

  if (loading) <CardsLoading />;
  if (error) <ServerError error={error} />;
  if (isNetworkError) <NetworkError />;

  return (
    <div className="space-y-9">
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Announcement"
            newData={40}
            colorScheme={1}
            total={657}
          />
          <ManagementStatistcsCard
            title="Examine"
            newData={657}
            total={40}
            colorScheme={2}
          />
        </div>
        <Button
          href="/tasks/announcements/create-announcement"
          className="page-header-button"
        >
          + Create Announcement
        </Button>
      </div>
      <FilterBar
        azFilter
        pageTitle="Announcement"
        aboutPageModalData={{
          title: "Announcement",
          description:
            "This page contains a list of Announcement on the platform.",
        }}
        searchInputPlaceholder="Search Announcement"
        handleFilterApply={() => {}}
        isDateTrue
        filterOptionsMenu={announcementrFilterOptionsWithDropdown}
        hasGridListToggle={false}
      />

      <section>
        {announcements?.length === 0 && !loading ? (
          !!config.params?.search || hasActiveFilters(appliedFilter) ? (
            <SearchError />
          ) : (
            <div className="col-span-full text-left py-8 text-gray-500">
              <EmptyList
                noButton
                title="No Announcements Yet"
                body={
                  <p className="">
                    There are currently no announcements available. You can
                    create a broadcast information targeted to specific property
                    occupants, all tenants, or your entire client base-based on
                    the filters you select during creation.
                    <br /> <br />
                    <p>
                      Once announcements are published, they will appear here
                      for your review and management.
                    </p>
                  </p>
                }
              />
            </div>
          )
        ) : (
          <AutoResizingGrid minWidth={315} gap={32}>
            {announcements.map((announcement, index) => {
              const image_urls = [announcement.image];
              const formattedDate = new Date(
                announcement.created_at
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
              return (
                <AnnouncementCard
                  title={announcement.title}
                  date={formattedDate}
                  key={index}
                  description={announcement.description}
                  id={announcement.company_id}
                  views={0}
                  newViews={0}
                  dislikes={0}
                  imageUrls={[template1]}
                  //mediaCount={announcement.image_urls.length}
                  mediaCount={image_urls.flat().length}
                  announcementId={announcement.id}
                />
              );
            })}
          </AutoResizingGrid>
        )}
      </section>
    </div>
  );
};

export default AnnouncementPage;
