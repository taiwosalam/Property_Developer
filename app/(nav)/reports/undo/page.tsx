"use client";
import { useEffect, useState } from "react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { Modal, ModalContent } from "@/components/Modal/modal";
import CustomTable from "@/components/Table/table";
import type { DataItem } from "@/components/Table/types";
import UndoModal from "@/components/reports/undo-modal";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { Button, MenuItem } from "@mui/material";
import {
  deleteUndoItem,
  reportsUndoFilterOptionsWithDropdown,
  restoreItem,
  undoRequestTableFields,
} from "./data";
import useFetch from "@/hooks/useFetch";
import {
  transformUndoData,
  TrashRecordsResponse,
  UndoTableData,
} from "./types";
import { ReportsRequestParams } from "../tenants/data";
import NetworkError from "@/components/Error/NetworkError";
import CustomLoader from "@/components/Loader/CustomLoader";
import { AxiosRequestConfig } from "axios";
import { error } from "console";
import dayjs from "dayjs";
import { BranchStaff } from "../../(messages-reviews)/messages/types";
import data from "../landlord/page";
import { FilterResult, BranchFilter, PropertyFilter } from "../tenants/types";
import { transformUnitListData } from "../units/types";
import Link from "next/link";
import TableMenu from "@/components/Table/table-menu";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { hasActiveFilters } from "../data/utils";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import EmptyList from "@/components/EmptyList/Empty-List";

const Undo = () => {
  const [undoData, setUndoData] = useState<UndoTableData>({
    total: 0,
    this_month: 0,
    table: [],
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });
  const [branches, setBranches] = useState<BranchFilter[]>([]);
  const [branchAccountOfficers, setBranchAccountOfficers] = useState<
    BranchStaff[]
  >([]);
  const [propertyList, setPropertyList] = useState<PropertyFilter[]>([]);
  const { data: apiData } = useFetch<any>("branches");
  const { data: staff } = useFetch<any>(`report/staffs`);
  const { data: property } = useFetch<any>(`property/all`);
  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
    } as ReportsRequestParams,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const handleItemSelect = (event: DataItem) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const reportTenantFilterOption = [
    {
      label: "Account Officer",
      value: branchAccountOfficers.map((staff: any) => ({
        label: staff.user.name,
        value: staff.user.id.toString(),
      })),
    },
    {
      label: "Branch",
      value: branches.map((branch) => ({
        label: branch.branch_name,
        value: branch?.id.toString(),
      })),
    },

    {
      label: "Property",
      value: propertyList.map((property: any) => ({
        label: property.title,
        value: property.id.toString(),
      })),
    },
  ];

  const {
    data: undoApiData,
    loading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<TrashRecordsResponse>("/report/trashes", config);

  useRefetchOnEvent("trashes", () => refetch({ silent: true }));

  useEffect(() => {
    if (apiData) {
      setBranches(apiData.data);
    }
    if (staff) {
      const filterStaff = staff.data.filter(
        (staff: any) => staff.staff_role === "account officer"
      );
      setBranchAccountOfficers(filterStaff);
    }
    if (property) {
      setPropertyList(property.data);
    }
  }, [apiData, staff, property]);

  useEffect(() => {
    if (undoApiData) {
      setUndoData(transformUndoData(undoApiData));
    }
  }, [undoApiData]);

  const { this_month, total, table } = undoData;

  const handleSearch = async (query: string) => {
    setConfig({
      params: { ...config.params, search: query },
    });
  };

  const handleSort = (order: "asc" | "desc") => {
    setConfig({
      params: { ...config.params, sort_order: order },
    });
  };

  const handleAppliedFilter = (filters: FilterResult) => {
    setAppliedFilters(filters);
    const { menuOptions, startDate, endDate } = filters;
    const accountOfficer = menuOptions["Account Officer"] || [];
    const branch = menuOptions["Branch"] || [];
    const property = menuOptions["Property"] || [];

    const queryParams: ReportsRequestParams = {
      page: 1,
      search: "",
    };

    if (accountOfficer.length > 0) {
      queryParams.account_officer_id = accountOfficer.join(",");
    }
    if (branch.length > 0) {
      queryParams.branch_id = branch.join(",");
    }
    if (property.length > 0) {
      queryParams.property_id = property.join(",");
    }
    if (startDate) {
      queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD:hh:mm:ss");
    }
    if (endDate) {
      queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD:hh:mm:ss");
    }
    setConfig({
      params: queryParams,
    });
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const handleMenuOpen = (item: DataItem, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setSelectedItemId(String(item.id));
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItemId(null);
  };

  async function handleDeleteItem(item: string) {
    await deleteUndoItem(item);
  }

  async function restoreTrashItem(item: string) {
    await restoreItem(item);
  }

  if (loading)
    return <CustomLoader layout="page" pageTitle="Undo Report" view="table" />;
  if (isNetworkError) return <NetworkError />;
  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total"
          newData={this_month}
          total={total}
          colorScheme={1}
        />
      </div>
      <FilterBar
        azFilter
        isDateTrue
        pageTitle="undo"
        aboutPageModalData={{
          title: "undo",
          description: "This page contains a list of undo on the platform.",
        }}
        handleSearch={handleSearch}
        onSort={handleSort}
        handleFilterApply={handleAppliedFilter}
        appliedFilters={appliedFilters}
        filterOptionsMenu={reportTenantFilterOption}
        searchInputPlaceholder="Search for undo"
        hasGridListToggle={false}
      />

      <section>
        {table.length === 0 && !loading ? (
          !!config.params.search || hasActiveFilters(appliedFilters) ? (
            <SearchError />
          ) : (
            <div className="col-span-full text-left py-8 text-gray-500">
              <EmptyList
                noButton
                title="No Deleted Data Available Yet
             "
                body={
                  <p className="">
                    There are currently no deleted records available for
                    restoration or permanent deletion. Once any data is removed
                    from the system, it will automatically appear here for your
                    review and action. <br /> <br />
                    <p>
                      This section will display all deleted data as soon as such
                      records become available.
                    </p>
                  </p>
                }
              />
            </div>
          )
        ) : (
          <CustomTable
            fields={undoRequestTableFields}
            data={table}
            tableHeadClassName="h-[45px]"
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
            <button
              onClick={() => selectedItemId && restoreTrashItem(selectedItemId)}
              className="w-full text-left"
            >
              Restore
            </button>
          </MenuItem>
          <MenuItem
            onClick={handleMenuClose}
            disableRipple
            className="bg-red-200"
          >
            <button
              onClick={() => selectedItemId && handleDeleteItem(selectedItemId)}
              className="w-full text-left"
            >
              Delete
            </button>
          </MenuItem>
        </TableMenu>
      </section>

      <Modal
        state={{
          isOpen: modalOpen,
          setIsOpen: setModalOpen,
        }}
      >
        <ModalContent>
          <UndoModal
            event={selectedEvent?.event_deleted}
            // eventData={selectedEvent}
          />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Undo;
