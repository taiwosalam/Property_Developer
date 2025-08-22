"use client";

// Fonts
import { secondaryFont } from "@/utils/fonts";

// Imports
import Picture from "@/components/Picture/picture";
import { empty } from "@/app/config";
import Button from "@/components/Form/Button/button";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import {
  LandlordTenantInfo,
  LandlordTenantInfoBox,
  LandlordTenantInfoSection,
  LandlordTenantInfoDocument,
  NotesInfoBox,
  MobileNotesModal,
} from "@/components/Management/landlord-tenant-info-components";
import PropertyCard from "@/components/Management/Properties/property-card";
import { LandlordEditContext } from "@/components/Management/Landlord/landlord-edit-context";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import { ChevronLeft } from "@/public/icons/icons";
import { useRouter } from "next/navigation";
import UserTag from "@/components/Tags/user-tag";
import CustomLoader from "@/components/Loader/CustomLoader";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { LandlordEditAttachmentInfoSection } from "@/components/Management/Landlord/Edit/landlord-edit-info-sections";
import NetworkError from "@/components/Error/NetworkError";
import CustomTable from "@/components/Table/table";
import { groupDocumentsByType } from "@/utils/group-documents";
import useFetch from "@/hooks/useFetch";

const ManageLandlord = ({ params }: { params: { landlordId: string } }) => {
  const router = useRouter();
  return (
    <div className="custom-flex-col gap-6 lg:gap-10">
      <div className="grid  lg:grid-cols-2 gap-y-5 gap-x-8">
        <LandlordTenantInfoBox
          style={{ padding: "24px 40px" }}
          className="relative space-y-5"
        >
          <div className="flex flex-col xl:flex-row gap-5">
            <button
              type="button"
              aria-label="back"
              className="absolute top-3 left-3"
              onClick={() => router.back()}
            >
              <ChevronLeft />
            </button>
            <Picture
              src={empty}
              alt="profile picture"
              size={120}
              containerClassName="w-fit bg-[#F0F2F5] rounded-full"
              rounded
            />

            <div className="custom-flex-col gap-4">
              <div className="custom-flex-col">
                <div className="flex items-center">
                  <p className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize">
                    Sogo
                  </p>
                  <BadgeIcon color="red" />
                </div>
                <p
                  className={`${secondaryFont.className} text-sm font-normal text-[#151515B2] dark:text-[#FFFFFFB2]`}
                >
                  emmanuelar35@gmail.com
                </p>
              </div>
              <div className="custom-flex-col gap-2">
                {/* <UserTag type={landlordData.user_tag} /> */}
                <UserTag type="mobile" />
                <p className="text-neutral-800 dark:text-darkText-1 text-base font-medium">
                  Bamimore
                  {/* ID: {landlordData?.user_id} */}
                </p>
              </div>
            </div>
          </div>

          <div className="w-fit mx-auto flex flex-wrap gap-4">
            <Button
              href={`/user/settings/profile/edit`}
              size="base_medium"
              className="py-2 px-8"
            >
              edit
            </Button>
            <Button size="base_medium" className="py-2 px-8">
              update with ID
            </Button>
          </div>
        </LandlordTenantInfoBox>
        <LandlordTenantInfo
          info={{
            gender: "Male",
            Birthday: "12/12/12",
            Religion: "Christianity",
            Phone: "+2348132086958",
            Marital_Status: "Single",
          }}
        />
        <LandlordTenantInfo
          heading="Bank Details"
          info={{
            bank_name: "Zenith Bank",
            account_name: "Bamimore Sogo",
            bank_account_no: "Christianity",
            wallet_ID: "42547587",
          }}
        />
        <LandlordTenantInfo
          heading="Contact Address"
          info={{
            address: "U4 Joke Plaza Bodija Ibadan",
            City: "Ibadan",
            State: "Oyo State",
            LG: "Ifesowapo",
          }}
        />{" "}
        <LandlordTenantInfo
          heading="Next of Kin"
          info={{
            name: "Bamimore Sogo",
            address: "Olapeju street",
            phone_number: "+2348132086958",
            relationship: "brother",
          }}
        />{" "}
        <LandlordTenantInfo
          heading="Others"
          info={{
            occupation: "Student | Self Employed",
            emplyment_type: "Full Time",
            Family_Type: "Private",
            Phone: "+2348132086958",
            xxxxxxxxxxxx: "xxxxxxxxxx",
          }}
        />{" "}
        <LandlordTenantInfo
          heading="Guarantor 1"
          info={{
            name: "Alao Akala",
            email: "emmanuelar35@gmail.com",
            phone_number: "+2348132086958",
            address: "Lokoja rd",
          }}
        />
        <LandlordTenantInfo
          heading="Guarantor 2"
          info={{
            name: "Alao Akala",
            email: "emmanuelar35@gmail.com",
            phone_number: "+2348132086958",
            address: "Lokoja rd",
          }}
        />
      </div>
    </div>
  );
};

export default ManageLandlord;
