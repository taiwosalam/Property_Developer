"use client";
import { useEffect, useMemo, useState } from "react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Button from "@/components/Form/Button/button";
import CustomTable from "@/components/Table/table";
import type { DataItem } from "@/components/Table/types";
import Pagination from "@/components/Pagination/pagination";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import VehicleRecordModal from "@/components/tasks/vehicles-record/vehicle-record-modal";
import CreateRecordModal from "@/components/tasks/vehicles-record/create-record-modal";
import type { VehicleRecord } from "@/components/tasks/vehicles-record/types";
import {
  transformVehicleRecordApiResponse,
  VehicleData,
  VehicleRecordApiResponse,
  vehicleRecordFIltersOptionsWithDropdown,
  veicleRecordTablefields,
} from "./data";
import FilterBar from "@/components/FIlterBar/FilterBar";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";

const VehiclesRecordPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<VehicleRecord | null>(null);

  const initialState = {
    check_ins: 0,
    check_ins_pending: 0,
    check_ins_this_month: 0,
    check_outs: 0,
    check_outs_pending: 0,
    check_outs_this_month: 0,
    total_records: 0,
    vehicle_records: {
      data: [] as VehicleData[],
      current_page: 1,
      total: 0,
    },
  };

  const [state, setState] = useState(initialState);
  const {
    check_ins,
    check_outs,
    check_ins_pending,
    check_outs_pending,
    check_ins_this_month,
    check_outs_this_month,
    total_records,
    vehicle_records: { data, current_page, total },
  } = state;

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  
  const handleSort = (order: "asc" | "desc") => {
    setSortOrder(order);
  };

  const handlePageChange = (page: number) => {
    setSearchQuery("");
    setState((prevState) => ({
      ...prevState,
      current_page: page,
    }));
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
  };

  const config = useMemo(
    () => ({
      params: {
        page: current_page,
        search: searchQuery,
        sort_order: sortOrder,
      },
    }),
    [current_page, searchQuery, sortOrder]
  );

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<VehicleRecordApiResponse>("vehicle-record", config);
  useRefetchOnEvent("refetchVehicleRecord", () => refetch({ silent: true }));

  useEffect(() => {
    if (apiData) {
      setState((x) => ({
        ...x,
        ...transformVehicleRecordApiResponse(apiData)
      }));
      console.log("Updated state", state);
    }
  }, [apiData]);

  
  const handleActionClick = (record: DataItem) => {
    setSelectedRecord(record as VehicleRecord);
    setModalOpen(true);
  };

    if (loading)
      return (
        <CustomLoader
          layout="page"
          pageTitle="Vehicle Records"
          statsCardCount={3}
        />
      );

    if (isNetworkError) return <NetworkError />;

    if (error)
      return <p className="text-base text-red-500 font-medium">{error}</p>;


  return (
    <div className="space-y-9">
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Check In"
            newData={check_ins_this_month}
            total={check_ins}
            colorScheme={1}
          />
          <ManagementStatistcsCard
            title="Check Out"
            newData={check_outs_this_month}
            total={check_outs}
            colorScheme={2}
          />
          <ManagementStatistcsCard
            title="Pending"
            newData={check_ins_pending}
            total={check_ins_pending}
            colorScheme={3}
          />
        </div>
        <Modal>
          <ModalTrigger asChild>
            <Button type="button" className="page-header-button">
              + Create New Record
            </Button>
          </ModalTrigger>
          <ModalContent>
            <CreateRecordModal data={data} />
          </ModalContent>
        </Modal>
      </div>
      <FilterBar
        azFilter
        onStateSelect={() => {}}
        pageTitle="Vehicle Record"
        aboutPageModalData={{
          title: "Vehicle Record",
          description:
            "This page contains a list of Vehicle Record on the platform.",
        }}
        searchInputPlaceholder="Search for Vehicle Record"
        handleFilterApply={() => {}}
        isDateTrue
        filterOptions={[]}
        filterWithOptionsWithDropdown={vehicleRecordFIltersOptionsWithDropdown}
        hasGridListToggle={false}
        handleSearch={handleSearch}
        onSort={handleSort}
      />
      <CustomTable
        fields={veicleRecordTablefields}
        data={data}
        tableHeadClassName="h-[76px]"
        tableHeadCellSx={{
          fontSize: "16px",
        }}
        tableBodyCellSx={{
          fontSize: "15px",
          padding: "18px 16px",
        }}
        handleSelect={handleActionClick}
      />
      <Modal
        state={{
          isOpen: modalOpen,
          setIsOpen: setModalOpen,
        }}
      >
        <ModalContent>
          <VehicleRecordModal {...(selectedRecord as VehicleRecord)} />
        </ModalContent>
      </Modal>
      {data.length === 0 && (
        <p className="text-base text-red-500 font-medium">No data found</p>
      )}
    </div>
  );
};

export default VehiclesRecordPage;
