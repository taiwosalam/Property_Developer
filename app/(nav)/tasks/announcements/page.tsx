"use client";

import { useCallback, useEffect, useState } from "react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Button from "@/components/Form/Button/button";
import AnnouncementCard from "@/components/tasks/announcements/announcement-card";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import {
  announcementrFilterOptionsWithDropdown,
  getAllAnnouncements,
  postLikeOrDislike,
} from "./data";
import { Announcement, AnnouncementApiResponse, Announcements } from "./types";
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
import { debounce } from "lodash";
import { MaintenanceRequestParams } from "../maintenance/data";
import dayjs from "dayjs";
import Pagination from "@/components/Pagination/pagination";

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState<Announcements[]>([]);

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
  } = useFetch<AnnouncementApiResponse>(`/announcements`, config);
  useRefetchOnEvent("dispatchAnnouncement", () => refetch({ silent: true }));

  useEffect(() => {
    if (apiData) {
      setAnnouncements(apiData?.data);
    }
  }, [apiData]);

  const handleAppliedFilter = useCallback(
    debounce((filters: FilterResult) => {
      setAppliedFilters(filters);
      const { menuOptions, startDate, endDate } = filters;
      const accountOfficer = menuOptions["Account Officer"] || [];
      const status = menuOptions["Status"] || [];
      const property = menuOptions["Property"] || [];
      const branches = menuOptions["Branch"] || [];

      const queryParams: MaintenanceRequestParams = { page: 1, search: "" };
      if (accountOfficer.length > 0)
        queryParams.account_officer_id = accountOfficer.join(",");
      if (status.length > 0) queryParams.status = status.join(",");
      if (branches.length > 0) queryParams.branch_id = status.join(",");

      if (property.length > 0) queryParams.property_ids = property.join(",");
      if (startDate)
        queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD:hh:mm:ss");
      if (endDate)
        queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD:hh:mm:ss");
      setConfig({ params: queryParams });
    }, 300),
    []
  );

  const { data: branchesData } = useFetch<any>("/branches");

  const branchOptions =
    branchesData?.data.map((branch: { branch_name: string; id: number }) => ({
      label: branch.branch_name,
      value: branch.id,
    })) || [];

  const handlePageChange = (page: number) => {
    setConfig((prev) => ({
      params: { ...prev.params, page },
    }));
  };

  const handleSort = (order: "asc" | "desc") => {
    setConfig({
      params: { ...config.params, sort_order: order },
    });
  };

  const handleSearch = async (query: string) => {
    setConfig({
      params: { ...config.params, search: query },
    });
  };

  const { data: propertyData } = useFetch<any>(`property/list`);

  const propertyOptions = propertyData?.data?.properties?.data?.map(
    (property: { id: number; title: string }) => ({
      value: property.id,
      label: property.title,
    })
  );

  if (loading) <CardsLoading />;
  if (error) <ServerError error={error} />;
  if (isNetworkError) <NetworkError />;

  return (
    <div className="space-y-9">
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Announcement"
            newData={apiData?.total_announcement_month || 0}
            colorScheme={1}
            total={apiData?.total_announcement || 0}
          />
          {/* <ManagementStatistcsCard
            title="Examine"
            newData={apiData?.total_examine_month ?? 0}
            total={apiData?.total_examine ?? 0}
            colorScheme={2}
          /> */}
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
        handleFilterApply={handleAppliedFilter}
        handleSearch={handleSearch}
        onSort={handleSort}
        isDateTrue
        filterOptionsMenu={[
          ...(propertyOptions?.length > 0
            ? [
                {
                  label: "Property",
                  value: propertyOptions,
                },
              ]
            : []),
          ...(branchOptions.length > 0
            ? [
                {
                  label: "Branch",
                  value: branchOptions,
                },
              ]
            : []),
        ]}
        hasGridListToggle={false}
      />

      {loading || silentLoading ? (
        <AutoResizingGrid gap={28} minWidth={400}>
          <CardsLoading length={10} />
        </AutoResizingGrid>
      ) : !announcements.length ? (
        // Show empty state when no visitors exist
        <EmptyList
          noButton
          title="No Announcements Available"
          body={
            <p>
              There are currently no announcements created. Once you add an
              announcement, the details will appear here. Announcements help
              keep everyone informed about important updates, events, or changes
              related to the properties you manage. They can also be used to
              share company news on the domain website.
            </p>
          }
        />
      ) : !!config.params.search || hasActiveFilters(appliedFilter) ? (
        // If we have data but search/filters return nothing, show search error
        announcements.length === 0 ? (
          <SearchError />
        ) : (
          // Show filtered/searched results
          <section>
            <AutoResizingGrid gap={32} minWidth={315}>
              {announcements.map((announcement, index) => {
                const image_urls = announcement.images;
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
                    poster={announcement?.poster.profilePicture}
                    description={announcement.description}
                    id={announcement.company_id.toString()}
                    views={announcement.views_count}
                    video={announcement.video_link}
                    newViews={announcement.views_count}
                    likes={announcement.likes_count}
                    dislikes={announcement.dislikes_count}
                    imageUrls={announcement.images.map((img) => ({
                      ...img,
                      url: img.url,
                    }))}
                    //mediaCount={announcement.image_urls.length}
                    mediaCount={{
                      image: image_urls.flat().length,
                      video: announcement.video_link ? 1 : 0,
                    }}
                    announcementId={announcement.id.toString()}
                  />
                );
              })}
            </AutoResizingGrid>
          </section>
        )
      ) : (
        // Show all results when no search/filters active
        <section>
          <AutoResizingGrid gap={32} minWidth={315}>
            {announcements.map((announcement, index) => {
              const image_urls = announcement.images;
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
                  video={announcement.video_link}
                  description={announcement.description}
                  id={announcement.company_id.toString()}
                  views={announcement.views_count}
                  newViews={announcement.views_count}
                  likes={announcement.likes_count}
                  dislikes={announcement.dislikes_count}
                  imageUrls={announcement.images.map((img) => ({
                    ...img,
                    url: img.url,
                  }))}
                  //mediaCount={announcement.image_urls.length}
                  mediaCount={{
                    image: image_urls.flat().length,
                    video: announcement.video_link ? 1 : 0,
                  }}
                  announcementId={announcement.id.toString()}
                />
              );
            })}
          </AutoResizingGrid>
        </section>
      )}

      <Pagination
        totalPages={apiData?.pagination?.total_pages || 0}
        currentPage={apiData?.pagination?.current_page || 0}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AnnouncementPage;
