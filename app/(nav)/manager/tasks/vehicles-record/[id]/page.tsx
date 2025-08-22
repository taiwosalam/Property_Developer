"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Button from "@/components/Form/Button/button";
import CustomTable from "@/components/Table/table";
import type { DataItem } from "@/components/Table/types";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import {
  transformVehicleRecordApiResponse,
  VehicleData,
  VehicleRecordApiResponse,
  VehicleRecordFilterParams,
  vehicleRecordFIltersOptionsWithDropdown,
  veicleRecordTablefields,
} from "../data";
import FilterBar from "@/components/FIlterBar/FilterBar";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import EmptyList from "@/components/EmptyList/Empty-List";
import TableLoading from "@/components/Loader/TableLoading";
import { VehicleRecord } from "@/components/tasks/vehicles-record/types";
import CreateRecordModal from "@/components/tasks/vehicles-record/create-record-modal";
import VehicleRecordModal from "@/components/tasks/vehicles-record/vehicle-record-modal";
import BackButton from "@/components/BackButton/back-button";
import { useParams } from "next/navigation";
import useVehicleRecordStore from "@/store/vehicle-record";
import dayjs from "dayjs";
import { AxiosRequestConfig } from "axios";
import ServerError from "@/components/Error/ServerError";
import { NoteBlinkingIcon } from "@/public/icons/dashboard-cards/icons";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { FilterResult } from "@/app/(nav)/management/service-providers/types";
import { useRole } from "@/hooks/roleContext";
import { usePermission } from "@/hooks/getPermission";
import { PlusIcon } from "@/public/icons/icons";

const VehiclesRecordPage = () => {
  const { id } = useParams();
  const { selectedProperty, setSelectedProperty } = useVehicleRecordStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<VehicleRecord | null>(
    null
  );

  const { role } = useRole();
  // PERMISSIONS
  const canCheckInAndManageVehicleRec = usePermission(
    role,
    "Can check in and manage vehicle records"
  );

  useEffect(() => {
    setSelectedProperty(id as string);
  }, [id, setSelectedProperty]);

  const initialState = {
    check_ins: 0,
    check_ins_pending: 0,
    check_ins_this_month: 0,
    check_outs: 0,
    check_outs_pending: 0,
    check_outs_this_month: 0,
    total_records: 0,
    total: 0,
    total_this_month: 0,
    vehicle_records: {
      data: [] as VehicleData[],
      current_page: 1,
      last_page: 0,
      total: 0,
    },
    hasMore: true,
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
    total: totalStats,
    total_this_month,
    vehicle_records: { data, current_page, last_page, total },
    hasMore,
  } = state;

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

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
    setState((prevState) => ({
      ...prevState,
      vehicle_records: {
        ...prevState.vehicle_records,
        current_page: 1,
        data: [], // Reset data when filters change
      },
    }));
  };

  const { menuOptions, startDate, endDate } = appliedFilters;
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc" | "">("");
  const status = menuOptions["Status"]?.[0];

  const config: AxiosRequestConfig = useMemo(() => {
    return {
      params: {
        page: current_page,
        date_from: appliedFilters.startDate
          ? dayjs(appliedFilters.startDate).format("YYYY-MM-DD")
          : undefined,
        date_to: appliedFilters.endDate
          ? dayjs(appliedFilters.endDate).format("YYYY-MM-DD")
          : undefined,
        search: search,
        sort_order: sort,
        status: status,
      } as VehicleRecordFilterParams,
    };
  }, [appliedFilters, search, sort, current_page]);

  const handleSort = (order: "asc" | "desc") => {
    setSort(order);
    setState((prevState) => ({
      ...prevState,
      vehicle_records: {
        ...prevState.vehicle_records,
        current_page: 1,
        data: [], // Reset data when sort changes
      },
    }));
  };

  const handleSearch = (query: string) => {
    setSearch(query);
    setState((prevState) => ({
      ...prevState,
      vehicle_records: {
        ...prevState.vehicle_records,
        current_page: 1,
        data: [], // Reset data when search changes
      },
    }));
  };

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<VehicleRecordApiResponse>(
    `vehicle-records/properties/${id}/details`,
    config
  );
  useRefetchOnEvent("refetchVehicleRecord", () => refetch({ silent: true }));
  // Update state with fetched data, appending for subsequent pages
  useEffect(() => {
    if (apiData) {
      const transformedData = transformVehicleRecordApiResponse(apiData);
      setState((prevState) => {
        const newRecords = transformedData.vehicle_records.data;
        const isFirstPage = transformedData.vehicle_records.current_page === 1;
        const updatedRecords = isFirstPage
          ? newRecords
          : [...prevState.vehicle_records.data, ...newRecords];
        const hasMore =
          transformedData.vehicle_records.current_page <
          transformedData.vehicle_records.last_page;
        return {
          ...transformedData,
          vehicle_records: {
            ...transformedData.vehicle_records,
            data: updatedRecords,
          },
          hasMore,
        };
      });
    }
  }, [apiData]);

  // Intersection Observer for infinite scrolling
  const observer = useRef<IntersectionObserver | null>(null);

  const lastRowRef = useCallback(
    (node: HTMLElement | null) => {
      if (silentLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setState((prevState) => ({
            ...prevState,
            vehicle_records: {
              ...prevState.vehicle_records,
              current_page: prevState.vehicle_records.current_page + 1,
            },
          }));
        }
      });
      if (node) observer.current.observe(node);
    },
    [silentLoading, hasMore]
  );

  // console.log("data: ", data);

  const statusMap: Record<string, string> = {
    no_record: "pending",
    pending: "check-in",
    completed: "check-out",
  };

  // Map data to include ref for the last row
  const tableData = data.map((record, index) => ({
    ...record,
    name: (
      <div className="flex gap-1">
        <span>{record.name}</span>
        {record.note && (
          <div className="flex items-center">
            <NoteBlinkingIcon size={20} className="blink-color" />
          </div>
        )}
      </div>
    ),
    status: statusMap[record.status] || record.status,
    ref: index === data.length - 1 ? lastRowRef : null,
  }));

  const handleActionClick = (record: DataItem) => {
    const vehicleRecord = record as VehicleRecord;
    // console.log("vehicleRecord: ", vehicleRecord);
    const updatedRecord = {
      ...vehicleRecord,
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
      note: vehicleRecord.note,
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
  if (error) return <ServerError error={error} />;

  return (
    <div className="my-8">
      <div className="page-header-container my-4 md:m-0">
        <div className="management-cardstat-wrapper">
          <ManagementStatistcsCard
            title="Total Record"
            newData={totalStats}
            total={total_this_month}
            colorScheme={1}
          />
          {/* <ManagementStatistcsCard
            title="Check In"
            newData={check_ins_this_month}
            total={check_ins}
            colorScheme={2}
          /> */}
          <ManagementStatistcsCard
            title="Check Out"
            newData={check_outs_this_month}
            total={check_outs}
            colorScheme={3}
          />
        </div>
        {canCheckInAndManageVehicleRec && (
          <Modal>
            <ModalTrigger asChild>
              <Button
                type="button"
                className="page-header-button md:block hidden"
              >
                + Create New Record
              </Button>
            </ModalTrigger>
            <ModalContent>
              <CreateRecordModal propertyId={Number(id)} data={data} />
            </ModalContent>
          </Modal>
        )}
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
          handleFilterApply={handleFilterApply}
          isDateTrue
          filterOptionsMenu={vehicleRecordFIltersOptionsWithDropdown}
          hasGridListToggle={false}
          handleSearch={handleSearch}
          onSort={handleSort}
        />
      </div>
      <section className="capitalize">
        {data.length === 0 && !silentLoading ? (
          search ? (
            <SearchError />
          ) : (
            <EmptyList
              noButton
              modalContent={
                <CreateRecordModal propertyId={Number(id)} data={data} />
              }
              title="No vehicle record profiles have been created yet"
              body={
                <div>
                  <p className="mb-2">
                    It looks like you haven&apos;t created any vehicle record
                    profiles yet. Setting up vehicle record profiles is
                    essential for efficient property and vehicle management
                    within gated communities or facilities. When creating a
                    profile, you have two options: Create Manually or Create
                    with ID, depending on your specific requirements.
                  </p>

                  <p>Options for Creating Vehicle Record Profiles</p>
                  <p className="font-semibold text-lg mt-2">
                    <strong className="font-bold mr-2">1.</strong>
                    Create Manually
                  </p>
                  <p>
                    {" "}
                    This option allows you to create a profile for an occupant
                    of the facility or gated community from scratch. By doing
                    so, you can:{" "}
                  </p>
                  <ul className="custom-list">
                    <li>
                      Monitoring occupant vehicle movements (entry and exit).{" "}
                    </li>
                    <li>Managing visitor access to the premises.</li>
                    <li>
                      Keeping a comprehensive database of vehicles associated
                      with occupants.
                    </li>
                  </ul>

                  <p className="font-semibold text-lg mt-2">
                    <strong className="font-bold mr-2">2.</strong>
                    Create with ID
                  </p>
                  <p>
                    This option provides a streamlined approach by enabling you
                    to select profiles from:{" "}
                  </p>
                  <ul className="custom-list">
                    <li>Existing records in your database. </li>
                    <li>
                      User accounts on the mobile app, where vehicle details may
                      already be stored.
                    </li>
                    <li>
                      This method ensures consistency, reduces duplication, and
                      speeds up the process of adding profiles.
                    </li>
                  </ul>

                  <p className="text-black font-semibold text-lg mt-2">
                    How This Works
                  </p>
                  <ul className="custom-list">
                    <li>
                      After entering the occupant&apos;s profile details, add
                      additional vehicle information such as license plate
                      numbers, vehicle make and model, and other identifying
                      available features.{" "}
                    </li>
                    <li>
                      These records are crucial for maintaining accurate logs of
                      vehicle movements, including check-ins and check-outs.
                    </li>
                  </ul>

                  <p className="text-black font-semibold text-lg mt-2">
                    Next Steps After Adding a Vehicle Record
                  </p>
                  <ul className="custom-list">
                    <li>
                      Once a vehicle record and its corresponding profile are
                      added, the introductory guide on this page will
                      automatically disappear. The page will then shift into
                      active management mode, allowing you to efficiently manage
                      the newly created records.
                    </li>
                  </ul>

                  <p>
                    If you require assistance or want to revisit this guide
                    later, Simply click your profile picture at the top right of
                    the dashboard and select Assistance & Support.
                  </p>
                </div>
              }
            />
          )
        ) : (
          <>
            {silentLoading && current_page === 1 ? (
              <TableLoading />
            ) : (
              <>
                <CustomTable
                  fields={veicleRecordTablefields}
                  data={tableData} // Pass data directly
                  tableHeadClassName="h-[76px]"
                  tableHeadCellSx={{
                    borderBottom: "1px solid rgba(234, 236, 240, 0.20)",
                  }}
                  handleSelect={handleActionClick}
                />
                {silentLoading && current_page > 1 && (
                  <div className="flex items-center justify-center py-4">
                    <div className="loader" />
                  </div>
                )}
              </>
            )}
            <Modal
              state={{
                isOpen: modalOpen,
                setIsOpen: setModalOpen,
              }}
            >
              <ModalContent>
                <VehicleRecordModal
                  page="manager"
                  {...(selectedRecord as VehicleRecord)}
                />
              </ModalContent>
            </Modal>
          </>
        )}

        {canCheckInAndManageVehicleRec && (
          <div className="bottom-5 right-5 fixed rounded-full z-[99] shadow-lg md:hidden block">
            <Modal>
              <ModalTrigger asChild>
                <button className="bg-brand-9 rounded-full text-white p-4 shadow-lg">
                  <PlusIcon />
                </button>
              </ModalTrigger>
              <ModalContent>
                <CreateRecordModal propertyId={Number(id)} data={data} />
              </ModalContent>
            </Modal>
          </div>
        )}
      </section>
    </div>
  );
};

export default VehiclesRecordPage;
