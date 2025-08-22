// Updated NavGlobalSearch component with role-based filtering

"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertInfoIcon,
  EmptyListIcon,
  NetworkIcon,
  SendMessageIcon,
  ServerErrorIcon,
} from "@/public/icons/icons";

// Imports
import { SVGType } from "../SVG/types";
import Input from "../Form/Input/input";
import { ModalTrigger, useModal } from "../Modal/modal";
import { NavSearchTab } from "./nav-components";
import { NavCloseIcon } from "@/public/icons/icons";
import NavGlobalSearchItem from "./nav-global-search-item";
import { SectionSeparator } from "../Section/section-components";
import Cookies from "js-cookie";
import { getGlobalSearchTabs } from "@/app/(onboarding)/auth/data";
import { useRole } from "@/hooks/roleContext";
import useFetch from "@/hooks/useFetch";
import {
  GlobalSearchApiResponse,
  IGlobalSearchPageData,
  transformGlobalSearchPageData,
} from "./global_data";
import { debounce } from "lodash";
import { useRoleBasedSearch } from "./useRoleBaseSearch"; // Import the new hook
import useWindowWidth from "@/hooks/useWindowWidth";

const NavGlobalSearch = () => {
  const { role, setRole } = useRole();
  const tabs = getGlobalSearchTabs(role) || [];
  const [activeTab, setActiveTab] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { isMobile } = useWindowWidth();
  const [searchResults, setSearchResults] = useState<IGlobalSearchPageData | null>(null);

  const { setIsOpen } = useModal();
  
  // Use the role-based search hook
  const {
    filterSearchResults,
    getRoleBasedTabCount,
    getRoleBasedTabResults,
    isTypeAllowed
  } = useRoleBasedSearch();

  const debouncedSetQuery = useCallback(
    debounce((value: string) => setDebouncedQuery(value), 400),
    []
  );

  useEffect(() => {
    if (searchQuery.length > 1) {
      debouncedSetQuery(searchQuery);
    }
  }, [searchQuery, debouncedSetQuery]);

  const {
    data: apiData,
    loading,
    silentLoading,
    error,
    isNetworkError,
  } = useFetch<GlobalSearchApiResponse>(
    debouncedQuery ? `/search?q=${encodeURIComponent(debouncedQuery)}` : null
  );

  useEffect(() => {
    if (apiData) {
      const transformData = transformGlobalSearchPageData(apiData);
      // Apply role-based filtering here
      const filteredData = filterSearchResults(transformData);
      setSearchResults(filteredData);
    } else {
      setSearchResults(null);
      setActiveTab("");
    }
  }, [apiData, filterSearchResults]);

  // Updated to use role-based tab count
  const getTabCount = (label: string): number => {
    if (!searchResults || searchQuery.length === 0) return 0;
    return getRoleBasedTabCount(label, searchResults);
  };

  // Updated to use role-based tab results
  const getTabResults = (label: string) => {
    if (!searchResults?.results) return [];
    return getRoleBasedTabResults(label, searchResults);
  };

  // Check if there are any search results (role-filtered)
  const hasSearchResults = (): boolean => {
    if (!searchResults) return false;
    const counts = searchResults.counts;
    return (
      counts.users > 0 ||
      counts.properties > 0 ||
      counts.units > 0 ||
      counts.landlords > 0 ||
      counts.tenants > 0 ||
      counts.agentCommunities > 0 ||
      counts.agentRequest > 0 ||
      counts.propertyApplications > 0 ||
      counts.announcement > 0 ||
      counts.brands > 0 ||
      counts.campaigns > 0 ||
      counts.branches > 0 ||
      counts.examines > 0 ||
      counts.enrollments > 0
    );
  };

  // Filter tabs to only those with results (already role-filtered)
  const getFilteredTabs = () => {
    return tabs.filter(({ label }) => getTabCount(label) > 0);
  };

  // Reset activeTab to the first available tab when search results change
  useEffect(() => {
    if (hasSearchResults()) {
      const filteredTabs = getFilteredTabs();
      if (
        filteredTabs.length > 0 &&
        !filteredTabs.some((tab) => tab.label === activeTab)
      ) {
        setActiveTab(filteredTabs[0].label); // Set to first available tab
      }
    } else {
      setActiveTab(""); // No results, no active tab
    }
  }, [searchResults]);

  // Error message logic
  const getErrorMessage = () => {
    if (isNetworkError) {
      return <NetworkError />;
    }
    if (error) {
      return <SearchError />;
    }
    if (loading || silentLoading) {
      return <LoaderSkeleton />;
    }
    return null;
  };

  if (!tabs.length) return null;
  
  return (
    <div
      style={{
        boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.05)",
        transition: "width 0.3s ease",
      }}
      className={`custom-flex-col gap-3 bg-white dark:bg-black rounded-2xl border border-solid border-neutral-4 dark:border-[#3C3D37] overflow-hidden max-h-[80vh] ${
        searchQuery === "" ? "w-[80%] md:w-[50%] max-w-full md:max-w-[600px]" : "w-[85%] max-w-[85%] md:max-w-[1200px]"
      }`}
    >
      <div className="custom-flex-col gap-6 md:pt-8 pt-2 px-3 md:px-8 bg-neutral-2 dark:bg-black border-b border-solid border-neutral-4 dark:border-[#3C3D37]">
        <div className="custom-flex-col gap-3">
          <div className="flex flex-col items-start justify-between">
            <div className="flex itens-center w-full justify-between">
              <h2 className="text-primary-navy dark:text-white text-base md:text-xl font-bold uppercase">
                global search
              </h2>
            <ModalTrigger close className="">
              <NavCloseIcon />
            </ModalTrigger>
            </div>
              <p className="text-text-disabled text-xs md:text-sm font-normal text-start">
                Easily find anything across the app using keywords, locations,
                or names.
              </p>
          </div>
          <SectionSeparator />
        </div>
        <div className="flex items-center pb-6">
          <div
            className={`h-[35px] md:h-[45px] flex items-center gap-3 ${
              searchQuery === "" ? "w-full" : "w-full md:w-[60%]"
            }`}
          >
            <Input
              id="search"
              value={searchQuery}
              onChange={(value: string) => setSearchQuery(value)}
              placeholder="Type here"
              className="h-full flex-1 text-sm bg-neutral-3 dark:bg-black"
            />

            <button
              aria-label="search"
              className="bg-brand-9 h-full aspect-square flex justify-center items-center rounded-md cursor-none"
            >
              <span className="text-white">
                <AlertInfoIcon size={ isMobile ? 16 : 24} />
              </span>
            </button>
          </div>
        </div>
        {hasSearchResults() && (
          <div className="w-full pb-4 overflow-x-auto custom-round-scrollbar">
            <div className="flex gap-8">
              {getFilteredTabs().map(({ label }, idx) => {
                const count = getTabCount(label);
                return (
                  <NavSearchTab
                    key={label}
                    count={count}
                    active={label === activeTab}
                    onClick={() => setActiveTab(label)}
                  >
                    {label}
                  </NavSearchTab>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {searchQuery.length > 0 && (
        <div className="pb-3 px-8 flex-1 overflow-x-hidden overflow-y-auto">
          {error || isNetworkError ? (
            <div className="flex-1 flex items-center justify-center">
              {getErrorMessage()}
            </div>
          ) : silentLoading ? (
            <div className="flex-1 flex flex-col">
              {searchQuery !== "" && getTabResults(activeTab).length > 0 && (
                <div className="sticky top-0 z-[2] flex justify-between pt-3 pb-2 pr-16 bg-white dark:bg-black text-text-tertiary text-base font-normal capitalize">
                  <p className="dark:text-darkText-1">
                    {activeTab || "Results"}
                  </p>
                  <p className="dark:text-darkText-1">type</p>
                </div>
              )}
              <LoaderSkeleton />
            </div>
          ) : (
            <div className="custom-flex-col">
              {searchQuery !== "" && getTabResults(activeTab).length > 0 && (
                <div className="sticky top-0 z-[2] flex justify-between pt-3 pb-2 pr-16 bg-white dark:bg-black text-text-tertiary text-base font-normal capitalize">
                  <p className="dark:text-darkText-1">
                    {activeTab || "Results"}
                  </p>
                  <p className="dark:text-darkText-1 nd:block hidden">type</p>
                </div>
              )}
              <div className="relative z-[1] custom-flex-col gap-3">
                {searchQuery === "" ? (
                  <p className="text-gray-500 text-base font-medium text-center p-4">
                    Start typing to search for properties, units, users, and
                    more
                  </p>
                ) : getTabResults(activeTab).length > 0 ? (
                  getTabResults(activeTab)?.map((item, idx) => (
                    <NavGlobalSearchItem
                      key={`${item.type}-${idx}`}
                      icon={item.icon as SVGType}
                      title={item.title}
                      subtitle={item.subtitle}
                      extra={item.extra}
                      query={searchQuery}
                      isVerified={item.isVerified}
                      type={item.type}
                      link={item.link}
                      setIsOpen={setIsOpen}
                    />
                  ))
                ) : (
                  <div className="py-10">
                    <EmptySearch />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NavGlobalSearch;

// Keep your existing helper components
const NetworkError = () => {
  return (
    <>
      <div className="flex flex-col gap-[15px] mt-6 px-20">
        <div className="flex w-full items-center justify-center text-brand-9 mb-2">
          <NetworkIcon />
        </div>

        <p className="text-[#092C4C] dark:text-darkText-1 font-bold text-xl">
          No network or error in internet connection.
        </p>

        <p className="text-left text-[#092C4C] dark:text-darkText-1 py-6">
          In this situation, you should check your network connections, restart
          your router or modem, verify your network settings, and contact your
          service provider if the problem persists.
        </p>
      </div>
    </>
  );
};

const SearchError = () => {
  const { isMobile } = useWindowWidth();
  return (
    <>
      <div className="flex flex-col gap-[15px] mt-6 px-20">
        <div className="flex flex-col gap-3 w-full items-center justify-center text-brand-9 mb-4">
          <ServerErrorIcon size={isMobile ? 20 : 100} />
        </div>

        <p className="text-[#092C4C] dark:text-darkText-1 font-bold text-base md:text-xl">
          Oops! We ran into some trouble
        </p>

        <div className="flex flex-col gap-7 text-text-secondary dark:text-darkText-2 font-normal text-sm">
          <p className="py-4">
            We&apos;re sorry - something went wrong on our end. Don&apos;t
            worry, our team has been alerted and is already working to fix it.
          </p>
        </div>
      </div>
    </>
  );
};

const LoaderSkeleton = () => {
  return (
    <>
      <div className="pb-3 px-8 flex-1 overflow-x-hidden overflow-y-hidden mt-4">
        <div className="flex flex-col">
          <div className="relative z-[1] flex flex-col gap-3">
            {Array(3)
              .fill(null)
              .map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-shrink-0"></div>
                  <div className="flex-1 flex flex-col gap-5">
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export const EmptySearch = () => {
  return (
    <>
      <div className="flex flex-col gap-3 w-full items-center justify-center text-brand-9 mb-4">
        <EmptyListIcon />
      </div>

      <p className="text-[#092C4C] dark:text-darkText-1 font-bold text-xl">
        Oops! Nothing Found
      </p>

      <div className="flex flex-col gap-7 text-text-secondary dark:text-darkText-2 font-normal text-sm">
        <p className="py-4">
          We couldn&apos;t find anything that matches your search. Try again with
          different terms.
        </p>
      </div>
    </>
  );
};