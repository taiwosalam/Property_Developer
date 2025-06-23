import Input from "@/components/Form/Input/input";
import {
  FbIcon,
  IGIcon,
  InstagramIcon,
  LinkedInIcon,
  SendMessageIcon,
  SocialWebIcon,
  ThumbsUp,
  TikTokIcon,
  TwitterIcon,
  YouTubeIcon,
} from "@/public/icons/icons";
import { ThumbsDown } from "@/public/icons/icons";
import { CommentData } from "@/components/tasks/announcements/comment";
import ThreadSkeleton from "@/components/Community/threadskeleton";
import { CompanySummaryTypes } from "@/components/Community/types";
import dayjs from "dayjs";
import { calculateYearsInIndustry, formatPhoneNumbers } from "./data";
import { empty } from "@/app/config";

interface ThreadResponse {
  post: any;
  company_summary: any;
  contributor: any;
  comments: CommentData[];
}
interface Props {
  likeCount: number;
  dislikeCount: number;
  handleLike: () => void;
  handleDislike: () => void;
  userAction?: "like" | "dislike" | null;
  isLoading: boolean;
  user_liked?: boolean;
  commentCount: number;
  slug: string;
}

export const ThreadArticleSkeleton = () => {
  return (
    <div className="mt-4">
      {/* Content skeleton */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
      </div>

      {/* Comments and interactions skeleton */}
      <div className="flex justify-between mt-6">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />

        <div className="flex gap-2">
          {/* Like/Dislike buttons skeleton */}
          <div className="flex items-center gap-1">
            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-1">
            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>

          {/* User images skeleton */}
          <div className="flex">
            <div className="flex">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[23px] w-[23px] rounded-full bg-gray-200 dark:bg-gray-700 -mr-2 animate-pulse"
                />
              ))}
            </div>
            <div className="h-[23px] w-[48px] bg-gray-200 dark:bg-gray-700 rounded-r-[23px] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const CompanySummarySkeleton = () => {
  return (
    <div className="bg-white shadow-md dark:bg-darkText-primary p-4 rounded-lg animate-pulse">
      {/* Title skeleton */}
      <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />

      {/* Logo skeleton */}
      <div className="flex items-center justify-center w-full mt-4">
        <div className="w-[260px] h-[70px] bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>

      {/* Company name skeleton */}
      <div className="mt-3">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />

        {/* Services skeleton */}
        <div className="mt-3">
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        </div>

        {/* Contacts skeleton */}
        <div className="mt-4">
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Social icons skeleton */}
      <div className="flex gap-2 mt-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"
          />
        ))}
      </div>

      {/* Stats skeleton */}
      <div className="flex flex-col gap-2 mt-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex justify-between">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const RequestCardSkeleton = () => {
  return (
    <div
      className="bg-white dark:bg-darkText-primary rounded-[8px] py-[18px] space-y-[21px] animate-pulse"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      {/* Header section with avatar and name */}
      <div className="px-[18px] flex items-center justify-between">
        <div className="flex gap-2">
          {/* Avatar placeholder */}
          <div className="w-[50px] h-[50px] rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-2">
            {/* Name placeholder */}
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            {/* Date placeholder */}
            <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
        {/* Status placeholder */}
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>

      {/* Title bar */}
      <div className="py-2 px-[18px] flex items-center justify-between custom-secondary-bg">
        <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>

      {/* Details grid */}
      <div className="px-[18px] grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="space-y-1">
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>

      {/* Button section */}
      <div className="flex justify-end px-[18px]">
        <div className="h-9 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
};

export const TextSkeleton = () => {
  return (
    <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse inline-block" />
  );
};

export const Loader = ({ className }: { className?: string }) => (
  <div
    className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`}
  />
);

export const LikeDislikeButtons = ({
  likeCount,
  dislikeCount,
  handleLike,
  handleDislike,
  userAction,
  isLoading,
  user_liked,
}: Props) => (
  <div className="flex gap-2">
    <button
      className={`flex items-center gap-1 ${
        user_liked || userAction === "like" ? "text-blue-600" : ""
      }`}
      onClick={handleLike}
      // disabled={isLoading || user_liked}
      aria-label="Like"
      aria-pressed={user_liked || userAction === "like"}
    >
      <ThumbsUp />
      <p>{likeCount}</p>
    </button>
    <button
      className={`flex items-center gap-1 ${
        userAction === "dislike" ? "text-red-500" : ""
      }`}
      onClick={handleDislike}
      disabled={isLoading}
    >
      <ThumbsDown />
      <p>{dislikeCount}</p>
    </button>
  </div>
);

interface ThreadSkeletonLoaderProps {
  length: number;
}

export const ThreadSkeletonLoader = ({ length }: ThreadSkeletonLoaderProps) => {
  return (
    <>
      {Array.from({ length }).map((_, index) => (
        <ThreadSkeleton key={index} />
      ))}
    </>
  );
};

interface FormattedCompanySummary {
  logo: string;
  dark_logo: string;
  name: string;
  services: string[];
  address: string;
  email: string;
  phoneNumber: string;
  website: string | null;
  socialHandles: Array<{
    platform: string;
    link: string;
    icon: React.ReactNode;
  }>;
  stats: Array<{ label: string; value: string | number }>;
}



export const formatCompanySummary = (
  companySummary: CompanySummaryTypes
): FormattedCompanySummary => {
  const {
    addresses,
    company_logo,
    contact_details,
    details,
    email,
    name,
    services,
    social_handles,
    dark_logo,
  } = companySummary;

  // Format services: Flatten all service arrays into a single array
  const availableServices = Object.entries(services || {})
    .filter(
      ([key, value]) =>
        [
          "architect",
          "civil_engineer",
          "estate_surveyor_valuer",
          "hospitality",
          "land_surveyor",
          "legal_practitioner",
          "quantity_surveyor",
          "realtor",
          "town_planner",
        ].includes(key) &&
        Array.isArray(value) &&
        value.length > 0
    )
    .flatMap(([_, value]) => value) // Flatten the arrays of services
    .filter(Boolean); // Remove any falsy values

  // Format social handles (only include valid links)
  const socialHandles: Array<{
    platform: string;
    link: string;
    icon: React.ReactNode;
  }> = [
    {
      platform: "facebook",
      link: social_handles?.facebook || "",
      icon: <FbIcon />,
    },
    { platform: "x", link: social_handles?.x || "", icon: <TwitterIcon /> },
    {
      platform: "instagram",
      link: social_handles?.instagram || "",
      icon: <IGIcon />,
    },
    {
      platform: "linkedin",
      link: social_handles?.linkedin || "",
      icon: <LinkedInIcon />,
    },
    {
      platform: "tiktok",
      link: social_handles?.tiktok || "",
      icon: <TikTokIcon />,
    },
    {
      platform: "youtube",
      link: social_handles?.youtube || "",
      icon: <YouTubeIcon />,
    },
  ].filter(
    (item): item is { platform: string; link: string; icon: JSX.Element } =>
      item.link != null && item.link.trim() !== ""
  );

  // Format stats
  const companyStats = [
    {
      label: "Joined ourproperty.ng",
      value: details?.joined_date
        ? dayjs(details.joined_date).format("MMM YYYY")
        : "--- ---",
    },
    {
      label: "Years in Industry",
      value:
        calculateYearsInIndustry(details?.date_of_registration) ?? "--- ---",
    },
    { label: "Total Branch", value: details?.total_branches || 0 },
    { label: "Total Staff", value: details?.total_staff || 0 },
    {
      label: "Property for sale",
      value: details?.property_for_sale || 0,
    },
    {
      label: "Property for Rent",
      value: details?.property_for_rent || 0,
    },
    {
      label: "Hospitality Property",
      value: details?.hospitality_property || 0,
    },
    { label: "Total Unit Managing", value: details.total_unit_managing || 0 },
    { label: "Total Reviews", value: details.total_review || 0 },
    {
      label: "Completed Transaction",
      value: details?.completed_transaction || 0,
    },
  ];

  const address =
    `${addresses?.head_office_address}, ${addresses.local_government}, ${addresses.state}` ||
    "--- ---";

  return {
    logo: company_logo || empty,
    dark_logo: dark_logo || empty,
    name: name || "--- ---",
    services: availableServices,
    address: address,
    email: email || "--- ---",
    phoneNumber: formatPhoneNumbers(contact_details?.phone_numbers),
    website: social_handles?.website || null,
    socialHandles,
    stats: companyStats,
  };
};
