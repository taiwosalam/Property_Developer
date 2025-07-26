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
import { ComplaintDetailResponse } from "@/app/(nav)/tasks/complaints/types";
import { IManageComplaints, transformComplaintManage } from "@/app/(nav)/tasks/complaints/[complainId]/manage-complain/data";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import ServerError from "@/components/Error/ServerError";
import NetworkError from "@/components/Error/NetworkError";
import ComplaintSkeleton from "@/components/Loader/complaint-details";
// import CreateReminderModal from "@/components/tasks/complainid/create-reminder-modal";
// import CreateTaskModal from "@/components/tasks/complainid/create-task-modal";

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

  if (loading && !error && !isNetworkError) {
    return <ComplaintSkeleton />;
  }

  if (manageData) <ComplaintSkeleton />;
  if (error) <ServerError error={error} />;
  if (isNetworkError) <NetworkError />;

  return (
    <section className="w-full lg:flex lg:items-start lg:gap-x-10 h-screen">
      <div className="w-full lg:w-3/5 lg:h-full space-y-10 overflow-y-scroll hide-scrollbar">
        <AboutTaskCard
          aboutCard={pageData?.aboutCard || []}
          description={pageData?.description || ""}
          tier_id={pageData?.tier_id}
        />
        <ComplaintsCalendar
          header="Create Reminders"
          buttonText="Set Reminder"
          taskStatus={pageData?.status}
          reminders={pageData?.reminders || []}
          // modalContent={<CreateReminderModal />}
        />
        {/* <ComplaintsCalendar
          header="Create Task"
          buttonText="Create Task"
          // modalContent={<CreateTaskModal />}
        /> */}
        <TaskStatusProgress
          percentage={pageData?.progress || 0}
          date={pageData?.updated_at}
          task_bar={{ task_bar: pageData?.task_bar || [] }}
          task={pageData?.task}
          taskStatus={pageData?.status}
        />
      </div>
      <div className="w-full lg:w-2/5 h-full overflow-y-scroll p-6 space-y-6 hide-scrollbar">
        <div className="h-full space-y-10">
          <AttchedImagesGrid images={pageData?.images || []} />
          {typeof pageData?.branch_id === "number" && (
            <AssignTaskCard
              branchId={pageData.branch_id}
              taskStatus={pageData?.status}
            />
          )}
          <MessagesFromTask
            taskStatus={pageData?.status}
            comments={
              pageData?.comments?.map((comment) => ({
                ...comment,
                isOwnMessage: userId === comment.userId, // Set this based on your logic to determine if message is from current user
              })) || []
            }
          />
          <Notes notes={pageData?.notes ?? []} taskStatus={pageData?.status} />
        </div>
      </div>
    </section>
  );
};

export default ManageComplain;
