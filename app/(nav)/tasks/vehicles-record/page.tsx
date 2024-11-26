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
  VehicleRecordData,
  vehicleRecordFIltersOptionsWithDropdown,
  veicleRecordTablefields,
} from "./data";
import FilterBar from "@/components/FIlterBar/FilterBar";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";

const VehiclesRecordPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<VehicleRecord | null>(
    null
  );

  const initialState = {
    current_page: 1,
    searchQuery: "",
    sortOrder: "asc",
  };

  const [state, setState] = useState(initialState);
   const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    // const handleSort = (order: "asc" | "desc") => {
    //   setSortOrder(order);
    // };

    // const handlePageChange = (page: number) => {
    //   setSearchQuery("");
    //   setState((prevState) => ({
    //     ...prevState,
    //     branchesPageData: {
    //       ...prevState.branchesPageData,
    //       current_page: page,
    //     },
    //   }));
    // };

    // const handleSearch = async (query: string) => {
    //   setSearchQuery(query);
    // };

    const config = useMemo(
      () => ({
        params: {
          page: state.current_page,
          search: state.searchQuery,
          sort_order: state.sortOrder,
        },
      }),
      [state.current_page, state.searchQuery, state.sortOrder]
    );

    const {
      data: apiData,
      loading,
      silentLoading,
      isNetworkError,
      error,
      refetch,
    } = useFetch("vehicle-record", config);
    useRefetchOnEvent("refetchVehicleRecord", () => refetch({ silent: true }));

    useEffect(() => {
      if (apiData) {
        console.log("apiData", apiData);
        setState((x) => ({
          ...x,
        }));
      }
    }, [apiData]);

    
  const handleActionClick = (record: DataItem) => {
    setSelectedRecord(record as VehicleRecord);
    setModalOpen(true);
  };

  return (
    <div className="space-y-9">
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Check In"
            newData={657}
            total={34}
            colorScheme={1}
          />
          <ManagementStatistcsCard
            title="Check Out"
            newData={657}
            total={34}
            colorScheme={2}
          />
          <ManagementStatistcsCard
            title="Pending"
            newData={657}
            total={34}
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
            <CreateRecordModal />
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
      />
      <CustomTable
        fields={veicleRecordTablefields}
        data={VehicleRecordData}
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
      <Pagination
        totalPages={3}
        currentPage={1}
        onPageChange={() => alert("function not implemented!")}
      />
    </div>
  );
};

export default VehiclesRecordPage;
