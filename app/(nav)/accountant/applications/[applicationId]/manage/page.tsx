"use client";

// Images
import Avatar3 from "@/public/empty/avatar-3.svg";

// Imports
import { secondaryFont } from "@/utils/fonts";
import Picture from "@/components/Picture/picture";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import UnitItem from "@/components/Management/Properties/unit-item";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { SectionSeparator } from "@/components/Section/section-components";
import { useSearchParams } from "next/navigation";
import {
  LandlordTenantInfo,
  LandlordTenantInfoSection,
  LandlordTenantInfoBox,
} from "@/components/Management/landlord-tenant-info-components";

import UserTag from "@/components/Tags/user-tag";
import useDarkMode from "@/hooks/useCheckDarkMode";
import Button from "@/components/Form/Button/button";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";

const ManageApplication = () => {
  const isDarkMode = useDarkMode();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as "flagged" | "unflagged";
  const isFlagged = type === "flagged";
  return (
    <div className="custom-flex-col gap-[88px] pb-[150px] lg:pb-[100px]">
      <div className="custom-flex-col gap-6">
        <BackButton>Back</BackButton>
        <div
          style={{ boxShadow: " 4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
          className="custom-flex-col gap-[10px] p-6 rounded-lg overflow-hidden bg-white dark:bg-darkText-primary"
        >
          <p className="text-primary-navy dark:text-white text-xl font-bold">
            Property Details
          </p>
          <SectionSeparator />
          <div className="flex gap-4 lg:gap-0 flex-col lg:flex-row">
            <KeyValueList
              data={{}}
              chunkSize={4}
              referenceObject={{
                "property title": "",
                "full access": "",
                landlord: "",
                description: "",
                state: "",
                branch: "",
                categories: "",
                rent: "",
                "local government": "",
                "account officer": "",
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-5">
          <div
            className="custom-flex-col gap-5 pt-6 bg-white dark:bg-darkText-primary rounded-2xl overflow-hidden"
            style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
          >
            <div className="flex items-center px-10 gap-5">
              <Picture src={Avatar3} alt="profile picture" size={120} rounded />
              <div className="custom-flex-col gap-4">
                <div className="custom-flex-col">
                  <div className="flex gap-2">
                    <p className="text-black dark:text-white text-xl font-bold capitalize">
                      Abimbola Adedeji
                    </p>
                    <BadgeIcon color="green" />
                  </div>
                  <p
                    style={{
                      color: isDarkMode ? "white" : "rgba(21, 21, 21, 0.70)",
                    }}
                    className={`text-sm dark:text-white font-normal ${secondaryFont.className}`}
                  >
                    abimbola@gmail.com
                  </p>
                </div>
                <div className="flex">
                  <UserTag type="mobile" />
                </div>
                <p className="text-neutral-800 dark:text-darkText-1 text-base font-medium">
                  ID: 22132876554444
                </p>
              </div>
            </div>
            {isFlagged ? (
              <div
                className="py-3 px-6 rounded-2xl"
                style={{
                  backgroundColor: isDarkMode
                    ? "#3C3D37"
                    : "var(--background-color, #fde9ea80)",
                }}
              >
                <p className="text-status-error-2 text-xs font-medium">
                  The tenant has been flagged for owing rent and causing damages
                  by <span className="font-bold">David & Co Limited</span>.
                  Please instruct the applicant to settle with their previous
                  manager so that they can unflag the account using their ID.
                </p>
              </div>
            ) : (
              <p className="flex gap-4 items-center text-highlight text-base font-medium px-10">
                <span>Applying for</span>
                <span>5 Years</span>
              </p>
            )}
          </div>
          <LandlordTenantInfo
            info={{
              gender: "",
              birthday: "",
              religion: "",
              phone: "",
              "marital status": "",
            }}
          />
          <LandlordTenantInfo
            heading="bank details"
            info={{
              "bank name": "",
              "account name": "",
              "bank account no": "",
              "wallet ID": "",
            }}
          />
          <LandlordTenantInfo
            heading="Contact Address"
            info={{
              address: "",
              city: "",
              state: "",
              "L.G": "",
            }}
          />
          <LandlordTenantInfo
            heading="Next of Kin"
            info={{
              namme: "",
              address: "",
              "phone number": "",
              relationship: "",
            }}
          />
          <LandlordTenantInfo
            heading="others"
            info={{
              occupation: "",
              "employment type": "",
              "family type": "",
              xxxxxxxxxxxxx: "",
            }}
          />
          <LandlordTenantInfo
            heading="Guarantor 1"
            info={{
              name: "",
              email: "",
              "phone number": "",
              address: "",
            }}
          />
          <LandlordTenantInfo
            heading="Guarantor 2"
            info={{
              name: "",
              email: "",
              "phone number": "",
              address: "",
            }}
          />
          <LandlordTenantInfoBox className="space-y-4">
            <h3 className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize">
              Proior Experience in Real Estate
            </h3>
            <p className="text-black dark:text-darkText-2 text-base font-normal">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quos. Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Quisquam, quos.
            </p>
          </LandlordTenantInfoBox>
          <LandlordTenantInfoBox className="space-y-4">
            <h3 className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize">
              Jusification for clearing next rent
            </h3>
            <p className="text-black dark:text-darkText-2 text-base font-normal">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quos. Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Quisquam, quos.
            </p>
          </LandlordTenantInfoBox>
        </div>
      </div>
      <LandlordTenantInfoSection title="Current Rent">
        <div className="opacity-40">
          {/* <UnitItem /> */}
        </div>
      </LandlordTenantInfoSection>
      <LandlordTenantInfoSection title="Property">
        <div className="opacity-40">
          {/* <UnitItem /> */}
        </div>
      </LandlordTenantInfoSection>
      <LandlordTenantInfoSection title="Previous Rent">
        <div className="opacity-40">
          {/* <UnitItem /> */}
        </div>
      </LandlordTenantInfoSection>
      <LandlordTenantInfoSection title="Previous Property">
        <div className="opacity-40">
          {/* <UnitItem /> */}
        </div>
      </LandlordTenantInfoSection>
      <FixedFooter className="flex gap-6 flex-wrap items-center justify-between">
        <Button
          variant="light_red"
          size="base_bold"
          className="py-2 px-8"
          disabled={isFlagged}
        >
          reject application
        </Button>
        <div className="flex gap-6">
          <Button
            size="base_bold"
            variant="sky_blue"
            className="py-2 px-8"
            disabled={isFlagged}
          >
            start rent
          </Button>
          <Button size="base_bold" className="py-2 px-8" disabled={isFlagged}>
            create invoice
          </Button>
        </div>
      </FixedFooter>
    </div>
  );
};

export default ManageApplication;
