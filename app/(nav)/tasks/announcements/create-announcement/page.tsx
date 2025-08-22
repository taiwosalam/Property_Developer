"use client";
import CreateAnnouncementForm from "@/components/tasks/announcements/create-announcement-form";
import { createAnnouncement, updateAnnouncement } from "../data";
import BackButton from "@/components/BackButton/back-button";
import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ExclamationMark } from "@/public/icons/icons";
import { useTourStore } from "@/store/tour-store";

const CreateAnnouncement = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { announcementId } = useParams();
  const paramId = announcementId as string;

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

  const pathname = usePathname();
  const {
    setShouldRenderTour,
    setPersist,
    isTourCompleted,
    goToStep,
    restartTour,
  } = useTourStore();

  useEffect(() => {
    setPersist(false);
    if (!isTourCompleted("CreateAnnouncementTour")) {
      setShouldRenderTour(true);
    } else {
      setShouldRenderTour(false);
    }

    return () => setShouldRenderTour(false);
  }, [setShouldRenderTour, setPersist, isTourCompleted]);

  return (
    <div className="space-y-7">
      <div className="flex gap-2 items-center">
        <BackButton>Create Announcement</BackButton>

        <button
          onClick={() => restartTour(pathname)}
          type="button"
          className="text-orange-normal"
        >
          <ExclamationMark />
        </button>
      </div>
      <CreateAnnouncementForm
        handleSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default CreateAnnouncement;
