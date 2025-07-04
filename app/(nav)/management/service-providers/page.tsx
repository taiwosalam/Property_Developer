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
  transformServiceProviderData,
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
  ServiceProviderResponseApi,
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
import { NoteBlinkingIcon } from "@/public/icons/dashboard-cards/icons";

interface ServiceProviderCardProps {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  service_render: string | null;
  agent?: string;
}

const defaultServiceProviderPageData: ServiceProviderPageData = {
  total_pages: 1,
  current_page:
    typeof window !== "undefined"
      ? parseInt(sessionStorage.getItem("service_providers_page") || "1", 10)
      : 1,
  total: 0,
  total_month: 0,
  total_web: 0,
  total_web_month: 0,
  total_mobile: 0,
  total_mobile_month: 0,
  service_providers: [],
};

const ServiceProviders = () => {
  const storedView = useView();
  const [view, setView] = useState<string | null>(storedView);
  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page:
        typeof window !== "undefined"
          ? parseInt(
              sessionStorage.getItem("service_providers_page") || "1",
              10
            )
          : 1,
      search: "",
    } as ServiceProviderRequestParams,
  });
  const [pageData, setPageData] = useState<ServiceProviderPageData>(
    defaultServiceProviderPageData
  );
  const {
    total_pages,
    current_page,
    total,
    total_mobile,
    total_mobile_month,
    total_month,
    total_web,
    total_web_month,
    service_providers,
  } = pageData;
  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  // Save page number to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("service_providers_page", current_page.toString());
  }, [current_page]);

  const {
    data: apiData,
    silentLoading,
    isNetworkError,
    error,
    loading,
    refetch,
  } = useFetch<ServiceProviderResponseApi>("service-providers", config);
  const itemListView = useRef<HTMLDivElement | null>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

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

  const handlePageChange = (page: number) => {
    setConfig((prev) => ({
      params: { ...prev.params, page },
    }));
    if (view === "grid") {
      setShouldScroll(true);
    }
    sessionStorage.setItem("service_providers_page", page.toString());
  };

  useEffect(() => {
    if (shouldScroll) {
      if (itemListView.current) {
        itemListView.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      setShouldScroll(false);
    }
  }, [shouldScroll, service_providers]);

  const handleSort = (order: "asc" | "desc") => {
    setConfig({
      params: { ...config.params, sort: order, page: 1 },
    });
    sessionStorage.setItem("service_providers_page", "1");
  };

  const handleSearch = (query: string) => {
    setConfig({
      params: { ...config.params, search: query, page: 1 },
    });
    sessionStorage.setItem("service_providers_page", "1");
  };

  useEffect(() => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      params: { ...prevConfig.params, page: 1 },
    }));
    setPageData((prevData) => ({
      ...prevData,
      service_providers: [],
      current_page: 1,
    }));
    //refetch({ silent: true });
    window.dispatchEvent(new Event("refetchServiceProvider"));
    sessionStorage.setItem("service_providers_page", "1");
  }, [view]);

  useEffect(() => {
    if (apiData) {
      const transformData = transformServiceProviderData(apiData);
      setPageData((prevData) => {
        const updatedProvider =
          view === "grid" || transformData.current_page === 1
            ? transformData.service_providers
            : [
                ...prevData.service_providers,
                ...transformData.service_providers,
              ];
        return { ...transformData, service_providers: updatedProvider };
      });
    }
  }, [apiData, view]);

  useRefetchOnEvent("refetchServiceProvider", () => refetch({ silent: true }));

  const observer = useRef<IntersectionObserver | null>(null);

  const lastRowRef = useCallback(
    (node: HTMLElement | null) => {
      if (silentLoading || view === "grid") return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && current_page < total_pages) {
          handlePageChange(current_page + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [current_page, total_pages, silentLoading]
  );

  const transformedServiceProvider = useMemo(() => {
    return service_providers.map((l, index) => ({
      ...l,
      avatar: l.avatar,
      full_name: (
        <div className="flex gap-x-4 items-center">
          <p className="flex items-center whitespace-nowrap">{l.name}</p>
          {l.note && l.note !== "<p><br></p>" ? (
            <div className="flex items-center">
              <NoteBlinkingIcon size={20} className="blink-color" />
            </div>
          ) : (
            ""
          )}
        </div>
      ),
      "manage/chat": (
        <div className="flex gap-x-[4%] items-center w-full justify-end">
          {l.agent === "mobile" && (
            <Button
              variant="sky_blue"
              size="sm_medium"
              className="px-8 py-2 border-[1px] border-brand-9 bg-brand-tertiary bg-opacity-50 text-brand-9"
            >
              Chat
            </Button>
          )}
          <Button
            href={`/management/service-providers/${l.id}/manage`}
            size="sm_medium"
            className="px-8 py-2"
          >
            Manage
          </Button>
        </div>
      ),
      ref:
        index === service_providers.length - 1 &&
        current_page < total_pages &&
        view !== "grid"
          ? lastRowRef
          : undefined,
    }));
  }, [service_providers, current_page, total_pages, view]);

  //console.log(total_pages)

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
            newData={total_month}
            total={total}
            className="w-[230px]"
            colorScheme={1}
          />
          <ManagementStatistcsCard
            title="Mobile Providers"
            newData={total_mobile_month}
            total={total_mobile}
            className="w-[230px]"
            colorScheme={2}
          />
          <ManagementStatistcsCard
            title="Web Providers"
            newData={total_web_month}
            total={total_web}
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
      <div ref={itemListView}>
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
        <section className="pb-20 mt-4">
          {service_providers.length === 0 && !silentLoading ? (
            isFilterApplied() || config.params.search ? (
              <SearchError />
            ) : (
              <EmptyList
                //buttonText="+ Create Service Provider"
                modalContent={<AddServiceProviderModal />}
                title="You have not created any service providers yet"
                body={
                  <p className="">
                    No service provider records found means there are currently
                    no registered or available service providers in the system.
                    Service providers refer to artisans and skilled workers
                    essential for property management, including carpenters,
                    plumbers, painters, electricians, and more. These
                    professionals handle maintenance, repairs, and improvements
                    for residential and commercial properties.
                    <br />
                    <br />
                    To add a service provider, click{" "}
                    <span className="font-bold">Create Service Provider </span>
                    and register them manually by entering their details or
                    using their unique ID for quick onboarding. Ensuring a
                    complete list of service providers enhances property
                    management efficiency and ensures access to reliable
                    professionals when needed.
                    <br />
                    <br />
                   
                    <br />
                    <br />
                  </p>
                }
              />
            )
          ) : (
            <>
              {view === "grid" ? (
                <AutoResizingGrid minWidth={284} gap={16}>
                  {silentLoading ? (
                    <CardsLoading />
                  ) : (
                    service_providers.map((provider) => (
                      <Link
                        key={provider.id}
                        href={`/management/service-providers/${provider.id}/manage`}
                      >
                        <ServiceProviderCard
                          name={provider.name}
                          email={provider.email}
                          user_tag={
                            provider?.agent === "web" ? "web" : "mobile"
                          }
                          badge_color={provider.badge_color || "gray"}
                          phone_number={provider.phone}
                          picture_url={provider.avatar}
                          other_info={provider.service_rendered || ""}
                          note={
                            !provider.note || provider.note === "<p><br></p>"
                              ? false
                              : true
                          }
                        />
                      </Link>
                    ))
                  )}
                </AutoResizingGrid>
              ) : (
                <>
                  <CustomTable
                    displayTableHead={false}
                    fields={ServiceProviderTableFields}
                    data={transformedServiceProvider}
                    tableBodyCellSx={{ color: "#3F4247" }}
                  />

                  {silentLoading && (
                    <div className="flex items-center justify-center py-4">
                      <div className="loader" />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </section>
      </div>

      {view === "grid" && (
        <Pagination
          totalPages={total_pages}
          currentPage={current_page}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ServiceProviders;
