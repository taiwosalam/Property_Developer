"use client";

import { useRouter, useParams } from "next/navigation";
import { ChevronLeft } from "@/public/icons/icons";
import Button from "@/components/Form/Button/button";
import AnnouncementPost from "@/components/tasks/announcements/announcement-post";
import AttachedImagesGrid from "@/components/tasks/complainid/Attached-images-grid";
import { LandlordTenantInfo as AnnouncementInfo } from "@/components/Management/landlord-tenant-info-components";
import ReadBy from "@/components/tasks/announcements/read-by";
import useFetch from "@/hooks/useFetch";
import ServerError from "@/components/Error/ServerError";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import NetworkError from "@/components/Error/NetworkError";
import {
  AnnouncementDetailsResponse,
  AnnouncementResponseDetails,
} from "../../types";
import { useEffect, useState } from "react";
import {
  AnnouncementDetailsPageData,
  transformAnnouncementDetailsData,
} from "./data";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import dayjs from "dayjs";
import AnnouncementSkeleton from "@/components/Loader/announcement-preview";
import { useRole } from "@/hooks/roleContext";
import { usePermission } from "@/hooks/getPermission";

const PreviewAnnouncement = () => {
  const router = useRouter();
  const { announcementId } = useParams();
  const { role } = useRole();
  // PERMISSIONS
  const canCreateAndManageAnnouncements = usePermission(
    role,
   "Can create and manage announcement"
  );
  const [pageData, setPageData] = useState<AnnouncementDetailsPageData | null>(
    null
  );

  const {
    data: apiData,
    loading,
    silentLoading,
    error,
    isNetworkError,
    refetch,
  } = useFetch<AnnouncementResponseDetails>(`announcements/${announcementId}`);

  useRefetchOnEvent("announcementDispatch", () => refetch({ silent: true }));

  useEffect(() => {
    if (apiData) {
      const transformData = transformAnnouncementDetailsData(apiData);
      setPageData(transformData);
    }
  }, [apiData]);

  // Show skeleton if loading or silentLoading is true, or if delay hasn't completed
  if (loading && !error && !isNetworkError) {
    return <AnnouncementSkeleton />;
  }

  if (error) <ServerError error={error} />;
  //if (loading || silentLoading || !isDelayed) <AnnouncementSkeleton />;
  if (isNetworkError) <NetworkError />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1 mb-1">
          <button
            type="button"
            aria-label="Go Back"
            onClick={() => router.back()}
            className="p-2"
          >
            <ChevronLeft />
          </button>
          <h1 className="text-black dark:text-white capitalize font-bold text-lg lg:text-xl">
            {pageData?.title}
          </h1>
        </div>
        {canCreateAndManageAnnouncements && (
          <Button
            href={`/accountant/tasks/announcements/${announcementId}/manage`}
            size="sm_medium"
            className="py-2 px-3"
          >
            manage announcement
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-y-5 gap-x-10 lg:flex-row lg:items-start">
        {/* Left Side */}
        <div className="lg:w-[58%] lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          <AnnouncementPost
            data={{
              comments: pageData?.comments || [],
              likes: pageData?.likes || 0,
              dislikes: pageData?.dislikes || 0,
              viewers: pageData?.viewers || [],
              description: pageData?.description || "",
              my_like: pageData?.my_like ?? false,
              my_dislike: pageData?.my_dislike ?? false,
            }}
          />
        </div>
        {/* Right Side */}
        <div className="lg:flex-1 space-y-5 lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          {pageData && pageData?.media.length > 0 && (
            <AttachedImagesGrid images={pageData?.media} />
          )}

          <AnnouncementInfo
            containerClassName="rounded-lg"
            heading="target audience"
            info={{
              branch: pageData?.summary?.branch_name,
              properties: pageData?.summary?.property_name,
            }}
          />
          <ReadBy
            readBy={
              pageData?.read_by
                ? pageData.read_by.map((user) => ({
                    ...user,
                    name: user.user_name?.toLowerCase(), // adjust property names as needed
                    tier: user.tier_id, // adjust property names as needed
                    dateTime: `${dayjs(user?.date).format(
                      "DD/MM/YYYY"
                    )} ${dayjs(user?.time).format("hh:mm A")}`,
                    image: user.image ?? "", // ensure image is always a string
                  }))
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewAnnouncement;
