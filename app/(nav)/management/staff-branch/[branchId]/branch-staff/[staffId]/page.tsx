"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

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
  getPortfolioData,
  initialPageData,
  placeholder_portfolio_data,
  staffActivitiesTableFields,
  transformStaffAPIResponse,
} from "./data";
import CustomTable from "@/components/Table/table";
import StaffChat from "@/components/Management/Staff-And-Branches/Branch/StaffProfile/staff-chat";
import useBranchStore from "@/store/branch-store";
import useFetch from "@/hooks/useFetch";
import NetworkError from "@/components/Error/NetworkError";
import { StaffPageTypes, StaffAPIResponse } from "./type";
import { empty } from "@/app/config";
import dayjs from "dayjs";
import CustomLoader from "@/components/Loader/CustomLoader";
import useAddressFromCoords from "@/hooks/useGeoCoding";
import DOMPurify from "dompurify";
import TruncatedText from "@/components/TruncatedText/truncated-text";
import ServerError from "@/components/Error/ServerError";
import { useGlobalStore } from "@/store/general-store";
import { toast } from "sonner";

const StaffProfile = () => {
  const { branchId, staffId } = useParams();
  const router = useRouter();
  const { branch, setBranch } = useBranchStore();
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [pageData, setPageData] = useState<StaffPageTypes>(initialPageData);
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);

  const {
    address,
    loading: addressLoading,
    error: addressError,
  } = useAddressFromCoords(lat, lng);

  const { staff, activities, chats, portfolio, messageUserData, staffChats } =
    pageData;

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
  } = useFetch<StaffAPIResponse>(`/staff/${staffId}`);

  useEffect(() => {
    if (apiData) {
      setPageData((x) => ({
        ...x,
        ...transformStaffAPIResponse(apiData),
      }));
    }
  }, [apiData]);

  const portfolioData = getPortfolioData(portfolio);

  useEffect(() => {
    if (pageData) {
      const newMessageUserData = messageUserData;
      const newStaffChatData = staffChats;
      const currentMessageUserData = useGlobalStore.getState()?.messageUserData;
      const currentStaffChatData = useGlobalStore.getState()?.staffChats;

      if (
        JSON.stringify(currentMessageUserData) !==
        JSON.stringify(newMessageUserData)
      ) {
        setGlobalStore("messageUserData", newMessageUserData);
      }

      if (
        JSON.stringify(currentStaffChatData) !==
        JSON.stringify(newStaffChatData)
      ) {
        setGlobalStore("staffChats", newStaffChatData);
      }
    }
  }, [setGlobalStore, pageData]);

  const goToMessage = () => {
    if (!staff.user_id) return toast.warning("Staff User ID not Found!");
    router.push(`/messages/${staff?.user_id}`);
  };

  // console.log("pageData", pageData);

  useEffect(() => {
    if (activities) {
      activities.forEach((activity) => {
        const { location } = activity;
        const { latitude, longitude } = location;
        if (latitude && longitude) {
          setLat(parseFloat(`${latitude}`));
          setLng(parseFloat(`${longitude}`));
        }
      });
    }
  }, [activities]);

  const sanitizedHTML = DOMPurify.sanitize(staff?.about_staff?.note || "");

  // console.log("staff data -", staff);

  if (loading) return <CustomLoader layout="profile" />;
  if (isNetworkError) return <NetworkError />;

  if (error) return <ServerError error={error} />;

  return (
    <div className="custom-flex-col gap-10">
      <div className="custom-flex-col gap-4">
        <div className="custom-flex-col">
          <BackButton bold> {branch.branch_name} </BackButton>
          <div className="flex">
            <div className="w-10"></div>
            <div className="flex items-center gap-1 text-text-disabled mb-2">
              <LocationIcon />
              <p className="text-sm font-normal">{branch.address}</p>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-y-5 gap-x-8">
          <LandlordTenantInfoBox style={{ padding: "24px 40px" }}>
            <div className="flex flex-col xl:flex-row gap-5">
              <div className="flex items-start">
                <Picture
                  src={staff.picture || empty}
                  alt="profile picture"
                  status={staff.online}
                  size={120}
                  rounded
                  containerClassName="custom-secondary-bg rounded-full"
                />
              </div>
              <div className="custom-flex-col gap-2">
                <div className="space-y-4">
                  <div>
                    <div className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize flex items-center">
                      {staff?.title || ""} {staff?.name}
                      {staff.badge_color && (
                        <BadgeIcon color={staff.badge_color} />
                      )}
                    </div>
                    <p
                      className={`${secondaryFont.className} text-sm font-normal text-[#151515B2] dark:text-darkText-2`}
                    >
                      {staff?.real_estate_title}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <BranchManagerTag role={staff?.position} />
                    <p className="text-neutral-800 dark:text-darkText-2 text-base font-medium">
                      ID: {staff?.id}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    href={`/management/staff-branch/${branchId}/branch-staff/${staffId}/edit`}
                    size="base_medium"
                    className="py-2 px-8"
                  >
                    edit
                  </Button>
                  <Button
                    // href={`/messages/${staff.user_id}`}
                    onClick={goToMessage}
                    size="base_medium"
                    className="py-2 px-8"
                  >
                    message
                  </Button>
                </div>
              </div>
            </div>
          </LandlordTenantInfoBox>
          <LandlordTenantInfo
            info={{
              gender: staff?.gender,
              email: staff?.email,
              phone: staff?.phone,
              "personal title": staff?.title,
              "real estate title": staff?.real_estate_title,
              "years of experience": `${staff?.experience} Years+`,
            }}
          />
          <LandlordTenantInfoBox>
            <div className="custom-flex-col gap-4">
              <h3 className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize">
                About {`${staff?.title} ${staff?.name}`}
              </h3>
              <div className="w-full border border-dashed border-brand-9 opacity-40" />
              <TruncatedText as="div" lines={6}>
                <div
                  className="text-text-quaternary dark:text-darkText-2 text-sm font-normal"
                  dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
                />
              </TruncatedText>
            </div>
          </LandlordTenantInfoBox>
          <LandlordTenantInfo
            separator
            heading="Information"
            info={{
              branch: branch.branch_name,
              "date created": dayjs(staff.created_at).format("MMM DD, YYYY"),
              "last updated": dayjs(staff.updated_at).format("MMM DD, YYYY"),
              status: staff.status,
            }}
          />
        </div>
      </div>
      <div className="custom-flex-col gap-[18px]">
        <div className="flex justify-between">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white">
            {`${staff?.title} ${staff?.name} Activities`}
          </h2>
          {activities.length > 0 && (
            <Link
              href={`/management/staff-branch/${branchId}/branch-staff/${staffId}/activities`}
              className="flex items-center gap-1"
            >
              <p>See all</p>
              <ChevronRight size={16} color="#5A5D61" />
            </Link>
          )}
        </div>
        {activities.length === 0 ? (
          <p className="text-base text-text-disabled font-medium flex w-full items-center justify-center">
            No activities yet
          </p>
        ) : (
          <CustomTable
            data={activities.map((activity) => ({
              ...activity,
              location: address?.formattedAddress
                ? address?.formattedAddress
                : "Location not available", // Safely handle location
            }))}
            fields={staffActivitiesTableFields}
          />
        )}
      </div>
      <div className="custom-flex-col gap-[18px]">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white">
          {`${staff?.title} ${staff?.name}`} Chat
        </h2>
        <StaffChat />
      </div>
      <div className="custom-flex-col gap-[18px]">
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white">
          {`${staff?.title} ${staff?.name}`} Portfolios
        </h1>
        <div className="custom-flex-col gap-8">
          {portfolioData.map(({ title, items }, index) => (
            <StaffProfilePortfolio key={index} title={title} items={items} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
