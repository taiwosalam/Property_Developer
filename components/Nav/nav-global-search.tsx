"use client";

import { useCallback, useEffect, useState } from "react";
import {
  NetworkIcon,
  SendMessageIcon,
  ServerErrorIcon,
} from "@/public/icons/icons";

// Imports
import { SVGType } from "../SVG/types";
import Input from "../Form/Input/input";
import { ModalTrigger } from "../Modal/modal";
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

const NavGlobalSearch = () => {
  const { role, setRole } = useRole();
  const [activeTab, setActiveTab] = useState(0);
  const tabs = getGlobalSearchTabs(role) || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] =
    useState<IGlobalSearchPageData | null>(null);

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
      setSearchResults(transformData);
    } else {
      setSearchResults(null);
    }
  }, [apiData]);

  // Mapping of tab labels to count fields or aggregated counts
  const getTabCount = (label: string): number => {
    if (!searchResults || searchQuery.length === 0) return 0;

    const counts = searchResults.counts;
    switch (label.toLowerCase()) {
      case "management":
        return (counts.users || 0) + (counts.properties || 0);
      case "listing":
        return counts.units || 0;
      case "community":
        return (counts.agentCommunities || 0) + (counts.agentRequest || 0);
      // case "wallet":
      //   return counts.wallets || 0;
      // Handle tabs with no counts or static counts
      case "task":
      case "accounting":
      case "reports":
      case "documents":
        return 0; // Placeholder: Update with actual mappings if available
      default:
        return 0;
    }
  };

  // Map tabs to result arrays
  const getTabResults = (label: string) => {
    if (!searchResults?.results) return [];
    switch (label.toLowerCase()) {
      case "management":
        return [
          ...searchResults.results.users,
          ...searchResults.results.properties,
        ];
      case "listing":
        return [...searchResults.results.units];
      case "community":
        return [
          ...searchResults.results.agentCommunities,
          ...searchResults.results.agentRequests,
        ];
      // case "wallet":
      //   return searchResults.results.wallets;
      default:
        return [];
    }
  };

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
      style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.05)" }}
      className="w-[85%] max-w-[1200px] custom-flex-col gap-3 bg-white dark:bg-black rounded-2xl border border-solid border-neutral-4 dark:border-[#3C3D37] overflow-hidden max-h-[80vh]"
    >
      <div className="custom-flex-col gap-6 pt-8 px-8 bg-neutral-2 dark:bg-black border-b border-solid border-neutral-4 dark:border-[#3C3D37]">
        <div className="custom-flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="custom-flex-col">
              <h2 className="text-primary-navy dark:text-white text-xl font-bold uppercase">
                global search
              </h2>
              <p className="text-text-disabled text-sm font-normal">
                Search for properties, units, rent, tenant/occupant, task, &
                more
              </p>
            </div>
            <ModalTrigger close className="p-2">
              <NavCloseIcon />
            </ModalTrigger>
          </div>
          <SectionSeparator />
        </div>
        <div className="flex">
          <div className="h-[45px] flex gap-3 w-[60%]">
            <Input
              id="search"
              value={searchQuery}
              onChange={(value: string) => setSearchQuery(value)}
              placeholder="Search"
              className="h-full flex-1 text-sm bg-neutral-3 dark:bg-black"
            />

            <button
              aria-label="search"
              className="bg-brand-9 h-full aspect-square flex justify-center items-center rounded-md"
            >
              <span className="text-white">
                <SendMessageIcon />
              </span>
            </button>
          </div>
        </div>
        <div className="w-full pb-4 overflow-x-auto custom-round-scrollbar">
          <div className="flex gap-8">
            {tabs.map(({ label }, idx) => {
              const count = getTabCount(label);
              return (
                <NavSearchTab
                  key={idx}
                  count={count}
                  active={idx === activeTab}
                  onClick={() => setActiveTab(idx)}
                >
                  {label}
                </NavSearchTab>
              );
            })}
          </div>
        </div>
      </div>
      <div className="pb-3 px-8 flex-1 overflow-x-hidden overflow-y-auto">
        {error || isNetworkError ? (
          <div className="flex-1 flex items-center justify-center">
            {getErrorMessage()}
          </div>
        ) : loading || silentLoading ? (
          <div className="flex-1 flex flex-col">
            <div className="sticky top-0 z-[2] flex justify-between pt-3 pb-2 pr-16 bg-white dark:bg-black text-text-tertiary text-base font-normal capitalize">
              <p className="dark:text-darkText-1">{tabs[activeTab].label}</p>
              <p className="dark:text-darkText-1">type</p>
            </div>
            <LoaderSkeleton />
          </div>
        ) : (
          <div className="custom-flex-col">
            <div className="sticky top-0 z-[2] flex justify-between pt-3 pb-2 pr-16 bg-white dark:bg-black text-text-tertiary text-base font-normal capitalize">
              <p className="dark:text-darkText-1">{tabs[activeTab].label}</p>
              <p className="dark:text-darkText-1">type</p>
            </div>
            <div className="relative z-[1] custom-flex-col gap-3">
              {searchQuery === "" ? (
                <p className="text-gray-500 text-base font-medium text-center p-4">
                  Start typing to search for properties, units, users, and more
                </p>
              ) : getTabResults(tabs[activeTab].label).length > 0 ? (
                getTabResults(tabs[activeTab].label).map((item, idx) => (
                  <NavGlobalSearchItem
                    key={`${item.type}-${idx}`}
                    icon={item.icon as SVGType}
                    title={item.title}
                    subtitle={item.subtitle}
                    extra={item.extra}
                    query={searchQuery}
                    isVerified={item.isVerified}
                    type={item.type}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-base font-medium text-center p-4">
                  No results found for {tabs[activeTab].label}.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default NavGlobalSearch;

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
  return (
    <>
      <div className="flex flex-col gap-3 w-full items-center justify-center text-brand-9 mb-4">
        <ServerErrorIcon />
      </div>

      <p className="text-[#092C4C] dark:text-darkText-1 font-bold text-xl">
        Oops! We ran into some trouble
      </p>

      <div className="flex flex-col gap-7 text-text-secondary dark:text-darkText-2 font-normal text-sm">
        <p className="py-4">
          We&apos;re sorry - something went wrong on our end. Don&apos;t worry,
          our team has been alerted and is already working to fix it.
        </p>
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
                  {/* Icon skeleton */}
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-shrink-0"></div>

                  {/* Content skeleton */}
                  <div className="flex-1 flex flex-col gap-5">
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>

                  {/* Type/Status skeleton */}
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};
