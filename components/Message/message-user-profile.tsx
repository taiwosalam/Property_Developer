import Image from "next/image";
import LandlordTenantModalPreset from "../Management/landlord-tenant-modal-preset";
import BadgeIcon, { tierColorMap } from "../BadgeIcon/badge-icon";
import { empty } from "@/app/config";
import { secondaryFont } from "@/utils/fonts";
import { useChatStore } from "@/store/message";
import { default_user_data, getCleanRoleName } from "./data";
import { truncateText } from "../tasks/vehicles-record/data";
import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { UserDetails, UserDetailsResponse } from "./types";
import NetworkError from "../Error/NetworkError";
import MessageUserProfileSkeleton from "../Skeleton/profile-skeleton";
import ServerError from "../Error/ServerError";
import { capitalizeWords } from "@/hooks/capitalize-words";

const MessageUserProfileModal = ({ id }: { id: number }) => {
  const {
    data: userProfile,
    error,
    loading,
    isNetworkError,
  } = useFetch<UserDetailsResponse>(`/all-users?identifier=${id}`);
  const userProfileData = userProfile?.data ?? null;

  const role = getCleanRoleName(userProfileData);
  const isAcct = role === "director" || role === "manager" || role === "staff";
  const showActBadge = isAcct && userProfileData?.tier_id === 2;

  const badgeColor =
    tierColorMap[userProfileData?.tier_id as keyof typeof tierColorMap] ||
    "gray";

  if (loading) return <MessageUserProfileSkeleton />;
  if (isNetworkError) {
    return <NetworkError />;
  }
  if (error) return <ServerError error={error} />;

  const fullname = capitalizeWords(userProfileData?.name ?? "") ?? "";
  return (
    <LandlordTenantModalPreset
      style={{ maxWidth: "614px" }}
      heading="Profile Details"
    >
      <div className="flex gap-1 items-center justify-center gap-4">
        <div className="imwrapper h-[100px] w-[100px]">
          <Image
            src={userProfileData?.profile?.picture ?? empty}
            alt="user profile"
            width={100}
            height={100}
            className="rounded-full w-full h-full object-cover rounded-full custom-secondary-bg"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center">
            <p className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize">
              {userProfileData?.profile?.title} {" "}
              {truncateText(fullname ?? "", 40)}
            </p>
            {showActBadge ? (
              <BadgeIcon color="gray" />
            ) : !isAcct ? (
              <BadgeIcon color={badgeColor} />
            ) : null}
          </div>
          <div className="custom-flex-col">
            <p
              className={`${secondaryFont.className} text-sm font-normal dark:text-white text-[#151515B3]`}
            >
              {userProfileData?.email ?? default_user_data.email}
            </p>
            <p
              className={`${secondaryFont.className} text-sm font-normal text-[#151515B2] dark:text-[#FFFFFFB2]`}
            >
              {userProfileData?.phone ?? default_user_data.phone}
            </p>
          </div>
        </div>
      </div>

      {/* CONTACT */}
      <div className="custom-flex-col gap-2 mt-5">
        <p className="text-black dark:text-white text-lg font-bold capitalize">
          Contact
        </p>
        <div className="custom-flex-col gap-3">
          <div className="flex">
            <p className="w-1/3 text-text-neutral dark:text-white text-sm font-normal capitalize">
              Adress
            </p>
            <p className="w-2/3 text-black dark:text-white text-md font-semibold capitalize">
              {userProfileData?.profile?.address ?? default_user_data.address}
            </p>
          </div>
          <div className="flex">
            <p className="w-1/3 text-text-neutral dark:text-white text-sm font-normal capitalize">
              City
            </p>
            <p className="w-2/3 text-black dark:text-white text-md font-semibold capitalize">
              {userProfileData?.profile?.city ?? default_user_data.city}
            </p>
          </div>
          <div className="flex">
            <p className="w-1/3 text-text-neutral dark:text-white text-sm font-normal capitalize">
              State
            </p>
            <p className="w-2/3 text-black dark:text-white text-md font-semibold capitalize">
              {userProfileData?.profile?.state ?? default_user_data.state}
            </p>
          </div>
          <div className="flex">
            <p className="w-1/3 text-text-neutral dark:text-white text-sm font-normal capitalize">
              L.G
            </p>
            <p className="w-2/3 text-black dark:text-white text-md font-semibold capitalize">
              {userProfileData?.profile?.lga ?? default_user_data.lga}
            </p>
          </div>
        </div>
      </div>
    </LandlordTenantModalPreset>
  );
};

export default MessageUserProfileModal;
