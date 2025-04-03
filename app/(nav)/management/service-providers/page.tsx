"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import Link from "next/link";
import Pagination from "@/components/Pagination/pagination";
import Button from "@/components/Form/Button/button";
import ServiceProviderCard from "@/components/Management/landlord-and-tenant-card";
import DefaultLandlordAvatar from "@/public/empty/landlord-avatar.png";
import {
  getAllServiceProviders,
  initialServiceProviderPageData,
  serviceProviderFilterOptionsWithDropdown,
  ServiceProviderTableFields,
} from "./data";

import FilterBar from "@/components/FIlterBar/FilterBar";
import AddServiceProviderModal from "@/components/tasks/service-providers/add-service-provider-modal";
import useFetch from "@/hooks/useFetch";
import NetworkError from "@/components/Error/NetworkError";
import CustomLoader from "@/components/Loader/CustomLoader";
import {
  FilterResult,
  ProvidersPagination,
  ServiceProviderApiResponse,
  ServiceProviderFilterResponse,
  ServiceProviderPageData,
  ServiceProviderRequestParams,
  ServiceProvidersFilterParams,
} from "./types";

import { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import EmptyList from "@/components/EmptyList/Empty-List";
import { ExclamationMark } from "@/public/icons/icons";
import CardsLoading from "@/components/Loader/CardsLoading";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import useView from "@/hooks/useView";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import TableLoading from "@/components/Loader/TableLoading";
import CustomTable from "@/components/Table/table";
import { landlordTableFields } from "../landlord/data";
import UserTag from "@/components/Tags/user-tag";
import { entries } from "lodash";

interface ServiceProviderCardProps {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  service_render: string | null;
  agent?: string;
}

const ServiceProviders = () => {
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const storedView = useView();
  const itemListView = useRef<HTMLDivElement | null>(null);

  const [view, setView] = useState<string | null>(storedView);

  const [page, setPage] = useState(1);
  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
    } as ServiceProviderRequestParams,
  });
  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    setView(storedView);
  }, [storedView]);

  const isFilterApplied = () => {
    const { options, menuOptions, startDate, endDate } = appliedFilters;
    return (
      options.length > 0 ||
      Object.keys(menuOptions).some((key) => menuOptions[key].length > 0) ||
      startDate !== null ||
      endDate !== null
    );
  };

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
    const { menuOptions, startDate, endDate } = filters;
    const accountType = menuOptions["Account Type"]?.[0] || "all";

    const queryParams: ServiceProvidersFilterParams = {
      page: 1,
      search: "",
    };
    if (accountType !== "all") queryParams.account_type = accountType;
    if (startDate) {
      queryParams.from_date = dayjs(startDate).format("YYYY-MM-DD");
    }

    if (endDate) {
      queryParams.to_date = dayjs(endDate).format("YYYY-MM-DD");
    }

    setConfig({
      params: queryParams,
    });
  };

  const handlePageChanger = (page: number) => {
    setConfig({
      params: { ...config.params, page },
    });

    itemListView.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSort = (order: "asc" | "desc") => {
    setConfig({
      params: { ...config.params, sort: order },
    });
  };

  const handleSearch = (query: string) => {
    setConfig({
      params: { ...config.params, search: query },
    });
  };

  const {
    data: apiData,
    silentLoading,
    isNetworkError,
    error,
    loading,
    refetch,
  } = useFetch<ServiceProviderApiResponse | ServiceProviderFilterResponse>(
    "service-providers",
    config
  );
  useRefetchOnEvent("refetchServiceProvider", () => refetch({ silent: true }));

  const serviceProviders: ServiceProviderCardProps[] =
    apiData?.data?.providers?.data || [];

  const totalPages = apiData?.data?.providers?.last_page || 1;

  const totalUsers = apiData?.data.total ?? 0;
  const total_month = apiData?.data?.total_month ?? 0;
  const total_web = apiData?.data?.total_web ?? 0;
  const total_web_month = apiData?.data?.total_web_month ?? 0;
  const total_mobile = apiData?.data?.total_mobile ?? 0;
  const total_mobile_month = apiData?.data?.total_mobile_month ?? 0;

  const current_page =
    "current_page" in (apiData?.data?.providers || {})
      ? (apiData?.data?.providers as ProvidersPagination).current_page
      : 1;

  const observer = useRef<IntersectionObserver | null>(null);

  const lastRowRef = useCallback(
    (node: HTMLElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          current_page < totalPages &&
          !silentLoading
        ) {
          handlePageChange(current_page + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [current_page, totalPages, silentLoading]
  );

  const transformedServiceProvider = serviceProviders.map((l, index) => ({
    ...l,
    avatar: l.avatar,
    full_name: <p className="flex items-center whitespace-nowrap">{l.name}</p>,
    // user_tag: <UserTag type={l.user_tag} />,
    "manage/chat": (
      <div className="flex gap-x-[4%] items-center w-full">
        <Button
          href={`/management/service-providers/${l.id}/manage`}
          size="sm_medium"
          className="px-8 py-2 mx-auto"
        >
          Manage
        </Button>
        {l.agent === "mobile" && (
          <Button
            variant="sky_blue"
            size="sm_medium"
            className="px-8 py-2 bg-brand-tertiary bg-opacity-50 text-white mx-auto"
            // onClick={() => onClickChat(l)}
          >
            Chat
          </Button>
        )}
      </div>
    ),

    ref:
      index === serviceProviders.length - 1 && current_page < totalPages
        ? lastRowRef
        : undefined,
  }));

  if (loading) {
    return (
      <CustomLoader
        layout="page"
        statsCardCount={3}
        pageTitle="Service Provider"
      />
    );
  }

  if (isNetworkError) return <NetworkError />;

  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;
  return (
    <div className="space-y-9">
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Total Providers"
            newData={totalUsers}
            total={total_month}
            className="w-[230px]"
            colorScheme={1}
          />
          <ManagementStatistcsCard
            title="Mobile Providers"
            newData={total_mobile}
            total={total_mobile_month}
            className="w-[230px]"
            colorScheme={2}
          />
          <ManagementStatistcsCard
            title="Web Providers"
            newData={total_web}
            total={total_web_month}
            className="w-[230px]"
            colorScheme={3}
          />
        </div>
        <Modal>
          <ModalTrigger asChild>
            <Button type="button" className="page-header-button">
              + Create New Service Provider
            </Button>
          </ModalTrigger>
          <ModalContent>
            <AddServiceProviderModal />
          </ModalContent>
        </Modal>
      </div>
      <FilterBar
        azFilter
        pageTitle="Service Provider"
        noExclamationMark={false}
        hasGridListToggle={true}
        gridView={view === "grid"}
        setGridView={() => setView("grid")}
        setListView={() => setView("list")}
        aboutPageModalData={{
          title: "Service Provider",
          description:
            "This page contains a list of Service Provider on the platform.",
        }}
        searchInputPlaceholder="Search for service provider"
        handleFilterApply={handleFilterApply}
        handleSearch={handleSearch}
        onSort={handleSort}
        isDateTrue
        filterOptionsMenu={serviceProviderFilterOptionsWithDropdown}
        inputOff={false}
      />
      <section>
        {serviceProviders.length === 0 && !silentLoading ? (
          isFilterApplied() || config.params.search ? (
            <SearchError />
          ) : (
            <EmptyList
              buttonText="+ Create Service Provider"
              modalContent={<AddServiceProviderModal />}
              title="You have not created any service providers yet"
              body={
                <p className="tracking-wider capitalize">
                  No service provider records found means there are currently no
                  registered or available service providers in the system.
                  Service providers refer to artisans and skilled workers
                  essential for property management, including carpenters,
                  plumbers, painters, electricians, and more. These
                  professionals handle maintenance, repairs, and improvements
                  for residential and commercial properties.
                  <br />
                  <br />
                  To add a service provider, click{" "}
                  <span className="font-bold">Create Service Provider </span>and
                  register them manually by entering their details or using
                  their unique ID for quick onboarding. Ensuring a complete list
                  of service providers enhances property management efficiency
                  and ensures access to reliable professionals when needed.
                  <br />
                  <br />
                  <p>
                    To Learn more about this page later, click your profile
                    picture at the top right of the dashboard and select
                    Assistance & Support.
                  </p>
                  <br />
                  <br />
                </p>
              }
            />
          )
        ) : (
          <div ref={itemListView}>
            {view === "grid" ? (
              <AutoResizingGrid minWidth={284} gap={16}>
                {silentLoading ? (
                  <CardsLoading />
                ) : (
                  serviceProviders.map((provider) => (
                    <Link
                      key={provider.id}
                      href={`/management/service-providers/${provider.id}/manage`}
                    >
                      <ServiceProviderCard
                        name={provider.name}
                        email={provider.email}
                        user_tag={provider?.agent === "web" ? "web" : "mobile"}
                        phone_number={provider.phone}
                        picture_url={provider.avatar}
                        other_info={provider.service_render || ""}
                      />
                    </Link>
                  ))
                )}
              </AutoResizingGrid>
            ) : (
              <>
                {silentLoading ? (
                  <TableLoading />
                ) : (
                  <CustomTable
                    displayTableHead={false}
                    fields={ServiceProviderTableFields}
                    data={transformedServiceProvider}
                    tableBodyCellSx={{ color: "#3F4247" }}
                  />
                )}
                {
                  <div className="flex items-center justify-center py-4">
                    <div className="loader" />
                  </div>
                }
              </>
            )}
          </div>
        )}
      </section>

      {view === "grid" && (
        <Pagination
          totalPages={totalPages}
          currentPage={current_page}
          onPageChange={handlePageChanger}
        />
      )}
    </div>
  );
};

export default ServiceProviders;
