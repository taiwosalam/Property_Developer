"use client";
import { useEffect, useMemo, useState } from "react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Button from "@/components/Form/Button/button";
import CustomTable from "@/components/Table/table";
import type { DataItem } from "@/components/Table/types";
import Pagination from "@/components/Pagination/pagination";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";

import {
  transformVehicleRecordApiResponse,
  VehicleData,
  VehicleRecordApiResponse,
  vehicleRecordFIltersOptionsWithDropdown,
  veicleRecordTablefields,
} from "../data";
import FilterBar from "@/components/FIlterBar/FilterBar";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import EmptyList from "@/components/EmptyList/Empty-List";
import { ExclamationMark } from "@/public/icons/icons";
import TableLoading from "@/components/Loader/TableLoading";
import { VehicleRecord } from "@/components/tasks/vehicles-record/types";
import CreateRecordModal from "@/components/tasks/vehicles-record/create-record-modal";
import VehicleRecordModal from "@/components/tasks/vehicles-record/vehicle-record-modal";
import BackButton from "@/components/BackButton/back-button";
import { useParams } from "next/navigation";
import useVehicleRecordStore from "@/store/vehicle-record";

const VehiclesRecordPage = () => {
  const { id } = useParams();
  const { selectedProperty, setSelectedProperty } = useVehicleRecordStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<VehicleRecord | null>(
    null
  );

  useEffect(() => {
    setSelectedProperty(id as string)
  }, [id, setSelectedProperty])

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
      last_page: 0,
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
    vehicle_records: { data, current_page, last_page, total },
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
  } = useFetch<VehicleRecordApiResponse>(`vehicle-records/properties/${id}/details`, config);
  useRefetchOnEvent("refetchVehicleRecord", () => refetch({ silent: true }));

  useEffect(() => {
    if (apiData) {
      console.log("api data", apiData)
      setState((x) => ({
        ...x,
        ...transformVehicleRecordApiResponse(apiData),
      }));
    }
  }, [apiData]);
  
  console.log("table data", data[0].latest_check_in)
  const handleActionClick = (record: DataItem) => {
    const vehicleRecord = record as VehicleRecord;
    const updatedRecord = {
      ...data,
      latest_check_in: vehicleRecord.latest_check_in,
      pictureSrc: vehicleRecord.pictureSrc,
      status: vehicleRecord.status,
      name: vehicleRecord.name,
      id: vehicleRecord.id,
      category: vehicleRecord.category,
      registrationDate: vehicleRecord.registrationDate,
      checkOut: vehicleRecord.latest_check_in,
      plate_number: vehicleRecord.plate_number,
      last_update: vehicleRecord.last_update,
    };
    setSelectedRecord(updatedRecord);
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
  // console.log("data needed", data)
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

      <div className="back flex gap-2">
        <BackButton> {""} </BackButton>
        <FilterBar
          azFilter
          pageTitle="Vehicle Record"
          aboutPageModalData={{
            title: "Vehicle Record",
            description:
              "This page contains a list of Vehicle Record on the platform.",
          }}
          searchInputPlaceholder="Search for Vehicle Record"
          handleFilterApply={() => { }}
          isDateTrue
          filterOptionsMenu={vehicleRecordFIltersOptionsWithDropdown}
          hasGridListToggle={false}
          handleSearch={handleSearch}
          onSort={handleSort}
        />
      </div>
      <section className="capitalize">
        {data.length === 0 && !silentLoading ? (
          searchQuery ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No Search/Filter Found
            </div>
          ) : (
            <EmptyList
              buttonText="+ create new"
              modalContent={<CreateRecordModal data={data} />}
              title="No vehicle record profiles have been created yet"
              body={
                <div>
                  <p className="mb-2">It looks like you haven&apos;t created any vehicle record profiles yet. Setting up vehicle record profiles is essential for efficient property and vehicle management within gated communities or facilities. When creating a profile, you have two options: Create Manually or Create with ID, depending on your specific requirements.</p>

                  <p>Options for Creating Vehicle Record Profiles</p>
                  <p className="font-semibold text-lg mt-2">
                    <strong className="font-bold mr-2">1.</strong>
                    Create Manually
                  </p>
                  <p>  This option allows you to create a profile for an occupant of the facility or gated community from scratch. By doing so, you can: </p>
                  <ul className="custom-list">
                    <li>Monitoring occupant vehicle movements (entry and exit). </li>
                    <li>Managing visitor access to the premises.</li>
                    <li>Keeping a comprehensive database of vehicles associated with occupants.</li>
                  </ul>

                  <p className="font-semibold text-lg mt-2">
                    <strong className="font-bold mr-2">2.</strong>
                    Create with ID
                  </p>
                  <p>This option provides a streamlined approach by enabling you to select profiles from: </p>
                  <ul className="custom-list">
                    <li>Existing records in your database. </li>
                    <li>User accounts on the mobile app, where vehicle details may already be stored.</li>
                    <li>This method ensures consistency, reduces duplication, and speeds up the process of adding profiles.</li>
                  </ul>
                </div>
              }
            />
          )
        ) : (
          <>
            {silentLoading ? (
              <TableLoading />
            ) : (
              <CustomTable
                fields={veicleRecordTablefields}
                data={data}
                tableHeadClassName="h-[76px]"
                tableHeadCellSx={{
                  borderBottom: "1px solid rgba(234, 236, 240, 0.20)",
                }}
                handleSelect={handleActionClick}
              />
            )}
            <Modal
              state={{
                isOpen: modalOpen,
                setIsOpen: setModalOpen,
              }}
            >
              <ModalContent>
                <VehicleRecordModal
                  {...(selectedRecord as VehicleRecord)}
                />
              </ModalContent>
            </Modal>
            <Pagination
              totalPages={last_page}
              currentPage={current_page}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </div>
  );
};

export default VehiclesRecordPage;
