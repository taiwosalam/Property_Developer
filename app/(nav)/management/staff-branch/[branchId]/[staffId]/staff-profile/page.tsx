"use client";

import React from "react";
import { useParams } from "next/navigation";

// Images
import LocationIcon from "@/public/icons/location.svg";

import Avatar from "@/public/empty/avatar-1.svg";

// imports
import Picture from "@/components/Picture/picture";
import BackButton from "@/components/BackButton/back-button";

import {
  LandlordTenantInfo,
  LandlordTenantInfoBox,
  LandlordTenantUserTag,
} from "@/components/Management/landlord-tenant-info-components";

import { secondaryFont } from "@/utils/fonts";
import Button from "@/components/Form/Button/button";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";

const StaffProfile = () => {
  const { branchId, staffId } = useParams();

  return (
    <div className="custom-flex-col gap-10">
      <div className="custom-flex-col gap-6">
        <div className="custom-flex-col gap-2">
          <BackButton>Moniya Branch</BackButton>
          <div className="flex">
            <div className="w-10"></div>
            <div className="flex items-center gap-1">
              <Picture
                src={LocationIcon}
                alt="location"
                width={12}
                height={16}
              />
              <p className="text-text-disabled text-xs font-normal">
                Street 23, All Avenue, Nigeria
              </p>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-y-5 gap-x-8">
          <LandlordTenantInfoBox style={{ padding: "24px 40px" }}>
            <div className="flex flex-col xl:flex-row gap-5">
              <div className="flex items-start">
                <Picture
                  src={Avatar}
                  alt="profile picture"
                  size={120}
                  rounded
                />
              </div>
              <div className="custom-flex-col gap-2">
                <div className="custom-flex-col gap-4">
                  <div className="custom-flex-col">
                    <div className="flex items-center gap-2">
                      <p className="text-black text-xl font-bold capitalize">
                        Barrister Abimbola Adedeji
                      </p>
                      <BadgeIcon color="blue" />
                    </div>
                    <p
                      style={{ color: "rgba(21, 21, 21, 0.70)" }}
                      className={`${secondaryFont.className} text-sm font-normal`}
                    >
                      Legal Practitioner
                    </p>
                  </div>
                  <div className="custom-flex-col gap-2">
                    <div className="flex">
                      <LandlordTenantUserTag type="branch manager" />
                    </div>
                    <p className="text-neutral-800 text-base font-medium">
                      ID: 22132876554444
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    href={`/management/staff-branch/${branchId}/${staffId}/staff-profile`}
                    size="base_medium"
                    className="py-2 px-8"
                  >
                    edit
                  </Button>
                  <Button size="base_medium" className="py-2 px-8">
                    message
                  </Button>
                </div>
              </div>
            </div>
          </LandlordTenantInfoBox>
          <LandlordTenantInfo
            info={{
              gender: "Male",
              email: "BarristerBarrister@gmail.com",
              phone: "+2348132086958",
              "personal title": "Barrister",
              "real estate title": "Legal Practitioner",
            }}
          />
          <LandlordTenantInfoBox>
            <div className="custom-flex-col gap-4">
              <p className="text-black text-xl font-bold capitalize">
                About Barrister Abimbola Adedeji
              </p>
              <div className="w-full border border-dashed border-brand-9 opacity-40"></div>
              <p className="text-text-quaternary text-sm font-normal">
                A multi-family home, also know as a duplex, triplex, or
                multi-unit building, is a residential property that living read
                more. They want to work with their budget in booking an
                appointment. They wants to ease themselves of the stress of
                having to que, and also reduce the time spent searching for
                something new. They wants to ease themselves of the stress of
                having to que, and also reduce the time spent searching for
                something new.
              </p>
            </div>
          </LandlordTenantInfoBox>
          <LandlordTenantInfo
            separator
            heading="Information"
            info={{
              branch: "moniya branch",
              password: "Jumpper23",
              "date created": "23/07/2023",
              status: "active",
            }}
          />
        </div>
      </div>
      <div className="custom-flex-col gap-[18px]">
        
      </div>
    </div>
  );
};

export default StaffProfile;
