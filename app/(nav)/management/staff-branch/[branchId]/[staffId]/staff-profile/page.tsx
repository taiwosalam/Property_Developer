"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

// Images
import { ChevronRight } from "lucide-react";
import { LocationIcon } from "@/public/icons/icons";

import Avatar from "@/public/empty/avatar-1.svg";

// imports
import Picture from "@/components/Picture/picture";
import BackButton from "@/components/BackButton/back-button";
import { BranchManagerTag } from "@/components/Tags/BranchManagerTag";
import {
  LandlordTenantInfo,
  LandlordTenantInfoBox,
} from "@/components/Management/landlord-tenant-info-components";

import { secondaryFont } from "@/utils/fonts";
import Button from "@/components/Form/Button/button";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import StaffProfilePortfolio from "@/components/Management/Staff-And-Branches/Branch/StaffProfile/staff-profile-portfolio";
import {
  activitiesTableData,
  placeholder_portfolio_data,
  staffActivitiesTableFields,
} from "./data";
import CustomTable from "@/components/Table/table";
import StaffChat from "@/components/Management/Staff-And-Branches/Branch/StaffProfile/staff-chat";

const StaffProfile = () => {
  const { branchId, staffId } = useParams();

  return (
    <div className="custom-flex-col gap-10">
      <div className="custom-flex-col gap-6">
        <div className="custom-flex-col gap-2">
          <BackButton bold>Moniya Branch</BackButton>
          <div className="flex">
            <div className="w-10"></div>
            <div className="flex items-center gap-1 text-text-disabled">
              <LocationIcon />
              <p className="text-sm font-normal">
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
                <div className="space-y-4">
                  <div>
                    <span className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize">
                      Barrister Abimbola Adedeji
                      <BadgeIcon color="blue" />
                    </span>
                    <p
                      className={`${secondaryFont.className} text-sm font-normal text-[#151515B2] dark:text-darkText-2`}
                    >
                      Legal Practitioner
                    </p>
                  </div>
                  <div className="space-y-2">
                    <BranchManagerTag />
                    <p className="text-neutral-800 dark:text-darkText-2 text-base font-medium">
                      ID: 22132876554444
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    href={`/management/staff-branch/${branchId}/${staffId}/staff-profile/edit`}
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
              <h3 className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize">
                About Barrister Abimbola Adedeji
              </h3>
              <div className="w-full border border-dashed border-brand-9 opacity-40" />
              <p className="text-text-quaternary dark:text-darkText-2 text-sm font-normal">
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
        <div className="flex justify-between">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white">
            Barrister Abimbola Adedeji Activities
          </h2>
          <Link href={""} className="flex items-center gap-1">
            <p>See all</p>
            <ChevronRight size={16} color="#5A5D61" />
          </Link>
        </div>
        <CustomTable
          data={activitiesTableData}
          fields={staffActivitiesTableFields}
        />
      </div>
      <div className="custom-flex-col gap-[18px]">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white">
          Barrister Abimbola Adedeji Chat
        </h2>
        <StaffChat />
      </div>
      <div className="custom-flex-col gap-[18px]">
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white">
          Barrister Abimbola Adedeji Portfolios
        </h1>
        <div className="custom-flex-col gap-8">
          {placeholder_portfolio_data.map(({ title, items }, index) => (
            <StaffProfilePortfolio key={index} title={title} items={items} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
