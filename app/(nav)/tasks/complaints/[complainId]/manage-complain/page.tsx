"use client";

import AboutTaskCard from "@/components/tasks/complainid/about-task-card";
import AttchedImagesGrid from "@/components/tasks/complainid/Attached-images-grid";
import AssignTaskCard from "@/components/tasks/complainid/assign-task-card";
import MessagesFromTask from "@/components/tasks/complainid/messages-from-task";
import Notes from "@/components/tasks/complainid/notes";
import TaskStatusProgress from "@/components/tasks/complainid/task-status-progress";
import ComplaintsCalendar from "@/components/tasks/complainid/complaints-calendar";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import { ComplaintDetailResponse } from "../../types";
import { IManageComplaints, transformComplaintManage } from "./data";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { usePersonalInfoStore } from "@/store/personal-info-store";
// import CreateReminderModal from "@/components/tasks/complainid/create-reminder-modal";
// import CreateTaskModal from "@/components/tasks/complainid/create-task-modal";

const images = [
  { src: "/empty/SampleProperty.jpeg", isVideo: false },
  { src: "/empty/SampleProperty2.jpeg", isVideo: true },
  { src: "/empty/SampleProperty3.jpeg", isVideo: false },
  { src: "/empty/SampleProperty4.png", isVideo: false },
  { src: "/empty/SampleProperty5.jpg", isVideo: false },
  { src: "/empty/SampleProperty6.jpg", isVideo: false },
  { src: "/empty/SampleProperty.jpeg", isVideo: false },
];

const ManageComplain = () => {
  const [pageData, setPageData] = useState<IManageComplaints | null>(null);
  const { userId } = usePersonalInfoStore();
  const param = useParams();
  const id = param.complainId;

  const {
    data: manageData,
    loading,
    isNetworkError,
    error,
    silentLoading,
    refetch,
  } = useFetch<ComplaintDetailResponse>(`/complaint/${id}`);
  useRefetchOnEvent("manageComplain", () => refetch({ silent: true }));

  useEffect(() => {
    if (manageData) {
      const transData = transformComplaintManage(manageData);

      setPageData(transData);
    }
  }, [manageData]);

  return (
    <section className="w-full lg:flex lg:items-start lg:gap-x-10">
      <div className="w-full lg:w-3/5 lg:h-full space-y-10">
        <AboutTaskCard
          aboutCard={pageData?.aboutCard || []}
          description={pageData?.description|| ""}
          tier_id={pageData?.tier_id}
        />
        <ComplaintsCalendar
          header="Create Reminders"
          buttonText="Set Reminder"
          // modalContent={<CreateReminderModal />}
        />
        <ComplaintsCalendar
          header="Create Task"
          buttonText="Create Task"
          // modalContent={<CreateTaskModal />}
        />
        <TaskStatusProgress
          percentage={pageData?.progress || 0}
          date={pageData?.updated_at}
        />
      </div>
      <div className="w-full lg:w-2/5 lg:h-full">
        <div className="h-full space-y-10">
          <AttchedImagesGrid images={pageData?.images || []} />
          <AssignTaskCard />
          <MessagesFromTask comments={pageData?.comments?.map(comment => ({
            ...comment,
            isOwnMessage: userId === comment.userId  // Set this based on your logic to determine if message is from current user
          })) || []}/>
          <Notes notes={pageData?.notes ?? []} />
        </div>
      </div>
    </section>
  );
};

export default ManageComplain;
