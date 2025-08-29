
"use client";

import { useCallback, useEffect, useState } from "react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Button from "@/components/Form/Button/button";
// import AnnouncementCard from "@/components/tasks/announcements/announcement-card";
import ComplainCard from "@/components/tasks/complain/complain-card";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import {
  complainrFilterOptionsWithDropdown,
  getAllComplains,
  postLikeOrDislike,
} from "./data";
import { Complain, ComplainApiResponse, Complains } from "./types";
import FilterBar from "@/components/FIlterBar/FilterBar";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import template1 from "@/public/templates/template1.png";
import CardsLoading from "@/components/Loader/CardsLoading";
import ServerError from "@/components/Error/ServerError";
import NetworkError from "@/components/Error/NetworkError";
import EmptyList from "@/components/EmptyList/Empty-List";
import { hasActiveFilters } from "@/app/(nav)/reports/data/utils";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { AxiosRequestConfig } from "axios";
import { FilterResult, InspectionRequestParams } from "@/components/PAGES/DIRECTOR/PropertyManager/variantA/tasks/inspections/data";
import { debounce } from "lodash";
// import { MaintenanceRequestParams } from "../maintenance/data";
import { MaintenanceRequestParams } from "@/app/(nav)/tasks/maintenance/data";
// import { MaintenanceRequestParams } from "@/app/(nav)/tasks/maintenance/data";
import dayjs from "dayjs";
import CustomLoader from "@/components/Loader/CustomLoader";
import Pagination from "@/components/Pagination/pagination";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PlusIcon } from "@/public/icons/icons";

const ComplainPage = () => {
  const [complains, setComplains] = useState<Complains[]>([]);
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

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
  } = useFetch<ComplainApiResponse>(`/announcements`, config);
  useRefetchOnEvent("dispatchComplain", () => refetch({ silent: true }));

  useEffect(() => {
    if (apiData) {
      setComplains(apiData?.data);
    }
  }, [apiData]);

  useEffect(() => {
    if (query) {
      const searchQuery = query.trim().toLowerCase();
      setConfig((prevConfig) => ({
        ...prevConfig,
        params: { ...prevConfig.params, search: searchQuery, page: 1 },
      }));
      setComplains((prevData) => ({
        ...prevData,
        current_page: 1,
      }));
      sessionStorage.setItem("tenant_page", "1");
    }
  }, [query]);

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
        queryParams.date_from = dayjs(startDate).format("YYYY-MM-DD:hh:mm:ss");
      if (endDate)
        queryParams.date_to = dayjs(endDate).format("YYYY-MM-DD:hh:mm:ss");
      setConfig({ params: queryParams });
    }, 300),
    []
  );

  const { data: branchesData } = useFetch<any>("/branches");

  const branchOptions = Array.isArray(branchesData?.data)
    ? [
      ...new Map(
        branchesData.data.map((branch: any) => [
          branch.branch_name.toLowerCase(), // Use lowercase for comparison
          {
            label: branch.branch_name, // Keep original case for display
            value: branch.id,
          },
        ])
      ).values(),
    ]
    : [];

  const handlePageChange = (page: number) => {
    setConfig((prev) => ({
      params: { ...prev.params, page },
    }));
  };

  const handleSort = (order: "asc" | "desc") => {
    setConfig({
      params: { ...config.params, sort_by: order },
    });
  };

  const handleSearch = async (query: string) => {
    setConfig({
      params: { ...config.params, search: query },
    });
  };

  const { data: propertiesData } = useFetch<any>(`property/list`);

  const propertyOptions: any = Array.isArray(
    propertiesData?.data.properties.data
  )
    ? [
      ...new Map(
        propertiesData.data.properties.data
          .filter(
            (property: any) =>
              property.property_type === "rental" && property.units.length > 0
          )
          .map((property: any) => [
            property.title,
            {
              label: property.title,
              value: property.id.toString(),
            },
          ])
      ).values(),
    ]
    : [];

  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Complain" statsCardCount={1} />
    );
  if (error) <ServerError error={error} />;
  if (isNetworkError) <NetworkError />;

  return (
    <div className="space-y-9">
      <FilterBar
        azFilter
        pageTitle="Complain"
        aboutPageModalData={{
          title: "Complain",
          description:
            "This page contains a list of Complain on the platform.",
        }}
        searchInputPlaceholder="Search Complain"
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
      ) : !complains.length ? (
        // Show empty state when no visitors exist
        <EmptyList
          noButton
          title="No Complain Available"
          body={
            <p>
              There are currently no Complains created. Once you add an
              Complain, the details will appear here. Complains help
              keep everyone informed about important updates, events, or changes
              related to the properties you manage. They can also be used to
              share company news on the domain website.
            </p>
          }
        />
      ) : !!config.params.search || hasActiveFilters(appliedFilter) ? (
        // If we have data but search/filters return nothing, show search error
        complains.length === 0 ? (
          <SearchError />
        ) : (
          // Show filtered/searched results
          <section>
            <AutoResizingGrid gap={32} minWidth={315}>
              {complains.map((complain, index) => {
                const image_urls = complain.images;
                const formattedDate = new Date(
                  complain.created_at
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
                return (
                  <ComplainCard
                    title={complain.title}
                    date={formattedDate}
                    key={index}
                    poster={complain?.poster?.profilePicture}
                    description={complain?.description}
                    id={complain.company_id?.toString()}
                    video={complain?.video_link}
                    imageUrls={complain?.images?.map((img) => ({
                      ...img,
                      url: img.url,
                    }))}
                    //mediaCount={complain.image_urls.length}
                    mediaCount={{
                      image: image_urls?.flat().length,
                      video: complain?.video_link ? 1 : 0,
                    }}
                    complainId={complain?.id?.toString()}
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
            {complains.map((complain, index) => {
              const image_urls = complain.images;
              const formattedDate = new Date(
                complain.created_at
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
              return (
                <ComplainCard
                  title={complain.title}
                  date={formattedDate}
                  key={index}
                  video={complain.video_link}
                  description={complain.description}
                  id={complain.company_id.toString()}
                  imageUrls={complain.images.map((img) => ({
                    ...img,
                    url: img.url,
                  }))}
                  //mediaCount={complain.image_urls.length}
                  mediaCount={{
                    image: image_urls.flat().length,
                    video: complain.video_link ? 1 : 0,
                  }}
                  complainId={complain.id.toString()}
                />
              );
            })}
          </AutoResizingGrid>
        </section>
      )}

      {/* <Link
        href="/tasks/complain/create-complain"
        className="mobile-button"
      >
        <PlusIcon />
      </Link> */}

      <Pagination
        totalPages={apiData?.pagination?.total_pages || 0}
        currentPage={apiData?.pagination?.current_page || 0}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ComplainPage;