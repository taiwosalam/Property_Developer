"use client";

import clsx from "clsx";
import { useState } from "react";
import { secondaryFont } from "@/utils/fonts";
import {
  LandlordTenantInfoBox as InfoBox,
  LandlordTenantInfo as ContactInfo,
  LandlordTenantInfoSection as InfoSection,
  LandlordTenantInfoDocument as InfoDocument,
} from "@/components/Management/landlord-tenant-info-components";
import TruncatedText from "@/components/TruncatedText/truncated-text";
import Picture from "@/components/Picture/picture";
import DefaultLandlordAvatar from "@/public/empty/landlord-avatar.png";
import Button from "@/components/Form/Button/button";
import UserTag from "@/components/Tags/user-tag";
import SampleLogo from "@/public/empty/SampleLogo.jpeg";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import {
  ChevronLeft,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "@/public/icons/icons";
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
      user_tag: Math.random() < 0.5 ? "web" : "mobile", // Randomly select "web" or "mobile for preview"
    });
  if (!serviceProviderData) return null;
  const { user_tag } = serviceProviderData;

  return (
    <div className="space-y-5">
      <div className="grid lg:grid-cols-2 gap-y-5 gap-x-8">
        <InfoBox
          style={{ padding: "24px 40px" }}
          className="relative flex flex-col xl:flex-row gap-5"
        >
          <button
            type="button"
            aria-label="back"
            className="absolute top-3 left-3"
            onClick={() => router.back()}
          >
            <ChevronLeft />
          </button>

          <Picture
            src={DefaultLandlordAvatar}
            alt="profile picture"
            size={120}
            rounded
          />
          <div className="custom-flex-col gap-4 xl:flex-1">
            <div className="custom-flex-col gap-4">
              <div className="custom-flex-col">
                <p className="text-black text-lg lg:text-xl font-bold capitalize">
                  Abimbola Adedeji
                </p>
                <p
                  style={{ color: "rgba(21, 21, 21, 0.70)" }}
                  className={`${secondaryFont.className} text-sm font-normal`}
                >
                  abimbola@gmail.com
                </p>
              </div>
              <UserTag type={user_tag} />
            </div>
            {user_tag === "mobile" ? (
              <div className="custom-flex-col gap-2">
                <div className="custom-flex-col gap-1">
                  <p className="text-base font-normal">
                    Wallet ID: 22132876554444
                  </p>
                  <p className="text-base font-normal">Phone NO: 08132086958</p>
                </div>
                <Button size="base_medium" className="!w-fit ml-auto py-2 px-8">
                  message
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                <Button size="base_medium" className="py-2 px-8">
                  Manage
                </Button>
                <Button size="base_medium" className="py-2 px-8">
                  update with ID
                </Button>
              </div>
            )}
          </div>
        </InfoBox>

        {user_tag === "web" ? (
          <ContactInfo
            containerClassName="flex flex-col justify-center rounded-lg"
            info={{
              "Company Name": "Abmbola Services",
              "Full name": "Abimbola Adedeji",
              email: "abimbolaadedeji@gmail.com",
              "Company Phone": "+2348132086958 ; +2348132086958",
              services: "Painter",
            }}
          />
        ) : (
          <InfoBox className="space-y-6 rounded-lg">
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
            containerClassName="rounded-lg"
            heading="Social Media"
            info={{
              instagram: "@abimbola",
              twitter: "@abimbola",
              facebook: "@abimbola",
            }}
          />
        )}
        <ContactInfo
          containerClassName="rounded-lg"
          heading="bank details"
          info={{
            "bank name": "---",
            "Bank Account No": "---",
            "Account Name": "---",
          }}
        />
        <ContactInfo
          containerClassName="rounded-lg"
          heading="Contact Address"
          info={{
            "Company Address:": "U4, Joke Palza bodija ibadan.",
            state: "Oyo State",
            "Local Government": "Akinyele",
          }}
        />
        {user_tag === "web" && (
          <InfoBox className="rounded-lg">
            <div className="custom-flex-col gap-4">
              <div className="flex justify-between gap-4">
                <h3 className="text-black text-lg lg:text-xl font-bold capitalize flex items-end gap-1">
                  <span>Note</span>
                  <sub className="text-sm font-normal bottom-[unset]">
                    22/12/2022
                  </sub>
                </h3>
                <div className="flex gap-3 text-text-tertiary">
                  <button type="button" aria-label="Previous">
                    <ArrowLeftIcon />
                  </button>
                  <button type="button" aria-label="Next">
                    <ArrowRightIcon />
                  </button>
                </div>
              </div>
              <TruncatedText
                lines={7}
                className="text-text-quaternary text-sm lg:text-base font-normal"
              >
                building, is a residential property that living read more. They
                want to work with their budget in booking an appointment. They
                wants to ease themselves the stress having to que, and also
                reducety that living read more. They want to work with their
                budget in booking an appointment. They wants to ease themselves
                the stress having to que, and stress having to que, and stress
                having to que, and stress having to que, and stress having to
                que, and stress havingalso reduce the read more They wants to
                ease themselves of the stress of having to que, and also reduce
                the time spent searching for something new.for something new. A
                multi-family home, also know as a duplex, triplex, or multi-unit
                building, is a residential property that living read more. They
                want to work with their budget in booking an appointment. ime
                spent searching
              </TruncatedText>
            </div>
          </InfoBox>
        )}
      </div>
      {user_tag === "mobile" ? (
        <InfoSection title="Services">
          <AutoResizingGrid minWidth={250}>
            {Array.from({ length: 6 }).map((_, index) => (
              <ServiceCard key={index} />
            ))}
          </AutoResizingGrid>
        </InfoSection>
      ) : (
        <InfoSection title="Documents">
          <div className="flex flex-wrap gap-4">
            {Array(2)
              .fill(null)
              .map((_, idx) => (
                <InfoDocument key={idx} />
              ))}
          </div>
        </InfoSection>
      )}
    </div>
  );
};

export default ManageServiceProvider;
