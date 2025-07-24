"use client";

import {
  ColumnId,
  KanbanBoard,
} from "@/components/dashboard/kanban/KanbanBoard";
import { Task, TaskCard } from "@/components/dashboard/kanban/TaskCard";
import FilterBar from "@/components/FIlterBar/FilterBar";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { SectionContainer } from "@/components/Section/section-components";
import useWindowWidth from "@/hooks/useWindowWidth";
import {
  approveAndProcessComplaint,
  rejectComplaint,
  transformComplaintsData,
} from "./data";
import useFetch from "@/hooks/useFetch";
import { useState, useEffect, useCallback } from "react";
import { ComplaintsPageData, ComplaintsResponse } from "./types";
import { AxiosRequestConfig } from "axios";
import { LandlordRequestParams } from "../../management/landlord/data";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import CustomLoader from "@/components/Loader/CustomLoader";
import ServerError from "@/components/Error/ServerError";
import NetworkError from "@/components/Error/NetworkError";
import dayjs from "dayjs";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import EmptyList from "@/components/EmptyList/Empty-List";
import CardsLoading from "@/components/Loader/CardsLoading";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import { TaskCardSkeleton } from "./card-loader";
import PendingComplaintsScroll from "./pending-scroll";
import { toast } from "sonner";
import { Modal, ModalContent } from "@/components/Modal/modal";
import TaskModal from "@/components/dashboard/kanban/task-action-modal";
import { IPropertyApi } from "@/app/(nav)/settings/others/types";
import { FilterResult } from "@/components/Management/Landlord/types";
import { hasActiveFilters } from "@/app/(nav)/reports/data/utils";

const ComplaintsPage = () => {
  const { isMobile } = useWindowWidth();
  const [pageData, setPageData] = useState<ComplaintsPageData | null>(null);

  const [pendingModalOpen, setPendingModalOpen] = useState(false);
  const [selectedPendingTask, setSelectedPendingTask] = useState<Task | null>(
    null
  );

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
    } as LandlordRequestParams,
  });

  const {
    data: complaintData,
    loading,
    silentLoading,
    error,
    isNetworkError,
    refetch,
  } = useFetch<ComplaintsResponse>(`/complaints`, config);
  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  useRefetchOnEvent("refetchComplaints", () => refetch({ silent: true }));

  useEffect(() => {
    if (complaintData) {
      const transformData = transformComplaintsData(complaintData);
      setPageData(transformData);
    }
  }, [complaintData]);

  const { data: propertiesData } = useFetch<IPropertyApi>(`/property/list`);
  const propertyOptions =
    propertiesData?.data.properties.data
      // Filter for unique property titles
      .filter(
        (property, index, self) =>
          self.findIndex((p) => p.title === property.title) === index
      )
      .map((property) => ({
        label: property.title?.toLowerCase(),
        value: property.id.toString(),
      })) || [];

  const { data: tenantsData } = useFetch<any>("/tenants");

  const tenantsOptions =
    tenantsData?.data?.tenants
      ?.filter((tenant: { name: string; id: number }) => tenant?.name)
      .map((tenant: { name: string; id: number }) => ({
        label: tenant.name?.toLowerCase(),
        value: tenant.id.toString(),
      })) || [];

  const [pendingComplaintsPage, setPendingComplaintsPage] = useState(1);

  // 3. Create a separate handler for pending complaints infinite scroll
  const handleLoadMorePending = useCallback(
    async (page: number) => {
      try {
        // Create a new config specifically for pending complaints
        const pendingConfig = {
          ...config,
          params: {
            ...config.params,
            page: page,
            status: "pending",
          },
        };

        setConfig(pendingConfig);
        setPendingComplaintsPage(page);
      } catch (error) {
        console.error("Error loading more pending complaints:", error);
        throw error;
      }
    },
    [config]
  );

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
    const { menuOptions, startDate, endDate } = filters;
    const propertyIds = menuOptions["Property"] || [];
    const tenantIds = menuOptions["Tenant/Occupant"] || [];
    const branchIdsArray = menuOptions["Branch"] || [];

    const queryParams: LandlordRequestParams = {
      page: 1,
      search: "",
    };
    if (propertyIds.length > 0) {
      queryParams.property_ids = propertyIds.join(",");
    }
    if (branchIdsArray.length > 0) {
      queryParams.branch_ids = branchIdsArray.join(",");
    }
    if (tenantIds && tenantIds.length > 0) {
      queryParams.tenant_ids = tenantIds.join(",");
    }
    if (startDate) {
      queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD");
    }
    if (endDate) {
      queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD");
    }
    setConfig({
      params: queryParams,
    });
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

  // Handle loading more data for infinite scroll
  const handleLoadMore = useCallback(
    async (columnId: ColumnId, page: number) => {
      try {
        // Update the config to fetch the next page
        const newConfig = {
          ...config,
          params: {
            ...config.params,
            page: page,
            // You might want to add column-specific filtering here
            // status: columnId, // if your API supports filtering by status
          },
        };

        setConfig(newConfig);
      } catch (error) {
        console.error("Error loading more data:", error);
        throw error; // Re-throw so the KanbanBoard can handle the error state
      }
    },
    [config]
  );

  useEffect(() => {
    setConfig((prev) => ({
      ...prev,
      params: {
        ...prev.params,
        page: 1, // Reset to first page
      },
    }));
  }, [appliedFilters]);

  if (loading) {
    return (
      <CustomLoader layout="page" statsCardCount={3} pageTitle="Complaints" />
    );
  }
  if (error) <ServerError error={error} />;
  if (isNetworkError) return <NetworkError />;

  return (
    <div className="space-y-7">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Complaints"
          newData={pageData?.total_month_complaints || 0}
          total={pageData?.total_complaints || 0}
          colorScheme={1}
        />
        <ManagementStatistcsCard
          title="Total Completed"
          newData={pageData?.total_month_completed || 0}
          total={pageData?.total_completed || 0}
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Total Rejected"
          newData={pageData?.total_month_rejected || 0}
          total={pageData?.total_rejected || 0}
          colorScheme={3}
        />
      </div>
      <FilterBar
        hasGridListToggle={false}
        //azFilter
        pageTitle="Complains"
        aboutPageModalData={{
          title: "Complains",
          description:
            "This page contains a list of Complains on the platform.",
        }}
        searchInputPlaceholder="Search for Task"
        handleFilterApply={handleFilterApply}
        handleSearch={handleSearch}
        //onSort={handleSort}
        appliedFilters={appliedFilters}
        isDateTrue
        filterOptionsMenu={[
          ...(propertyOptions.length > 0
            ? [
                {
                  label: "Property",
                  value: propertyOptions,
                },
              ]
            : []),

          ...(tenantsOptions.length > 0
            ? [
                {
                  label: "Tenant/Occupant",
                  value: tenantsOptions,
                },
              ]
            : []),
        ]}
      />

      <SectionContainer
        heading={
          pageData && pageData.complaints.length > 0 ? "Recent Complains" : ""
        }
      >
        {loading ? (
          <AutoResizingGrid gap={24}>
            <CardsLoading length={5} />
          </AutoResizingGrid>
        ) : !pageData?.complaints.length ? (
          <EmptyList
            noButton
            title="No Complaints Available Yet"
            body={
              <p>
                At the moment, there are no complaints in the system. New
                complaints will appear here as they are created.
                <br />
                <br />
                This section will automatically update when complaints are
                added.
              </p>
            }
          />
        ) : !!config.params.search || hasActiveFilters(appliedFilters) ? (
          pageData.complaints.length === 0 ? (
            <SearchError />
          ) : (
            <div className="bg-white dark:bg-[#3C3D37] p-6 border-2 border-dashed rounded-lg border-gray-300 gap-4 flex items-center overflow-x-scroll no-scrollbar">
              {pageData.complaints
                ?.filter((task) => task?.content?.status === "pending")
                .map((complaint, index) => (
                  <TaskCard
                    styles="min-w-[352.66px]"
                    statusChanger={false}
                    noDrag
                    isNew
                    key={complaint.id || index}
                    task={{
                      id: complaint.id,
                      columnId: complaint.columnId,
                      content: {
                        messageCount: complaint.content?.messageCount,
                        linkCount: complaint.content?.linkCount,
                        userAvatars: complaint.content.userAvatars,
                        date: complaint?.content?.date,
                        status: complaint?.content?.status,
                        progress: complaint?.content?.progress,
                      },
                      name: complaint?.name,
                      title: complaint?.title,
                      message: complaint?.message,
                      tier: complaint?.tier,
                      avatarSrc: complaint?.avatarSrc ?? "/empty/avatar.png",
                    }}
                    onClick={() => {
                      setSelectedPendingTask(complaint);
                      setPendingModalOpen(true);
                    }}
                  />
                ))}
            </div>
          )
        ) : (
          <PendingComplaintsScroll
            complaints={pageData.complaints}
            pagination={pageData.pagination}
            onLoadMore={handleLoadMorePending}
            loading={silentLoading} // Use silentLoading to avoid showing main loader
          />
        )}
      </SectionContainer>

      {!isMobile && (
        <SectionContainer
          heading={
            pageData && pageData.complaints.length > 0 ? "All Complains" : ""
          }
        >
          {loading ? (
            <div className="flex justify-between gap-12">
              <CardsLoading
                length={3}
                className="h-[300px] border-dashed border-2 border-spacing-4"
              />
            </div>
          ) : !pageData?.complaints.length ? null : !!config.params.search ||
            hasActiveFilters(appliedFilters) ? (
            pageData.complaints.length === 0 ? (
              <SearchError />
            ) : (
              <KanbanBoard
                kanbanTask={pageData?.complaints}
                pagination={pageData?.pagination}
                onLoadMore={handleLoadMore}
                loading={loading}
              />
            )
          ) : (
            <KanbanBoard
              kanbanTask={pageData?.complaints}
              pagination={pageData?.pagination}
              onLoadMore={handleLoadMore}
              loading={loading}
            />
          )}
        </SectionContainer>
      )}

      {/* infinite scroll later */}
    </div>
  );
};

export default ComplaintsPage;
