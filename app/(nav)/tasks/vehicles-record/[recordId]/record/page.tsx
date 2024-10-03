"use client";
import { useState } from "react";
import { ChevronLeft } from "@/public/icons/icons";
import { useRouter } from "next/navigation";
import Picture from "@/components/Picture/picture";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import Button from "@/components/Form/Button/button";
import UserTag from "@/components/Tags/user-tag";
import {
  LandlordTenantInfoBox as InfoBox,
  LandlordTenantInfo as ContactInfo,
} from "@/components/Management/landlord-tenant-info-components";
import PreviousRecord from "@/components/tasks/vehicles-record/previous-record";
import DefaultLandlordAvatar from "@/public/empty/landlord-avatar.png";
import { SectionSeparator } from "@/components/Section/section-components";
import { VehicleRecordData } from "@/app/(nav)/tasks/vehicles-record/data";
import Pagination from "@/components/Pagination/pagination";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";
import CheckInOutForm from "@/components/tasks/visitors-requests/check-in-out-form";
import VehicleDetailsFormModal from "@/components/tasks/vehicles-record/vehicle-details-form-modal";

interface UserData {
  user_tag: "web" | "mobile";
  pictureSrc: string;
  userName: string;
  id: string | number;
}

const RecordPage = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>({
    user_tag: "web",
    pictureSrc: "/empty/landlord-avatar.png",
    userName: "Abimbola Adedeji",
    id: "22132876554444",
  });
  if (!userData) return null;
  const { user_tag } = userData;
  return (
    <div className="space-y-5 pb-[80px]">
      <div className="flex items-center gap-2">
        <button
          aria-label="back"
          className="block"
          onClick={() => router.back()}
        >
          <ChevronLeft />
        </button>
        <p className="text-text-secondary text-base font-bold">
          Vehicle Record
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-y-5 gap-x-8">
        <InfoBox style={{ padding: "24px 40px" }}>
          <div className="flex flex-col xl:flex-row gap-5">
            <div className="flex items-start">
              <Picture
                src={DefaultLandlordAvatar}
                alt="profile picture"
                size={120}
                rounded
              />
            </div>
            <div className="w-full">
              <div className="flex items-center gap-2">
                <p className="text-black text-lg lg:text-xl font-bold text-ellipsis line-clamp-1">
                  Abimbola Adedeji
                </p>
                <BadgeIcon color="green" />
              </div>
              <p
                className="text-sm font-normal mb-4"
                style={{ color: "rgba(21, 21, 21, 0.70)" }}
              >
                abimbola@gmail.com
              </p>
              <UserTag type={userData.user_tag} />
              {user_tag === "web" ? (
                <div className="flex flex-wrap gap-4 mt-7">
                  <Button
                    // href={`/tasks/service-providers/${1}/manage/edit`}
                    size="base_medium"
                    variant="border"
                    className="py-2 px-8"
                  >
                    Edit
                  </Button>
                  <Button size="base_medium" className="py-2 px-8">
                    Update with ID
                  </Button>
                </div>
              ) : (
                <div className="flex items-end gap-2 mt-4">
                  <p className="text-base font-normal">ID: 22132876554444</p>
                  <Button size="base_medium" className="py-2 px-8">
                    Message
                  </Button>
                </div>
              )}
            </div>
          </div>
        </InfoBox>
        {user_tag === "mobile" && (
          <ContactInfo
            containerClassName="flex flex-col justify-center"
            info={{
              Gender: "Male",
              Religion: "Christianity",
              Phone: "08132086958",
            }}
          />
        )}
        <ContactInfo
          containerClassName="flex flex-col justify-center"
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
      <InfoBox className="text-black text-lg lg:text-xl font-bold">
        <h3>Vehicle Details</h3>
        <SectionSeparator className="my-4" />
        <div className="flex gap-16 text-sm lg:text-base font-normal capitalize">
          <div className="flex gap-6">
            <div className="custom-flex-col gap-4 [&>p]:text-[#747474]">
              <p>Brand Name</p>
              <p>Model</p>
              <p>Manufacturer</p>
            </div>
            <div className="custom-flex-col gap-4 [&>p]:text-black">
              <p>Toyota</p>
              <p>Corolla</p>
              <p>2002</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="custom-flex-col gap-4 [&>p]:text-[#747474]">
              <p>Plate Number</p>
              <p>State</p>
            </div>
            <div className="custom-flex-col gap-4 [&>p]:text-black">
              <p>OS102DR</p>
              <p>Lagos</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="custom-flex-col gap-4 [&>p]:text-[#747474]">
              <p>Category</p>
              <p>Color</p>
            </div>
            <div className="custom-flex-col gap-4 [&>p]:text-black">
              <p>Guest</p>
              <p>Black</p>
            </div>
          </div>
          <Modal>
            <ModalTrigger asChild>
              <Button size="base_medium" className="py-2 px-8 ml-auto self-end">
                Edit
              </Button>
            </ModalTrigger>
            <ModalContent>
              <VehicleDetailsFormModal
                editMode={true}
                data={{
                  brand_name: "Toyota",
                  plate_number: "OS102DR",
                  state: "Lagos",
                  model: "Corolla",
                  vehicle_type: "",
                  color: "Black",
                  manufacturer_year: "2002",
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
      <div
        className="fixed z-[3] w-screen left-0 h-[80px] bottom-0 py-5 px-[60px] bg-white flex items-center justify-end gap-4"
        style={{ boxShadow: "0px -2px 10px 0px rgba(0, 0, 0, 0.05)" }}
      >
        <Modal>
          <ModalTrigger asChild>
            <Button size="base_medium" className="py-2 px-8">
              Create New Record
            </Button>
          </ModalTrigger>
          <ModalContent>
            <CheckInOutForm
              useCase="vehicle"
              type="check-in"
              pictureSrc={userData.pictureSrc}
              userName={userData.userName}
              id={userData.id}
              category="Guest"
              registrationDate="12/01/2024 (08:09pm)"
            />
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default RecordPage;
