"use client";

import { useRouter, useParams } from "next/navigation";
import { ChevronLeft } from "@/public/icons/icons";
import Button from "@/components/Form/Button/button";
import AnnouncementPost from "@/components/tasks/announcements/announcement-post";
import AttachedImagesGrid from "@/components/tasks/complainid/Attached-images-grid";
import { LandlordTenantInfo as AnnouncementInfo } from "@/components/Management/landlord-tenant-info-components";
import ReadBy from "@/components/tasks/announcements/read-by";

const PreviewAnnouncement = () => {
  const router = useRouter();
  const { announcementId } = useParams();
  const images = [
    "/empty/SampleProperty.jpeg",
    "/empty/SampleProperty2.jpeg",
    "/empty/SampleProperty3.jpeg",
    "/empty/SampleProperty4.png",
    "/empty/SampleProperty5.jpg",
    "/empty/SampleProperty6.jpg",
  ];
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
          <h1 className="text-black font-bold text-lg lg:text-xl">
            Rent Increase & Maintenance
          </h1>
        </div>
        <Button
          href={`/tasks/announcements/${announcementId}/manage`}
          size="sm_medium"
          className="py-2 px-3"
        >
          Manage Announcement
        </Button>
      </div>
      <div className="flex flex-col gap-y-5 gap-x-[3.5%] lg:flex-row lg:items-start">
        {/* Left Side */}
        <div className="lg:w-[58%]">
          <AnnouncementPost />
        </div>
        {/* Right Side */}
        <div className="flex-1 space-y-5">
          <AttachedImagesGrid images={images} />
          <AnnouncementInfo
            heading="summary"
            info={{
              branch: "All/ Bodija, Moniya, Tokyo",
              properties: "All Projects/ Harmony Cottage, Bodija Hotels",
            }}
          />
          <ReadBy />
        </div>
      </div>
    </div>
  );
};

export default PreviewAnnouncement;
