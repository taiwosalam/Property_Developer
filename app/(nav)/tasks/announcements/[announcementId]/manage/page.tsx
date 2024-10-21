"use client";
import CreateAnnouncementForm from "@/components/tasks/announcements/create-announcement-form";
import BackButton from "@/components/BackButton/back-button";

const EditAnnouncement = () => {
  const handleSubmit = () => {};
  return (
    <div>
      <BackButton>Edit Announcement</BackButton>
      <CreateAnnouncementForm handleSubmit={handleSubmit} editMode={true} />
    </div>
  );
};

export default EditAnnouncement;
