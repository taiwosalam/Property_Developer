"use client";

// Imports
import Button from "@/components/Form/Button/button";
import DocumentCard from "@/components/Documents/document-card";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CreateTenancyAggrementModal, {
  DrawerComponent,
} from "@/components/BadgeIcon/create-tenancy-aggrement-modal";
import { DocumentssFilterOptionsWithDropdown } from "./data";
import FilterBar from "@/components/FIlterBar/FilterBar";
import useFetch from "@/hooks/useFetch";
import NetworkError from "@/components/Error/NetworkError";
import CustomLoader from "@/components/Loader/CustomLoader";
import { transformDocuments } from "@/components/Documents/data";
import {
  DocumentFilterParams,
  DocumentsPageAPIResponse,
} from "@/components/Documents/types";
import { PropertyListResponse } from "../management/rent-unit/[id]/edit-rent/type";
import { AllBranchesResponse } from "@/components/Management/Properties/types";
import { FilterResult } from "@/components/Management/Landlord/types";
import { useMemo, useState } from "react";
import { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
import Pagination from "@/components/Pagination/pagination";
import EmptyList from "@/components/EmptyList/Empty-List";
import CardsLoading from "@/components/Loader/CardsLoading";
import SearchError from "@/components/SearchNotFound/SearchNotFound";

const Documents = () => {
  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  const { menuOptions, startDate, endDate } = appliedFilters;
  const statesArray = menuOptions["State"] || [];
  const agent = menuOptions["Landlord Type"]?.[0];
  const branchIdsArray = menuOptions["Branch"] || [];
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc" | "">("");

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
    setPage(1);
  };

  const config: AxiosRequestConfig = useMemo(() => {
    return {
      params: {
        page,
        from_date: appliedFilters.startDate
          ? dayjs(appliedFilters.startDate).format("YYYY-MM-DD")
          : undefined,
        to_date: appliedFilters.endDate
          ? dayjs(appliedFilters.endDate).format("YYYY-MM-DD")
          : undefined,
        search: search,
        branch_id: appliedFilters.menuOptions["Branch"] || [],
        property_id: appliedFilters.menuOptions["Property"] || [],
        sort_by: sort,
      } as DocumentFilterParams,
    };
  }, [appliedFilters, search, sort, page]);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleSort = (order: "asc" | "desc") => {
    setSort(order);
  };

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const { data, loading, error, silentLoading, isNetworkError } =
    useFetch<DocumentsPageAPIResponse>("/property-document", config);

  const transformedDocuments = data ? transformDocuments(data) : [];

  const {
    data: propertyData,
    error: propertyError,
    loading: propertyLoading,
  } = useFetch<PropertyListResponse>("/property/all");

  const { data: branchesData } =
    useFetch<AllBranchesResponse>("/branches/select");

  const propertyOptions =
    propertyData?.data.map((p) => ({
      value: `${p.id}`,
      label: p.title,
    })) || [];

  const branchOptions =
    branchesData?.data.map((branch) => ({
      label: branch.branch_name,
      value: branch.id,
    })) || [];

  const { pagination, total_month, total_document } = data || {
    pagination: null,
    total_month: null,
    total_document: null,
  };

  // console.log("trans", transformedDocuments);

  if (isNetworkError) return <NetworkError />;
  if (error) return <div>{error}</div>;
  if (loading) return <CustomLoader view="grid" layout="page" />;

  return (
    <div className="custom-flex-col gap-8">
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Total Document"
            newData={total_month ?? 0}
            total={total_document ?? 0}
            colorScheme={1}
          />
        </div>
        <Modal>
          <ModalTrigger asChild>
            <Button type="button" className="page-header-button">
              + create document
            </Button>
          </ModalTrigger>
          <ModalContent>
            <CreateTenancyAggrementModal />
          </ModalContent>
        </Modal>
        <DrawerComponent />
      </div>
      <div className="custom-flex-col gap-6">
        <FilterBar
          hasGridListToggle={false}
          pageTitle="Document"
          handleFilterApply={handleFilterApply}
          handleSearch={handleSearch}
          onSort={handleSort}
          appliedFilters={appliedFilters}
          searchInputPlaceholder="Document Search"
          filterOptionsMenu={[
            ...(propertyOptions.length > 0
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
          azFilter
          isDateTrue
        />
        <section>
          {transformDocuments.length === 0 && !silentLoading ? (
            isFilterApplied() || search ? (
              <SearchError />
            ) : (
              <EmptyList
                title="No documents available"
                buttonText="Create Document"
                modalContent={<CreateTenancyAggrementModal />}
                body={
                  <p>
                    You have not created any document yet. Click the button
                    below to create a document.
                  </p>
                }
              />
            )
          ) : (
            <>
              <AutoResizingGrid minWidth={500}>
                {silentLoading ? (
                  <CardsLoading />
                ) : (
                  transformedDocuments.map((doc) => (
                    <DocumentCard key={doc.document_id} {...doc} />
                  ))
                )}
              </AutoResizingGrid>
            </>
          )}
        </section>
      </div>
      <Pagination
        totalPages={pagination?.total_pages ?? 0}
        currentPage={pagination?.current_page ?? 0}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Documents;
