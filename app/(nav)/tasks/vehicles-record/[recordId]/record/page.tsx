"use client";
import { useState } from "react";
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
import { VehicleRecordData } from "@/app/(nav)/tasks/vehicles-record/data";
import Pagination from "@/components/Pagination/pagination";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";
import CheckInOutForm from "@/components/tasks/visitors-requests/check-in-out-form";
import {
  EditVehicleDetailsFormModal,
  EditPersonalDetailsFormModal,
} from "@/components/tasks/vehicles-record/edit-vehicle-details";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";

interface UserData {
  user_tag: "web" | "mobile";
  id: string | number;
  pictureSrc: string;
  full_name: string;
  state: string;
  local_government: string;
  city: string;
  address: string;
  phone_number: string;
  avatar: string;
  notes: {
    last_updated: string;
    write_up: string;
  };
}

const Detail: React.FC<{
  label: string;
  value: string;
}> = ({ label, value }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-x-4 gap-y-1">
      <p className="text-[#747474] dark:text-darkText-2 w-[135px]">{label}</p>
      <p className="text-black dark:text-white capitalize">{value}</p>
    </div>
  );
};

const RecordPage = () => {
  const [userData, setUserData] = useState<UserData | null>({
    user_tag: Math.random() > 0.5 ? "web" : "mobile",
    pictureSrc: "/empty/landlord-avatar.png",
    full_name: "Abimbola Adedeji",
    state: "Oyo",
    local_government: "Ibadan North Central",
    city: "Ibadan",
    address: "U4 Joke Plaza Bodija Ibadan",
    phone_number: "2348132086958",
    avatar: "/empty/avatar-1.svg",
    id: "22132876554444",
    notes: {
      last_updated: "22/12/2022",
      write_up:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. building, is a residential property that living read more. They want to work with their budget in booking an appointment. They wants to ease themselves the stress having to que, and also reduce the time spent searching for something new.for something new. A multi-family home, also know as a duplex, triplex, or multi-unit building, is a residential property that living read more. They want to work with their budget in booking an appointment. ime spent searching",
    },
  });
  if (!userData) return null;
  const {
    user_tag,
    notes,
    full_name,
    state,
    address,
    avatar,
    local_government,
    city,
    phone_number,
  } = userData;
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
              src={DefaultLandlordAvatar}
              alt="profile picture"
              size={120}
              rounded
            />
            <div className="custom-flex-col gap-4">
              <div className="custom-flex-col">
                <div className="flex items-center">
                  <p className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize">
                    Abimbola Ayodeji
                  </p>
                  <BadgeIcon color="blue" />
                </div>
                <p
                  className={`${secondaryFont.className} text-sm dark:text-darkText-2 font-normal`}
                >
                  ayo@gmail.com
                </p>
              </div>
              <div className="custom-flex-col gap-2">
                <UserTag type={user_tag} />
                {user_tag === "mobile" && (
                  <p className="text-neutral-800 dark:text-darkText-2 text-base font-medium">
                    ID: 22132876554444
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="w-fit mx-auto flex flex-wrap gap-4">
            {user_tag === "mobile" ? (
              <>
                <Button size="base_medium" className="py-2 px-8">
                  message
                </Button>
              </>
            ) : (
              <>
                <Modal>
                  <ModalTrigger asChild>
                    <Button size="base_medium" className="py-2 px-8">
                      Edit
                    </Button>
                  </ModalTrigger>
                  <ModalContent>
                    <EditPersonalDetailsFormModal
                      data={{
                        full_name,
                        state,
                        address,
                        avatar,
                        local_government,
                        city,
                        phone_number,
                      }}
                    />
                  </ModalContent>
                </Modal>
                <Button size="base_medium" className="py-2 px-8">
                  Update with ID
                </Button>
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
                <MobileNotesModal notes={notes} />
              </ModalContent>
            </Modal>
          </div>
        </InfoBox>

        {user_tag === "mobile" && (
          <ContactInfo
            info={{
              Gender: "Male",
              Religion: "Christianity",
              Phone: "08132086958",
            }}
          />
        )}
        <ContactInfo
          heading="Contact Address"
          info={{
            Address: "U4 Joke Plaza Bodija Ibadan",
            city: "Ibadan",
            State: "Oyo State",
            "L.G": "Ibadan North Central",
          }}
        />
        {user_tag === "mobile" && (
          <ContactInfo
            heading="Next of Kin"
            containerClassName="flex flex-col justify-center"
            info={{
              Name: "Abimbola Adedeji",
              email: "abimbola@gmail.com",
              "Phone Number": "08132086958",
              relationship: "Father",
            }}
          />
        )}
      </div>
      {/* <VehicleDetails /> */}
      <InfoBox className="text-black dark:text-white text-lg lg:text-xl font-bold">
        <h3>Vehicle Details</h3>
        <SectionSeparator className="my-4" />
        <div className="flex flex-wrap gap-4 lg:gap-16 text-sm lg:text-base font-normal capitalize">
          <div className="grid gap-y-4 gap-x-8 grid-cols-2 lg:grid-cols-3">
            <Detail label="Brand Name" value="Toyota" />
            <Detail label="Plate Number" value="OS102DR" />
            <Detail label="Category" value="Guest" />
            <Detail label="Model" value="Corolla" />
            <Detail label="State" value="Lagos" />
            <Detail label="Color" value="Black" />
            <Detail label="Manufacture Year" value="2002" />
          </div>
          <Modal>
            <ModalTrigger asChild>
              <Button size="base_medium" className="py-2 px-8 ml-auto self-end">
                Edit
              </Button>
            </ModalTrigger>
            <ModalContent>
              <EditVehicleDetailsFormModal
                data={{
                  brand_name: "Volvo",
                  plate_number: "OS102DR",
                  state: "Lagos",
                  model: "Corolla",
                  vehicle_type: "Cars",
                  color: "Black",
                  manufacturer_year: "2022 - 2026",
                  visitor_category: "Guest",
                }}
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
          {VehicleRecordData.map((record) => (
            <PreviousRecord key={record.id} {...record} />
          ))}
        </div>
      </div>
      <Pagination totalPages={10} currentPage={1} onPageChange={() => {}} />
      <FixedFooter className="flex items-center justify-end">
        <Modal>
          <ModalTrigger asChild>
            <Button size="sm_normal" className="py-2 px-8">
              Create New Record
            </Button>
          </ModalTrigger>
          <ModalContent>
            <CheckInOutForm
              useCase="vehicle"
              type="check-in"
              pictureSrc={userData.pictureSrc}
              userName={userData.full_name}
              id={userData.id}
              category="Guest"
              registrationDate="12/01/2024 (08:09pm)"
            />
          </ModalContent>
        </Modal>
      </FixedFooter>
    </div>
  );
};

export default RecordPage;
