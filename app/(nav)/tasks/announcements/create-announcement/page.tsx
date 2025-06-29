"use client";
import CreateAnnouncementForm from "@/components/tasks/announcements/create-announcement-form";
import { createAnnouncement } from "../data";
import BackButton from "@/components/BackButton/back-button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CreateAnnouncement = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {

    setIsSubmitting(true);
    try {
      const success = await createAnnouncement(formData);
      if (success) {
        toast.success("Announcement created");
        router.push("/tasks/announcements");
      }
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-7">
      <BackButton>Create Announcement</BackButton>
      <CreateAnnouncementForm
        handleSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default CreateAnnouncement;
