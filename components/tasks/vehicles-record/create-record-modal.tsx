import {
  Modal,
  ModalContent,
  ModalTrigger,
  useModal,
} from "@/components/Modal/modal";
import {
  XIcon,
  DownArrow,
  SearchIcon,
  ChevronLeft,
} from "@/public/icons/icons";
import Select from "@/components/Form/Select/select";
import Button from "@/components/Form/Button/button";
import { useEffect, useState, useMemo } from "react";
import useVehicleRecordStore from "@/store/vehicle-record";
import { toast } from "sonner";
import { empty } from "@/app/config";
import Image from "next/image";
import useFetch from "@/hooks/useFetch";
import NetworkError from "@/components/Error/NetworkError";
import CheckInOutForm from "../visitors-requests/check-in-out-form";
import {
  PlateData,
  PlateNumber,
  SearchBar,
  VehicleDetails,
} from "./components";
import ServerError from "@/components/Error/ServerError";
import { VehicleData } from "@/app/(nav)/management/vehicles-record/data";
import { checkInVehicle, checkOutVehicle } from "./data";
import dayjs from "dayjs";
import { VehicleRecord } from "./types";
import { useRole } from "@/hooks/roleContext";

// Define interfaces for type safety
interface Property {
  id: number;
  title: string;
}

interface CreateRecordModalProps {
  data: VehicleData[];
  propertyId?: number;
  page?: "manager" | "account";
  // setIsOpen?: any;
}

// CreateRecordModal Component
const CreateRecordModal: React.FC<CreateRecordModalProps> = ({
  data,
  propertyId,
  page,
  // setIsOpen,
}) => {
  const { setIsOpen } = useModal();
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPlate, setSelectedPlate] = useState<VehicleData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const { selectedProperty, setSelectedProperty } = useVehicleRecordStore();
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const latest_check_in = selectedPlate?.latest_check_in;
  const { role } = useRole();

  console.log("selectedPlate", selectedPlate);

  const {
    data: apiData,
    isNetworkError,
    error,
  } = useFetch("/properties/vehicle-record");

  // Transform API data to properties
  useEffect(() => {
    if (apiData) {
      const transformedData = (apiData as any)?.data?.map((item: any) => ({
        id: item.id,
        title: item.title,
      }));
      setProperties(transformedData);
    }
  }, [apiData]);

  // Memoize select options
  const selectOptions = useMemo(
    () =>
      properties.map((property) => ({
        label: property.title,
        value: property.id,
      })),
    [properties]
  );

  // Handle property selection
  const handleSelectProperty = (option: any) => {
    setSelectedProperty(option);
  };

  // get routes
  const getCreateLink = (type: "manual" | "id") => {
    switch (role) {
      case "manager":
        return `/manager/management/vehicles-record/create?type=${type}&p=${propertyId}`;
      case "account":
        return `/accountant/management/vehicles-record/create?type=${type}&p=${propertyId}`;
      case "staff":
        return `/staff/management/vehicles-record/create?type=${type}&p=${propertyId}`;
      default:
        return `/management/vehicles-record/create?type=${type}&p=${propertyId}`;
    }
  };
  // Handle create actions
  const handleCreate = (type: "manual" | "id") => {
    if (!selectedProperty) {
      toast.error("Please select a property before proceeding.");
      return;
    }
    const url = getCreateLink(type);
    // const url =
    //   type === "manual"
    //     ? "/management/vehicles-record/create?type=manual"
    //     : `/management/vehicles-record/create?type=id&p=${propertyId}`;
    window.location.href = url;
  };

  // Handle navigation
  const handleNext = () => {
    if (selectedPlate) {
      setStep(2);
    } else {
      toast.error("Please select a vehicle before checking in.");
    }
  };

  const handleBack = () => {
    // setStep(1);
    setIsOpen(false);
    setSelectedPlate(null);
  };

  const [checkOut, setCheckOut] = useState({
    id: latest_check_in?.id,
    name: latest_check_in?.out_by || "---",
    passenger: latest_check_in?.passengers_out || "---",
    date: latest_check_in?.check_out_time
      ? dayjs(latest_check_in?.check_out_time).format("MMM DD YYYY hh:mma")
      : "---",
    inventory: latest_check_in?.inventory_out || "---",
  });

  const handleCheckIn = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedPlate)
      return toast.warning("Please select a vehicle before checking in.");
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    // Modify keys in formData
    const data = Object.fromEntries(formData.entries());
    data.passengers_in = data.passenger;
    delete data.passenger;
    data.inventory_in = data.inventory;
    delete data.inventory;

    // Add vehicle_record to requestId
    data.vehicle_record_id = `${selectedPlate.id}`;

    try {
      setLoading(true);
      const response = await checkInVehicle(data);
      if (response) {
        window.dispatchEvent(new Event("refetchVehicleRecord"));
        toast.success("Vehicle checked in successfully");
        setIsOpen(false);
      } else {
        toast.error("Failed to check in vehicle");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!latest_check_in?.id) return toast.warning("Cannot find check in ID");
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (data.passenger) {
      data.passengers_out = data.passenger;
      delete data.passenger;
    }

    if (data.inventory) {
      data.inventory_out = data.inventory;
      delete data.inventory;
    }

    try {
      setLoading(true);
      const response = await checkOutVehicle(data, latest_check_in.id);
      if (response) {
        // console.log("response", response);
        setCheckOut({
          id: response.id || checkOut.id,
          name: response.data.out_by || checkOut.name,
          passenger: response.data.passengers_out || checkOut.passenger,
          date: response.data.check_out_time
            ? dayjs(response.data.check_out_time).format("MMM DD YYYY")
            : checkOut.date,
          inventory: response.data.inventory_out || checkOut.inventory,
        });
        window.dispatchEvent(new Event("refetchVehicleRecord"));
        toast.success("Vehicle checked out successfully");
        setIsOpen(false);
        // setActiveStep("success-action");
      } else {
        toast.error("Failed to check out vehicle");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  // Filter data based on search term
  const filteredData = useMemo(
    () =>
      data.filter(
        (plate) =>
          plate.plate_number
            ?.toUpperCase()
            ?.includes(searchTerm.toUpperCase()) ||
          plate.name?.toUpperCase()?.includes(searchTerm.toUpperCase())
      ),
    [data, searchTerm]
  );

  // Handle check-in action
  const handleOpenCheckInOutModal = () => {
    if (!selectedPlate) {
      toast.error("Please select a vehicle before checking in.");
      return;
    }
    // if (setIsOpen) {
    //   setIsOpen(false); // Close CreateRecordModal
    // }
    setCheckInModalOpen(true); // Open CheckInOutForm modal
  };

  const isPendingVehicle = selectedPlate?.status === "pending";

  // get record link
  // /management/vehicles-record/records/${selectedPlate.id}/record
  const getRecordLink = (id: number) => {
    switch (role) {
      case "manager":
        return `/manager/management/vehicles-record/records/${id}/record`;
      case "account":
        return `/accountant/management/vehicles-record/records/${id}/record`;
      case "staff":
        return `/staff/management/vehicles-record/records/${id}/record`;
      default:
        return `/management/vehicles-record/records/${id}/record`;
    }
  };

  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div
      className="w-[600px] max-w-[80%] max-h-[90%] h-[90%] md:h-[450px] px-2 py-3 rounded-2xl overflow-x-auto custom-round-scrollbar font-medium dark:bg-darkText-primary bg-white custom-flex-col relative"
      style={{
        opacity: checkInModalOpen ? 0 : 1,
        pointerEvents: checkInModalOpen ? "none" : "auto",
      }}
    >
      {step === 1 && (
        <>
          <div className="flex gap-4 justify-between items-center sticky top-0 z-[2] bg-white dark:bg-darkText-primary p-2">
            <p className="text-base text-text-tertiary dark:text-white">
              Create / Search
            </p>
            <ModalTrigger close aria-label="Close">
              <XIcon size="30" />
            </ModalTrigger>
          </div>
          <div className="hidden md:block absolute h-full !w-[4px] bg-[#f4f4f4] top-0 left-[calc(40%+1rem)] z-[3]" />
          <div className="p-4 pt-0 mt-2 custom-flex-col md:flex-1 md:flex-row-reverse gap-8 md:overflow-hidden">
            {selectedPlate ? (
              <div className="custom-flex-col gap-4 md:flex-1 justify-start h-full md:mt-auto md:text-center relative">
                <div className="imgWrapper flex gap-2 rounded-full items-center">
                  <Image
                    src={selectedPlate.pictureSrc || empty}
                    alt="empty"
                    width={60}
                    height={60}
                    className="w-20 h-20 object-cover rounded-full custom-secondary-bg"
                  />
                  <div className="flex flex-col items-start flex-1 w-full">
                    <h3 className="dark:text-white truncate text-xl">
                      {selectedPlate.name}
                    </h3>
                    <p className="text-brand-9 text-sm">
                      ID: {selectedPlate.user_id}
                    </p>
                  </div>
                </div>
                <VehicleDetails plate={selectedPlate} />
                <div className="absolute bottom-0 left-0 w-1/2 flex justify-center gap-2">
                  <Button
                    size="sm_medium"
                    className="bg-brand-9 px-6 py-2 rounded-md"
                    // href={`/management/vehicles-record/records/${selectedPlate.id}/record`}
                    href={getRecordLink(selectedPlate.id)}
                  >
                    Open Record
                  </Button>

                  {isPendingVehicle ? (
                    <Button
                      size="sm_medium"
                      className="bg-brand-9 px-8 py-2 rounded-md"
                      onClick={handleOpenCheckInOutModal}
                    >
                      Check Out
                    </Button>
                  ) : (
                    <Button
                      size="sm_medium"
                      className="bg-brand-9 px-8 py-2 rounded-md"
                      onClick={handleOpenCheckInOutModal}
                    >
                      Check In
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="custom-flex-col gap-4 md:flex-1 md:gap-8 md:mt-auto md:text-center">
                <p className="text-sm text-text-tertiary dark:text-darkText-1 md:w-[80%] mx-auto">
                  Search existing records using ID, name, or plate number.
                  Create a new record if none exists.
                </p>
                <div className="hidden md:flex md:justify-center">
                  <DownArrow color="rgba(0,0,0,0.2)" />
                </div>
                <div className="!w-fit mx-auto flex items-center gap-4">
                  <Button
                    onClick={() => handleCreate("manual")}
                    size="sm_medium"
                    className="py-2 px-4 rounded-lg"
                  >
                    Create Manually
                  </Button>
                  <Button
                    onClick={() => handleCreate("id")}
                    size="sm_medium"
                    className="py-2 px-4 rounded-lg"
                  >
                    Create with ID
                  </Button>
                </div>
              </div>
            )}
            <div className="md:w-[40%] custom-flex-col gap-4">
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
              <div className="space-y-1 overflow-auto custom-round-scrollbar md:pr-2">
                {filteredData.length > 0 ? (
                  filteredData.map((plate) => (
                    <PlateNumber
                      key={plate.id}
                      plate={plate}
                      onClick={() => setSelectedPlate(plate)}
                      isSelected={
                        selectedPlate?.id?.toString() === plate.id?.toString()
                      }
                    />
                  ))
                ) : (
                  <p className="text-center text-sm text-text-tertiary dark:text-darkText-1">
                    No record found
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {selectedPlate && (
        <Modal
          state={{
            isOpen: checkInModalOpen,
            setIsOpen: setCheckInModalOpen,
          }}
        >
          <ModalContent>
            <CheckInOutForm
              type={isPendingVehicle ? "check-out" : "check-in"}
              useCase="vehicle"
              loading={loading}
              pictureSrc={selectedPlate.pictureSrc}
              userName={selectedPlate.name}
              id={selectedPlate.user_id}
              category={selectedPlate.visitor_category}
              registrationDate={dayjs(selectedPlate.created_at).format(
                "MMM DD, YYYY"
              )}
              handleBack={handleBack}
              onSubmit={isPendingVehicle ? handleCheckOut : handleCheckIn}
            />
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default CreateRecordModal;
