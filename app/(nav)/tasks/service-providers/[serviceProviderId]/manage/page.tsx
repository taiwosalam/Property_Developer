"use client";

import clsx from "clsx";
import { useState } from "react";
import { secondaryFont } from "@/utils/fonts";
import {
  LandlordTenantInfoBox as InfoBox,
  LandlordTenantInfo as ContactInfo,
  LandlordTenantInfoSection as InfoSection,
} from "@/components/Management/landlord-tenant-info-components";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput/phone-number-input";
import Picture from "@/components/Picture/picture";
import DefaultLandlordAvatar from "@/public/empty/landlord-avatar.png";
import Button from "@/components/Form/Button/button";
import UserTag from "@/components/Tags/user-tag";
import SampleLogo from "@/public/empty/SampleLogo.jpeg";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import { ChevronLeft } from "@/public/icons/icons";
import { useRouter } from "next/navigation";
import ServiceCard from "@/components/tasks/service-providers/service-card";
// import { useParams } from "next/navigation";
interface ServiceProviderData {
  user_tag: "web" | "mobile";
  // user_name: string;
  // user_email: string;
  // user_wallet_id: string;
  // user_phone_number: string;
}

const ManageServiceProvider = () => {
  const router = useRouter();
  const [serviceProviderData, setServiceProviderData] =
    useState<ServiceProviderData | null>({
      user_tag: "web",
    });
  if (!serviceProviderData) return null;
  const { user_tag } = serviceProviderData;

  return (
    <div className="space-y-5">
      <div className="grid lg:grid-cols-2 gap-y-5 gap-x-8">
        <InfoBox style={{ padding: "24px 40px" }} className="relative">
          <button
            type="button"
            aria-label="back"
            className="absolute top-3 left-3"
            onClick={() => router.back()}
          >
            <ChevronLeft />
          </button>
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
              <p className="text-black text-lg lg:text-xl font-bold">
                Abimbola Adedeji
              </p>
              <p
                className={clsx(
                  "text-sm font-normal mb-4",
                  secondaryFont.className
                )}
                style={{ color: "rgba(21, 21, 21, 0.70)" }}
              >
                abimbola@gmail.com
              </p>
              <UserTag type={serviceProviderData.user_tag} />
              {user_tag === "mobile" && (
                <div className="mt-2 flex flex-col gap-1">
                  <p className="text-base font-normal">
                    Wallet ID: 22132876554444
                  </p>
                  <p className="text-base font-normal">Phone NO: 08132086958</p>
                </div>
              )}
              {user_tag === "web" ? (
                <div className="flex flex-wrap gap-4 mt-7">
                  <Button
                    href={`/tasks/service-providers/${1}/manage/edit`}
                    size="base_medium"
                    variant="border"
                    className="py-2 px-8"
                  >
                    Manage
                  </Button>
                  <Button size="base_medium" className="py-2 px-8">
                    Update with ID
                  </Button>
                </div>
              ) : (
                <Button
                  size="base_medium"
                  className="block ml-auto mt-2 py-2 px-8"
                >
                  Message
                </Button>
              )}
            </div>
          </div>
        </InfoBox>

        {user_tag === "web" ? (
          <ContactInfo
            containerClassName="flex flex-col justify-center"
            info={{
              "Company Name": "Abmbola Services",
              "Full name": "Abimbola Adedeji",
              email: "abimbolaadedeji@gmail.com",
              "Company Phone": "+2348132086958 ; +2348132086958",
              services: "Painter",
            }}
          />
        ) : (
          <InfoBox className="space-y-6">
            <p className="text-black text-lg lg:text-xl font-bold capitalize">
              About Business
            </p>
            <Picture
              src={SampleLogo}
              alt="sample logo"
              width={300}
              height={67}
              containerClassName="ml-10"
            />
            <p className="font-normal text-xs text-text-quaternary">
              A multi-family home, also know as a duplex, triplex, or multi-unit
              building, is a residential property that living read more. They
              want to work with their budget in booking an appointment. They
              wants to ease themselves of the stress of having to que, and also
              reduce.
            </p>
          </InfoBox>
        )}
      </div>
      <div
        className={clsx(
          "grid gap-y-5 gap-x-8",
          user_tag === "mobile" ? "lg:grid-cols-3" : "lg:grid-cols-2"
        )}
      >
        {user_tag === "mobile" && (
          <ContactInfo
            heading="Social Media"
            info={{
              instagram: "@abimbola",
              twitter: "@abimbola",
              facebook: "@abimbola",
            }}
          />
        )}
        <ContactInfo
          heading="bank details"
          info={{
            "bank name": "---",
            "Bank Account No": "---",
            "Account Name": "---",
          }}
        />
        <ContactInfo
          heading="Contact Address"
          info={{
            "Company Address:": "U4, Joke Palza bodija ibadan.",
            state: "Oyo State",
            "Local Government": "Akinyele",
          }}
        />
      </div>
      {user_tag === "mobile" && (
        <InfoSection title="Services">
          <AutoResizingGrid minWidth={250}>
            {Array.from({ length: 6 }).map((_, index) => (
              <ServiceCard key={index} />
            ))}
          </AutoResizingGrid>
        </InfoSection>
      )}
    </div>
  );
};

export default ManageServiceProvider;
