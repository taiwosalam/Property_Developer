"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Button from "@/components/Form/Button/button";
import type { DataItem } from "@/components/Table/types";
import {
  DisburseApiResponse,
  DisbursementRequestParams,
  disbursementTableFields,
  transformDisburseData,
  TransformedDisburseItem,
} from "./data";
import FilterBar from "@/components/FIlterBar/FilterBar";
import MenuItem from "@mui/material/MenuItem";
import CustomTable from "@/components/Table/table";
import TableMenu from "@/components/Table/table-menu";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import { PropertyListResponse } from "../../management/rent-unit/[id]/edit-rent/type";
import { FilterResult } from "@/components/Management/Landlord/types";
import { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
import { AllLandlordsResponse } from "@/components/Management/Properties/types";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import EmptyList from "@/components/EmptyList/Empty-List";
import TableLoading from "@/components/Loader/TableLoading";
import ServerError from "@/components/Error/ServerError";
import { useGlobalStore } from "@/store/general-store";
import { usePersonalInfoStore } from "@/store/personal-info-store";

const Disbursement = () => {
  const router = useRouter();
  const { branch } = usePersonalInfoStore();
  const BRANCH_ID = branch?.branch_id || 0;
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TransformedDisburseItem[]>([]);

  const {
    data: propertyData,
    error: propertyError,
    loading: propertyLoading,
  } = useFetch<PropertyListResponse>("/property/all");

  const {
    data: landlordsData,
    loading: landlordsLoading,
    error: landlordsError,
  } = useFetch<AllLandlordsResponse>("/landlord/select");

  const propertyOptions = Array.isArray(propertyData?.data)
    ? [
        ...new Map(
          propertyData.data
            .filter((property: any) => property.units.length > 0)
            .map((property: any) => [
              property.title.toLowerCase(),
              {
                label: property.title,
                value: property.id.toString(),
              },
            ])
        ).values(),
      ]
    : [];

  const landlordOptions = Array.isArray(landlordsData?.data)
    ? [
        ...new Map(
          landlordsData.data.map((landlord: any) => [
            landlord.name?.toLowerCase(),
            {
              value: landlord.id,
              label: landlord.name?.toLowerCase(),
            },
          ])
        ).values(),
      ]
    : [];

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc" | "">("");

  const isFilterApplied = useCallback(() => {
    const { options, menuOptions, startDate, endDate } = appliedFilters;
    return (
      options.length > 0 ||
      Object.keys(menuOptions).some((key) => menuOptions[key].length > 0) ||
      startDate !== null ||
      endDate !== null
    );
  }, [appliedFilters]);

  const config: AxiosRequestConfig = useMemo(() => {
    const fromDate = appliedFilters.startDate
      ? dayjs(appliedFilters.startDate).format("YYYY-MM-DD")
      : undefined;

    const toDate = appliedFilters.endDate
      ? dayjs(appliedFilters.endDate).format("YYYY-MM-DD")
      : undefined;

    const params: DisbursementRequestParams = {
      from_date: fromDate,
      to_date: toDate,
      search,
      property_ids: appliedFilters.menuOptions["Property"] || [],
      created_by: appliedFilters.menuOptions["Landlords"] || [],
      sort_by: sort,
    };

    return { params };
  }, [appliedFilters, search, sort]);

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
  };

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const handleSort = (order: "asc" | "desc") => {
    setSort(order);
  };

  const handleMenuOpen = (item: DataItem, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setSelectedItemId(String(item.id));
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItemId(null);
  };

  const { data, loading, silentLoading, error, isNetworkError } =
    useFetch<DisburseApiResponse>("/disburses", config);

  useEffect(() => {
    if (data) {
      const newTransformed = transformDisburseData(data);
      const currentDisbursements =
        useGlobalStore.getState()?.accounting_disbursements;
      if (
        JSON.stringify(currentDisbursements) !== JSON.stringify(newTransformed)
      ) {
        setGlobalStore("accounting_disbursements", newTransformed);
      }
      setTableData(newTransformed);
    }
  }, [data, setGlobalStore]);

  if (loading)
    return <CustomLoader layout="page" pageTitle="Disbursement" view="table" />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="custom-flex-col gap-8">
      <div className="flex items-center justify-end">
        <Button
          type="button"
          className="page-header-button"
          onClick={() =>
            router.push("/manager/accounting/disbursement/create-disbursement")
          }
        >
          + new disbursement
        </Button>
      </div>
      <div className="custom-flex-col gap-4">
        <FilterBar
          // azFilter
          searchInputPlaceholder="Search for disbursement"
          handleFilterApply={handleFilterApply}
          isDateTrue
          noExclamationMark
          hasGridListToggle={false}
          exports
          exportHref="/manager/accounting/disbursement/export"
          xlsxData={useGlobalStore.getState().accounting_disbursements}
          fileLabel="Accounting Disbursement"
          pageTitle="Disbursement"
          filterOptionsMenu={[
            ...(landlordOptions.length > 0
              ? [
                  {
                    label: "Landlords",
                    value: landlordOptions,
                  },
                ]
              : []),
            ...(propertyOptions.length > 0
              ? [
                  {
                    label: "Property",
                    value: propertyOptions,
                  },
                ]
              : []),
          ]}
          // onSort={handleSort}
          handleSearch={handleSearch}
          appliedFilters={appliedFilters}
        />
        {tableData.length === 0 && !silentLoading ? (
          config.params.search || isFilterApplied() ? (
            <SearchError />
          ) : (
            <section>
              <EmptyList
                noButton
                title="You do not have any disbursements yet"
                body={
                  <p>
                    Create a new disbursement by clicking on the &apos; new
                    disbursement&apos; button. It keeps a record of all amounts
                    given or sent to the property owner.
                  </p>
                }
              />
            </section>
          )
        ) : (
          <>
            {silentLoading ? (
              <TableLoading />
            ) : (
              <CustomTable
                fields={disbursementTableFields}
                data={tableData}
                tableHeadStyle={{ height: "76px" }}
                tableHeadCellSx={{ fontSize: "1rem" }}
                tableBodyCellSx={{
                  fontSize: "1rem",
                  paddingTop: "12px",
                  paddingBottom: "12px",
                }}
                onActionClick={(item, e) => {
                  handleMenuOpen(item, e as React.MouseEvent<HTMLElement>);
                }}
              />
            )}
            <TableMenu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose} disableRipple>
                <Link
                  href={`/manager/accounting/disbursement/${selectedItemId}/manage-disbursement`}
                  className="w-full text-left"
                >
                  Manage Disbursement
                </Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose} disableRipple>
                <Link
                  href={`/manager/accounting/disbursement/${selectedItemId}/preview-disbursement`}
                  className="w-full text-left"
                >
                  Preview Disbursement
                </Link>
              </MenuItem>
            </TableMenu>
          </>
        )}
      </div>
    </div>
  );
};

export default Disbursement;
