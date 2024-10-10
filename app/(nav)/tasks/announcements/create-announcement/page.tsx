"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "@/public/icons/icons";
import CreateAnnouncementForm from "@/components/tasks/announcements/create-announcement-form";
import { createAnnouncement } from "../data";
import { useAuthStore } from "@/store/authstrore";

const CreateAnnouncement = () => {
  const accessToken = useAuthStore((state) => state.access_token);
  const router = useRouter();

  const handleSubmit = (data: any) => {
    console.log({data});
    createAnnouncement(accessToken, data);
  };

  return (
    <div className="space-y-7">
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
          Create Announcement
        </h1>
      </div>
      <CreateAnnouncementForm handleSubmit={handleSubmit} />
    </div>
  );
};

export default CreateAnnouncement;
