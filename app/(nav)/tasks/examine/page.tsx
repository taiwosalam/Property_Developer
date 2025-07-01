"use client";

// Imports
import Button from "@/components/Form/Button/button";
import ExamineCard from "@/components/tasks/Examine/examine-card";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { useCallback, useEffect, useState } from "react";
import { examineFilterOptionsWithDropdown, getAllExamine } from "./data";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import CreateExamineModal from "@/components/tasks/Examine/create-examine-modal";
import useFetch from "@/hooks/useFetch";
import { ExamineApiResponse } from "./type";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { AxiosRequestConfig } from "axios";
import { LandlordRequestParams } from "../../management/landlord/data";
import { debounce } from "lodash";
import { MaintenanceRequestParams } from "../maintenance/data";
import { FilterResult } from "../inspections/data";
import dayjs from "dayjs";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import NetworkError from "@/components/Error/NetworkError";
import ServerError from "@/components/Error/ServerError";
import { PropertyrequestSkeletonLoader } from "@/components/Loader/property-request-loader";
import EmptyList from "@/components/EmptyList/Empty-List";
import { hasActiveFilters } from "../../reports/data/utils";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import CardsLoading from "@/components/Loader/CardsLoading";
import { AllBranchesResponse } from "@/components/Management/Properties/types";

const Examine = () => {
  const [examineData, setExamineData] = useState<ExamineApiResponse | null>(
    null
  );

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
    } as LandlordRequestParams,
  });
  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  const [isOpen, setIsOpen] = useState(false);

  const {
    data: apiData,
    loading,
    silentLoading,
    error,
    isNetworkError,
    refetch,
  } = useFetch<ExamineApiResponse>(`examine`, config);
  useRefetchOnEvent("dispatchExamine", () => refetch({ silent: true }));

  useEffect(() => {
    if (apiData) {
      setExamineData(apiData);
    }
  }, [apiData]);

  const handleAppliedFilter = useCallback(
    debounce((filters: FilterResult) => {
      setAppliedFilters(filters);
      const { menuOptions, startDate, endDate } = filters;
      const accountOfficer = menuOptions["Account Officer"] || [];
      const status = menuOptions["Status"] || [];
      const property = menuOptions["Property"] || [];
      const branchIdsArray = menuOptions["Branch"] || [];

      const queryParams: MaintenanceRequestParams = { page: 1, search: "" };
      if (accountOfficer.length > 0)
        queryParams.account_officer_id = accountOfficer.join(",");

      if (branchIdsArray.length > 0) {
        queryParams.branch_ids = branchIdsArray.join(",");
      }
      if (status.length > 0) queryParams.status = status.join(",");
      if (property.length > 0) queryParams.property_id = property.join(",");
      if (startDate)
        queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD:hh:mm:ss");
      if (endDate)
        queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD:hh:mm:ss");
      setConfig({ params: queryParams });
    }, 300),
    []
  );

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

  const { data: branchesData } =
    useFetch<AllBranchesResponse>("/branches/select");

  const branchOptions =
    branchesData?.data.map((branch) => ({
      label: branch.branch_name,
      value: branch.id,
    })) || [];

  if (loading) return <PageCircleLoader />;

  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-9">
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Total Examine"
            newData={examineData?.total_examine_month || 0}
            total={examineData?.total_examine || 0}
            colorScheme={1}
          />
        </div>
        <Modal
          state={{
            isOpen: isOpen,
            setIsOpen: setIsOpen,
          }}
        >
          <ModalTrigger asChild>
            <Button className="page-header-button">+ create new</Button>
          </ModalTrigger>
          <ModalContent>
            <CreateExamineModal setIsOpen={setIsOpen} />
          </ModalContent>
        </Modal>
      </div>
      <FilterBar
        azFilter
        pageTitle="Examine"
        aboutPageModalData={{
          title: "Examine",
          description: "This page contains a list of Examine on the platform.",
        }}
        searchInputPlaceholder="Search for Examine"
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
          <CardsLoading />
        </AutoResizingGrid>
      ) : !examineData?.data?.length ? (
        // Show empty state when no visitors exist
        <EmptyList
          noButton
          title="No Examine Records Available"
          body={
            <p>
              Currently, there are no examine records linked to any properties.
              Once you create an examine record, the details will appear here.
              Examine allows you to maintain records, review, and schedule
              property rental inspections to assess the status of usage. It
              helps ensure that properties under your management are in good
              condition, with tenants maintaining the property as intended.
              <br />
              <br />
              This message will automatically disappear once examine records are
              added.
              <br />
              <br />
              Need assistance? Click your profile icon in the top right corner
              and select &quot;Assistance & Support&quot; for help on using this
              page.
            </p>
          }
        />
      ) : !!config.params.search || hasActiveFilters(appliedFilters) ? (
        // If we have data but search/filters return nothing, show search error
        examineData?.data?.length === 0 ? (
          <SearchError />
        ) : (
          // Show filtered/searched results
          <section>
            <AutoResizingGrid gap={28} minWidth={350}>
              {examineData?.data?.map((examine, index) => (
                <ExamineCard
                  key={examine.id}
                  id={examine.id}
                  viewOnly={false}
                  title={examine.title}
                  description={examine.description}
                  examine_date={examine.examine_date}
                  image={examine.image}
                  service={examine.service}
                />
              ))}
            </AutoResizingGrid>
          </section>
        )
      ) : (
        // Show all results when no search/filters active
        <section>
          <AutoResizingGrid gap={32} minWidth={350}>
            {examineData?.data.map((examine, index) => (
              <ExamineCard
                key={examine.id}
                id={examine.id}
                viewOnly={false}
                title={examine.title}
                description={examine.description}
                examine_date={examine.examine_date}
                image={examine.image}
                service={examine.service}
              />
            ))}
          </AutoResizingGrid>
        </section>
      )}
    </div>
  );
};

export default Examine;
