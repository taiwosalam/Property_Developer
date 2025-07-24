"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import PropertyCard from "@/components/Management/Properties/property-card";
import Pagination from "@/components/Pagination/pagination";
import PropertyListItem from "@/components/Management/Properties/property-list-item";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterBar from "@/components/FIlterBar/FilterBar";
import useView from "@/hooks/useView";
import BackButton from "@/components/BackButton/back-button";
import { FilterResult } from "@/components/Management/Landlord/types";
import { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import useFetch from "@/hooks/useFetch";
import EmptyList from "@/components/EmptyList/Empty-List";
import AddPropertyModal from "@/components/Management/Properties/add-property-modal";
import CardsLoading from "@/components/Loader/CardsLoading";
import TableLoading from "@/components/Loader/TableLoading";
import { useParams } from "next/navigation";
import { StaffPropertiesApiResponse, StaffPropertyPageData } from "./types";
import {
  staffPropertyMockData,
  transformStaffPropertiesApiResponse,
} from "./data";
import {
  PropertiesFilterParams,
  propertyFilterOptionsMenu,
} from "../../../properties/data";


const StaffProperties = () => {
  const storedView = useView();
  const { staffId } = useParams();
  const [view, setView] = useState<string | null>(storedView);
  const [pageData, setPageData] = useState<StaffPropertyPageData>(
    staffPropertyMockData
  );
  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"asc" | "desc" | "">("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setView(storedView);
  }, [storedView]);

  const config: AxiosRequestConfig = useMemo(() => {
    return {
      params: {
        page,
        search,
        // Add more params as needed for your API, such as filters/sort
      },
    };
  }, [page, search]);

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
  } = useFetch<StaffPropertiesApiResponse>(`/staff/${staffId}`, config);

  useEffect(() => {
    if (apiData) {
      setPageData(transformStaffPropertiesApiResponse(apiData));
    }
  }, [apiData]);

  const { pagination, properties, staff } = pageData;

  const isFilterApplied = useCallback(() => {
    const { options, menuOptions, startDate, endDate } = appliedFilters;
    return (
      options.length > 0 ||
      Object.keys(menuOptions).some((key) => menuOptions[key].length > 0) ||
      startDate !== null ||
      endDate !== null
    );
  }, [appliedFilters]);

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const handleSort = (order: "asc" | "desc") => {
    setSort(order);
  };

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (loading) {
    return (
      <CustomLoader
        layout="page"
        pageTitle="Staff Properties"
        statsCardCount={3}
      />
    );
  }
  if (isNetworkError) return <NetworkError />;
  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="space-y-9">
      <div className="w-full gap-2 flex items-center justify-between flex-wrap">
        <BackButton reducePaddingTop as="div" className="items-start">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white">
            {staff?.name}
          </h1>
          <div className="text-text-disabled flex items-center space-x-1">
            <p className="text-sm font-medium capitalize">{staff?.role}</p>
          </div>
        </BackButton>
      </div>

      <FilterBar
        azFilter
        gridView={view === "grid"}
        setGridView={() => setView("grid")}
        setListView={() => setView("list")}
        pageTitle="Properties"
        aboutPageModalData={{
          title: "Properties",
          description:
            "This page contains a list of properties on the platform.",
        }}
        filterOptionsMenu={[...propertyFilterOptionsMenu]}
        searchInputPlaceholder="Search for Properties"
        handleFilterApply={handleFilterApply}
        isDateTrue
        noExclamationMark
        onSort={handleSort}
        handleSearch={handleSearch}
        appliedFilters={appliedFilters}
      />

      <section>
        {properties.length === 0 && !silentLoading ? (
          <EmptyList
            buttonText="+ Add Property"
            modalContent={<AddPropertyModal />}
            title="No properties have been assigned to this staff yet."
            body={
              <p>
                To add a property to this staff, click the &apos;Add
                Property&apos; button. You can create two types of properties:
                rental and facility properties. During the creation process,
                select this staff in the staff input section under property
                details.
              </p>
            }
          />
        ) : (
          <>
            {view === "grid" ? (
              <AutoResizingGrid minWidth={315}>
                {silentLoading ? (
                  <CardsLoading />
                ) : (
                  properties.map((p) => <PropertyCard {...p} key={p.id} />)
                )}
              </AutoResizingGrid>
            ) : (
              <div className="space-y-4">
                {silentLoading ? (
                  <TableLoading />
                ) : (
                  properties.map((p) => <PropertyListItem key={p.id} {...p} />)
                )}
              </div>
            )}
            <Pagination
              totalPages={pagination.total_page}
              currentPage={pagination.current_page}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </div>
  );
};

export default StaffProperties;
