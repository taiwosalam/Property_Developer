"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";

// ... existing code ...

const AnnouncementPage = () => {
  const router = useRouter();
  const { announcementId } = useParams();

  useEffect(() => {
    if (announcementId) {
      router.replace(`/accountant/tasks/announcements/${announcementId}/preview`);
    }
  }, [announcementId, router]);

  return null; // or some loading indicator
};

// ... existing code ...

export default AnnouncementPage;
