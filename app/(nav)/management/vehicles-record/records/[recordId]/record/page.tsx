"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Picture from "@/components/Picture/picture";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { secondaryFont } from "@/utils/fonts";
import Button from "@/components/Form/Button/button";
import UserTag from "@/components/Tags/user-tag";
import {
  LandlordTenantInfoBox as InfoBox,
  LandlordTenantInfo as ContactInfo,
  MobileNotesModal,
} from "@/components/Management/landlord-tenant-info-components";
import PreviousRecord from "@/components/tasks/vehicles-record/previous-record";
import DefaultLandlordAvatar from "@/public/empty/landlord-avatar.png";
import { SectionSeparator } from "@/components/Section/section-components";
import Pagination from "@/components/Pagination/pagination";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";
import CheckInOutForm from "@/components/tasks/visitors-requests/check-in-out-form";
import {
  EditVehicleDetailsFormModal,
  EditPersonalDetailsFormModal,
} from "@/components/tasks/vehicles-record/edit-vehicle-details";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import {
  transformSingleVehicleRecordApiResponse,
  UserData,
  VehicleDetails,
  WebContactInfo,
  checkInsOutData,
  SingleVehicleRecordApiResponse,
} from "./data";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import { checkInVehicle } from "@/components/tasks/vehicles-record/data";
import { toast } from "sonner";
import { Box as MuiBox, Modal as MuiModal } from "@mui/material";
import { UseerSkeletonVehicleRecord } from "@/components/Skeleton/vehicle-record";
import ServerError from "@/components/Error/ServerError";
import UpdateVehicleWithEmail from "@/components/Modal/update-vehicle-record";
import { NoteBlinkingIcon } from "@/public/icons/dashboard-cards/icons";
import { NotepadTextDashed } from "lucide-react";
import { empty } from "@/app/config";

interface TransformedData {
  userData: UserData | null;
  vehicleDetails: VehicleDetails | null;
  webContactInfo: WebContactInfo | null;
  checkInsOutData: checkInsOutData | null;
}

interface DetailProps {
  label: string;
  value: string;
}

const Detail: React.FC<DetailProps> = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row gap-x-4 gap-y-1">
    <p className="text-[#747474] dark:text-darkText-2 w-[135px]">{label}</p>
    <p className="text-black dark:text-white capitalize">{value}</p>
  </div>
);

interface Notes {
  last_updated: string;
  write_up?: string;
}

const RecordPage = () => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [updateUserModal, setUpdateUserModal] = useState(false);
  const [updateVehicleModal, setUpdateVehicleModal] = useState(false);
  const { recordId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [checking, setChecking] = useState(false);

  const initialState: TransformedData = {
    userData: null,
    vehicleDetails: null,
    webContactInfo: null,
    checkInsOutData: null,
  };

  const [states, setStates] = useState<TransformedData>(initialState);

  const handlePageChange = (page: number) => {
    setSearchQuery("");
    setStates((prevState) => ({
      ...prevState,
      checkInsOutData: {
        ...prevState.checkInsOutData,
        current_page: page,
        check_ins: prevState.checkInsOutData?.check_ins || [],
        total: prevState.checkInsOutData?.total || 0,
        prev_page_url: prevState.checkInsOutData?.prev_page_url || "",
        last_page: prevState.checkInsOutData?.last_page || 0,
        next_page_url: prevState.checkInsOutData?.next_page_url || "",
        first_page_url: prevState.checkInsOutData?.first_page_url || "",
        last_page_url: prevState.checkInsOutData?.last_page_url || "",
        per_page: prevState.checkInsOutData?.per_page || 0,
      },
    }));
  };

  const config = useMemo(
    () => ({
      params: {
        page: states.checkInsOutData?.current_page || 1,
        search: searchQuery,
      },
    }),
    [states.checkInsOutData?.current_page, searchQuery]
  );

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<SingleVehicleRecordApiResponse>(
    `vehicle-records/${recordId}/show-details`,
    config
  );

  useRefetchOnEvent("refetchVehicleRecord", () => refetch({ silent: true }));

  useEffect(() => {
    if (apiData && "data" in apiData && apiData.data) {
      try {
        const transformed = transformSingleVehicleRecordApiResponse(apiData);
        setStates((prevState) => ({
          ...prevState,
          userData: transformed.userData,
          vehicleDetails: transformed.vehicleDetails,
          webContactInfo: transformed.webContactInfo,
          checkInsOutData: transformed.checkInsOutData,
        }));
      } catch (error) {
        console.error("Transformation error:", error, apiData);
      }
    } else if (!loading) {
      console.error("Invalid API data format:", apiData);
    }
  }, [apiData, loading]);

  const { userData, vehicleDetails, webContactInfo, checkInsOutData } = states;

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-brand-9 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;
  if (!userData || !vehicleDetails || !webContactInfo) {
    return <div>No data available.</div>;
  }

  const {
    user_tag,
    notes,
    note,
    full_name,
    state: userState,
    address,
    avatar,
    local_government,
    city,
    phone_number,
    id: userId,
    pictureSrc,
    registrationDate,
  } = userData;

  const {
    id,
    brand,
    plate_number,
    category,
    model,
    state: vehicleState,
    color,
    manufacture_year,
    vehicle_type,
  } = vehicleDetails;

  const handleCheckIn = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    // Modify keys in formData
    const data = Object.fromEntries(formData.entries());
    data.passengers_in = data.passenger;
    delete data.passenger;
    data.inventory_in = data.inventory;
    delete data.inventory;

    // Add vehicle_record to requestId
    data.vehicle_record_id = `${recordId}`;

    try {
      setChecking(true);
      const response = await checkInVehicle(data);
      if (response) {
        window.dispatchEvent(new Event("refetchVehicleRecord"));
        toast.success("Vehicle checked in successfully");
        setModalOpen(false);
      } else {
        toast.error("Failed to check in vehicle");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setChecking(false);
    }
  };

  // Check if there's a record
  const hasRecords = (checkInsOutData?.check_ins ?? []).length > 0;

  // Handle Edit Vehicle button click
  const handleEditVehicleClick = () => {
    if (hasRecords) {
      toast.warning("Cannot update details if there's a record.");
      return;
    }
    setUpdateVehicleModal(true);
  };

  // Check if there's a pending record
  const hasPendingRecord =
    checkInsOutData?.check_ins?.some((record) => record.status === "pending") ||
    false;

  // Handle button click when there's a pending record
  const handleCreateNewRecordClick = () => {
    if (hasPendingRecord) {
      toast.warning(
        "There’s a pending record that needs to be checked out before creating a new record."
      );
      return;
    }
    setModalOpen(true);
  };

  return (
    <div className="space-y-5 pb-[100px]">
      <BackButton>Vehicle Record</BackButton>
      <div className="grid lg:grid-cols-2 gap-y-5 gap-x-8">
        <InfoBox
          style={{ padding: "24px 40px" }}
          className="relative space-y-5"
        >
          <div className="flex flex-col xl:flex-row gap-5">
            <Picture
              src={avatar || empty}
              alt="profile picture"
              size={120}
              rounded
              className="custom-secondary-bg"
            />
            <div className="custom-flex-col gap-4">
              <div className="custom-flex-col">
                <div className="flex items-center">
                  <p className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize">
                    {full_name}
                  </p>
                  {/* <BadgeIcon color="blue" /> */}
                </div>
                <p
                  className={`${secondaryFont.className} text-sm dark:text-darkText-2 font-normal`}
                >
                  {phone_number}
                </p>
              </div>
              <div className="custom-flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <UserTag type={user_tag} />
                  {note && (
                    <NoteBlinkingIcon size={20} className="blink-color" />
                  )}
                </div>
                {user_tag === "mobile" && (
                  <p className="text-neutral-800 dark:text-darkText-2 text-base font-medium">
                    ID: {userId}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="w-fit mx-auto flex flex-wrap gap-4">
            {user_tag === "mobile" ? (
              <>
                <Button size="base_medium" className="py-2 px-8">
                  Message
                </Button>
              </>
            ) : (
              <>
                <Modal
                  state={{
                    isOpen: updateUserModal,
                    setIsOpen: setUpdateUserModal,
                  }}
                >
                  <ModalTrigger asChild>
                    <Button size="base_medium" className="py-2 px-8">
                      Edit
                    </Button>
                  </ModalTrigger>
                  <ModalContent>
                    <EditPersonalDetailsFormModal
                      data={{
                        id: vehicleDetails.id,
                        full_name,
                        state: userState,
                        address,
                        avatar,
                        local_government,
                        city,
                        phone_number,
                      }}
                      isOpen={updateUserModal}
                      setIsOpen={setUpdateUserModal}
                    />
                  </ModalContent>
                </Modal>
                <Modal>
                  <ModalTrigger asChild>
                    <Button size="base_medium" className="py-2 px-8">
                      Update with Email
                    </Button>
                  </ModalTrigger>
                  <ModalContent>
                    <UpdateVehicleWithEmail recordId={recordId.toString()} />
                  </ModalContent>
                </Modal>
              </>
            )}
            <Modal>
              <ModalTrigger asChild>
                <Button
                  variant="sky_blue"
                  size="base_medium"
                  className="py-2 px-8"
                >
                  Note
                </Button>
              </ModalTrigger>
              <ModalContent>
                <MobileNotesModal
                  page="vehicle-record"
                  id={recordId.toString()}
                  defaultNote={note}
                />
              </ModalContent>
            </Modal>
          </div>
        </InfoBox>

        {user_tag === "mobile" && (
          <ContactInfo
            info={{
              Gender: "Male",
              Religion: "Christianity",
              Phone: phone_number,
            }}
          />
        )}
        <ContactInfo
          heading="Contact Address"
          info={{
            Address: address,
            City: city,
            State: userState,
            "L.G": local_government,
          }}
        />
        {user_tag === "mobile" && (
          <ContactInfo
            heading="Next of Kin"
            containerClassName="flex flex-col justify-center"
            info={{
              Name: "Abimbola Adedeji",
              email: "abimbola@gmail.com",
              "Phone Number": phone_number,
              relationship: "Father",
            }}
          />
        )}
      </div>

      {/* Vehicle Details */}
      <InfoBox className="text-black dark:text-white text-lg lg:text-xl font-bold">
        <h3>Vehicle Details</h3>
        <SectionSeparator className="my-4" />
        <div className="flex flex-wrap gap-4 lg:gap-16 text-sm lg:text-base font-normal capitalize">
          <div className="grid gap-y-4 gap-x-8 grid-cols-2 lg:grid-cols-3">
            <Detail label="Brand Name" value={brand} />
            <Detail label="Plate Number" value={plate_number} />
            <Detail label="Category" value={category} />
            <Detail label="Model" value={model} />
            <Detail label="State" value={vehicleState} />
            <Detail label="Color" value={color || "N/A"} />
            <Detail label="Manufacture Year" value={manufacture_year} />
          </div>
          <Button
            size="base_medium"
            className="py-2 px-8 ml-auto self-end"
            onClick={handleEditVehicleClick}
          >
            Edit
          </Button>
          <Modal
            state={{
              isOpen: updateVehicleModal,
              setIsOpen: setUpdateVehicleModal,
            }}
          >
            <ModalContent>
              <EditVehicleDetailsFormModal
                data={{
                  id: vehicleDetails.id,
                  brand_name: brand,
                  plate_number: plate_number,
                  state: vehicleState,
                  model: model,
                  vehicle_type: vehicle_type,
                  color: color || "",
                  manufacturer_year: manufacture_year,
                  visitor_category: category,
                }}
                setIsOpen={setUpdateVehicleModal}
              />
            </ModalContent>
          </Modal>
        </div>
      </InfoBox>

      {/* Previous Records */}
      <div className="space-y-4">
        <h2 className="text-brand-9 font-bold text-lg lg:text-xl">
          Previous Records
        </h2>
        <SectionSeparator />
        <div className="space-y-4">
          {checkInsOutData?.check_ins?.map((record) => (
            <PreviousRecord
              key={record.id}
              category={category}
              userId={Number(userId)}
              registrationDate={record.created_at}
              pictureSrc={pictureSrc}
              {...record}
            />
          ))}
        </div>
      </div>
      <Pagination
        totalPages={checkInsOutData?.last_page || 1}
        currentPage={checkInsOutData?.current_page || 1}
        onPageChange={handlePageChange}
      />
      <FixedFooter className="flex items-center justify-end">
        {hasPendingRecord ? (
          <Button
            size="base_medium"
            className="py-2 px-8"
            onClick={() => router.back()}
          >
            Ok
          </Button>
        ) : (
          <Modal state={{ isOpen: modalOpen, setIsOpen: setModalOpen }}>
            <Button
              onClick={handleCreateNewRecordClick}
              size="sm_normal"
              className="py-2 px-8"
            >
              Create New Record
            </Button>
            <ModalContent>
              <CheckInOutForm
                onSubmit={handleCheckIn}
                loading={checking}
                useCase="vehicle"
                type="check-in"
                pictureSrc={pictureSrc}
                userName={full_name}
                id={userId}
                category={category}
                registrationDate={registrationDate}
              />
            </ModalContent>
          </Modal>
        )}
      </FixedFooter>
    </div>
  );
};

export default RecordPage;
