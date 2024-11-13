"use client";
import CreateAnnouncementForm from "@/components/tasks/announcements/create-announcement-form";
import { createAnnouncement } from "../data";
import BackButton from "@/components/BackButton/back-button";

const CreateAnnouncement = () => {
  const handleSubmit = (data: any) => {
    createAnnouncement(data);
  };

  return (
    <div className="space-y-7">
      <BackButton>Create Announcement</BackButton>
      <CreateAnnouncementForm handleSubmit={handleSubmit} />
    </div>
  );
};

export default CreateAnnouncement;
