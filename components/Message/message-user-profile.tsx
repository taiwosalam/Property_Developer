// import Image from "next/image";
// import LandlordTenantModalPreset from "../Management/landlord-tenant-modal-preset";
// import BadgeIcon, { tierColorMap } from "../BadgeIcon/badge-icon";
// import { empty } from "@/app/config";
// import { secondaryFont } from "@/utils/fonts";
// import { useChatStore } from "@/store/message";
// import { default_user_data, getCleanRoleName } from "./data";
// import { truncateText } from "../tasks/vehicles-record/data";
// import useFetch from "@/hooks/useFetch";
// import { useEffect, useState } from "react";
// import { UserDetails, UserDetailsResponse } from "./types";
// import NetworkError from "../Error/NetworkError";
// import MessageUserProfileSkeleton from "../Skeleton/profile-skeleton";
// import ServerError from "../Error/ServerError";
// import { capitalizeWords } from "@/hooks/capitalize-words";
// import { useGlobalStore } from "@/store/general-store";

// const MessageUserProfileModal = ({ id }: { id: number }) => {
//   const {
//     data: userProfile,
//     error,
//     loading,
//     isNetworkError,
//   } = useFetch<UserDetailsResponse>(`/all-users?identifier=${id}`);

//   const isGroupChat = useGlobalStore((s) => s.isGroupChat);
//   const userProfileData = userProfile?.data ?? null;

//   const role = getCleanRoleName(userProfileData);
//   const isAcct = role === "director" || role === "manager" || role === "staff";
//   const showActBadge = isAcct && userProfileData?.tier_id === 2;

//   const badgeColor =
//     tierColorMap[userProfileData?.tier_id as keyof typeof tierColorMap] ||
//     "gray";

//   if (loading) return <MessageUserProfileSkeleton />;
//   if (isNetworkError) {
//     return <NetworkError />;
//   }
//   if(error) return <div className="text-red-500"> { error } </div>
//   // if (error) return <ServerError error={error} />;

//   const fullname = capitalizeWords(userProfileData?.name ?? "") ?? "";
//   return (
//     <LandlordTenantModalPreset
//       style={{ maxWidth: "614px" }}
//       heading="Profile Details"
//     >
//       <div className="flex gap-1 items-center justify-center gap-4">
//         <div className="imwrapper h-[100px] w-[100px]">
//           <Image
//             src={userProfileData?.profile?.picture ?? empty}
//             alt="user profile"
//             width={100}
//             height={100}
//             className="rounded-full w-full h-full object-cover rounded-full custom-secondary-bg"
//           />
//         </div>
//         <div className="flex flex-col">
//           <div className="flex items-center">
//             <p className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize">
//               {userProfileData?.profile?.title} {" "}
//               {truncateText(fullname ?? "", 40)}
//             </p>
//             {showActBadge ? (
//               <BadgeIcon color="gray" />
//             ) : !isAcct ? (
//               <BadgeIcon color={badgeColor} />
//             ) : null}
//           </div>
//           <div className="custom-flex-col">
//             <p
//               className={`${secondaryFont.className} text-sm font-normal dark:text-white text-[#151515B3]`}
//             >
//               {userProfileData?.email ?? default_user_data.email}
//             </p>
//             <p
//               className={`${secondaryFont.className} text-sm font-normal text-[#151515B2] dark:text-[#FFFFFFB2]`}
//             >
//               {userProfileData?.phone ?? default_user_data.phone}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* CONTACT */}
//       <div className="custom-flex-col gap-2 mt-5">
//         <p className="text-black dark:text-white text-lg font-bold capitalize">
//           Contact
//         </p>
//         <div className="custom-flex-col gap-3">
//           <div className="flex">
//             <p className="w-1/3 text-text-neutral dark:text-white text-sm font-normal capitalize">
//               Adress
//             </p>
//             <p className="w-2/3 text-black dark:text-white text-md font-semibold capitalize">
//               {userProfileData?.profile?.address ?? default_user_data.address}
//             </p>
//           </div>
//           <div className="flex">
//             <p className="w-1/3 text-text-neutral dark:text-white text-sm font-normal capitalize">
//               City
//             </p>
//             <p className="w-2/3 text-black dark:text-white text-md font-semibold capitalize">
//               {userProfileData?.profile?.city ?? default_user_data.city}
//             </p>
//           </div>
//           <div className="flex">
//             <p className="w-1/3 text-text-neutral dark:text-white text-sm font-normal capitalize">
//               State
//             </p>
//             <p className="w-2/3 text-black dark:text-white text-md font-semibold capitalize">
//               {userProfileData?.profile?.state ?? default_user_data.state}
//             </p>
//           </div>
//           <div className="flex">
//             <p className="w-1/3 text-text-neutral dark:text-white text-sm font-normal capitalize">
//               L.G
//             </p>
//             <p className="w-2/3 text-black dark:text-white text-md font-semibold capitalize">
//               {userProfileData?.profile?.lga ?? default_user_data.lga}
//             </p>
//           </div>
//         </div>
//       </div>
//     </LandlordTenantModalPreset>
//   );
// };

// export default MessageUserProfileModal;

"use client";

import Image from "next/image";
import { empty } from "@/app/config";
import { secondaryFont } from "@/utils/fonts";
import { useGlobalStore } from "@/store/general-store";
import useFetch from "@/hooks/useFetch";
import { useEffect, useMemo } from "react";
import { transformTeamDetails } from "@/app/(nav)/community/team-chat/[id]/data";
import { UserDetailsResponse } from "@/components/Message/types";
import { GroupChatDetailsResponse } from "@/app/(nav)/community/team-chat/[id]/types";
import { default_user_data, getCleanRoleName } from "@/components/Message/data";
import BadgeIcon, { tierColorMap } from "@/components/BadgeIcon/badge-icon";
import { capitalizeWords } from "@/hooks/capitalize-words";
import MessageUserProfileSkeleton from "@/components/Skeleton/profile-skeleton";
import NetworkError from "@/components/Error/NetworkError";
import LandlordTenantModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import { truncateText } from "@/components/tasks/vehicles-record/data";
import GroupDetails from "./message-group-details";

// --- Types ---
interface MessageUserProfileModalProps {
  id: number;
}

const MessageUserProfileModal: React.FC<MessageUserProfileModalProps> = ({
  id,
}) => {
  const isGroupChat = useGlobalStore((s) => s.isGroupChat);

  // Fetch user or group data
  const fetchUrl = isGroupChat
    ? `/group-chats/${id}`
    : `/all-users?identifier=${id}`;

  const {
    data: apiData,
    error,
    loading,
    isNetworkError,
  } = useFetch<UserDetailsResponse | GroupChatDetailsResponse>(fetchUrl);

  // Derived data for rendering
  const {
    profileData,
    groupAbout,
    groupMembers,
    badgeColor,
    showActBadge,
    isAcct,
    fullname,
  } = useMemo(() => {
    if (isGroupChat && apiData && "group_chat" in apiData) {
      const team = transformTeamDetails(apiData as GroupChatDetailsResponse);
      return {
        profileData: null,
        groupAbout: team.about,
        groupMembers: team.group_members,
        badgeColor: "brand",
        showActBadge: false,
        isAcct: false,
        fullname: team.about.group_name,
      };
    } else if (!isGroupChat && apiData && "data" in apiData) {
      const userProfileData = apiData.data;
      const role = getCleanRoleName(userProfileData);
      const isAcct = ["director", "manager", "staff"].includes(role);
      const showActBadge = isAcct && userProfileData?.tier_id === 2;
      const badgeColor =
        tierColorMap[userProfileData?.tier_id as keyof typeof tierColorMap] ||
        "gray";
      const fullname = capitalizeWords(userProfileData?.name ?? "") ?? "";
      return {
        profileData: userProfileData,
        groupAbout: null,
        groupMembers: [],
        badgeColor,
        showActBadge,
        isAcct,
        fullname,
      };
    }
    return {
      profileData: null,
      groupAbout: null,
      groupMembers: [],
      badgeColor: "gray",
      showActBadge: false,
      isAcct: false,
      fullname: "",
    };
  }, [apiData, isGroupChat]);

  // --- Render guards ---
  if (loading) return <MessageUserProfileSkeleton />;
  if (isNetworkError) return <div className="text-red-500"> Network Error </div>
  if (error) return <div className="text-red-500">{error}</div>;

  // --- Render ---
  return (
    <LandlordTenantModalPreset
      style={{ maxWidth: "614px" }}
      heading={isGroupChat ? "Group Details" : "Profile Details"}
    >
      {/* Group Chat About Section */}
      {isGroupChat && groupAbout && <GroupDetails about={groupAbout} />}

      {/* Individual User Profile Section */}
      {!isGroupChat && profileData && (
        <div className="flex gap-1 items-center justify-center gap-4">
          <div className="imwrapper h-[100px] w-[100px]">
            <Image
              src={profileData?.profile?.picture ?? empty}
              alt="user profile"
              width={100}
              height={100}
              className="rounded-full w-full h-full object-cover rounded-full custom-secondary-bg"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <p className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize">
                {profileData?.profile?.title} {truncateText(fullname ?? "", 40)}
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
                {profileData?.email ?? default_user_data.email}
              </p>
              <p
                className={`${secondaryFont.className} text-sm font-normal text-[#151515B2] dark:text-[#FFFFFFB2]`}
              >
                {profileData?.phone ?? default_user_data.phone}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT (For User Only) */}
      {!isGroupChat && profileData && (
        <div className="custom-flex-col gap-2 mt-5">
          <p className="text-black dark:text-white text-lg font-bold capitalize">
            Contact
          </p>
          <div className="custom-flex-col gap-3">
            <div className="flex">
              <p className="w-1/3 text-text-neutral dark:text-white text-sm font-normal capitalize">
                Address
              </p>
              <p className="w-2/3 text-black dark:text-white text-md font-semibold capitalize">
                {profileData?.profile?.address ?? default_user_data.address}
              </p>
            </div>
            <div className="flex">
              <p className="w-1/3 text-text-neutral dark:text-white text-sm font-normal capitalize">
                City
              </p>
              <p className="w-2/3 text-black dark:text-white text-md font-semibold capitalize">
                {profileData?.profile?.city ?? default_user_data.city}
              </p>
            </div>
            <div className="flex">
              <p className="w-1/3 text-text-neutral dark:text-white text-sm font-normal capitalize">
                State
              </p>
              <p className="w-2/3 text-black dark:text-white text-md font-semibold capitalize">
                {profileData?.profile?.state ?? default_user_data.state}
              </p>
            </div>
            <div className="flex">
              <p className="w-1/3 text-text-neutral dark:text-white text-sm font-normal capitalize">
                L.G
              </p>
              <p className="w-2/3 text-black dark:text-white text-md font-semibold capitalize">
                {profileData?.profile?.lga ?? default_user_data.lga}
              </p>
            </div>
          </div>
        </div>
      )}
    </LandlordTenantModalPreset>
  );
};

export default MessageUserProfileModal;
