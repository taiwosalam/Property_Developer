"use client";
import CreateAnnouncementForm from "@/components/tasks/announcements/create-announcement-form";
import { createAnnouncement } from "../data";
import { useAuthStore } from "@/store/authstrore";
import BackButton from "@/components/BackButton/back-button";

const CreateAnnouncement = () => {
  const accessToken = useAuthStore((state) => state.access_token);

  const handleSubmit = (data: any) => {
    createAnnouncement(accessToken, data);
  };

  return (
    <div className="space-y-7">
      <BackButton>Create Announcement</BackButton>
      <CreateAnnouncementForm handleSubmit={handleSubmit} />
    </div>
  );
};

export default CreateAnnouncement;
