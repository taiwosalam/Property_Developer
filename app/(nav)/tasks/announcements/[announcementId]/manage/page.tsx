"use client";
import CreateAnnouncementForm from "@/components/tasks/announcements/create-announcement-form";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "@/public/icons/icons";

const EditAnnouncement = () => {
  const router = useRouter();
  const handleSubmit = () => {};
  return (
    <div>
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
          Edit Announcement
        </h1>
      </div>
      <CreateAnnouncementForm handleSubmit={handleSubmit} editMode={true} />
    </div>
  );
};

export default EditAnnouncement;
