"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "@/public/icons/icons";
import CreateAnnouncementForm from "@/components/tasks/announcements/create-announcement-form";

const CreateAnnouncement = () => {
  const router = useRouter();
  const handleSubmit = () => {};

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
