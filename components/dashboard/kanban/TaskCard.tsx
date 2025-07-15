import { useState, useEffect, useRef } from "react";
import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cva } from "class-variance-authority";
import { ColumnId } from "./KanbanBoard";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

// Icons
import {
  MailIcon,
  ClipIcon,
  VerticalEllipsisIcon,
  ComplaintsListIcon,
} from "@/public/icons/icons";
import List from "@/public/icons/list.svg";
import Drag from "@/public/icons/drag.svg";
import { Modal, ModalContent } from "@/components/Modal/modal";
import TaskModal from "./task-action-modal";
import { usePathname, useRouter } from "next/navigation";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import clsx from "clsx";
import useFetch from "@/hooks/useFetch";
import {
  ComplaintDetailResponse,
  ComplaintDetailsPageData,
} from "@/app/(nav)/tasks/complaints/types";
import { transformComplaintDetails } from "@/app/(nav)/tasks/complaints/data";
import { getBadgeColor } from "@/lib/utils";

export interface Task {
  id: UniqueIdentifier;
  tier?: number;
  columnId: ColumnId | string;
  content: {
    messageCount: number;
    linkCount: number;
    userAvatars: string[];
    date: string;
    status?: string;
    progress?: number;
  };
  name: string;
  title: string;
  message: string;
  avatarSrc: string;
}

interface TaskCardProps {
  task: Task;
  noDrag?: boolean;
  isOverlay?: boolean;
  isNew?: boolean;
  statusChanger?: boolean;
  viewOnly?: boolean;
  styles?: string;
  taskStatus?: string | null;
  onConfirm?: (
    note: string,
    status?: "completed" | "rejected" | "processing"
  ) => void;
  onClick?: () => void;
}

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isOverlay,
  noDrag,
  isNew,
  statusChanger,
  viewOnly,
  styles,
  taskStatus,
  onConfirm,
  onClick,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const wasRecentlyDragged = useRef(false);
  const router = useRouter();
  const pathname = usePathname();
  const [cardData, setCardData] = useState<ComplaintDetailsPageData | null>(
    null
  );

  const {
    data: complaintDataResponse,
    loading,
    error,
  } = useFetch<ComplaintDetailResponse>(`complaint/${task.id}`);

  useEffect(() => {
    if (complaintDataResponse) {
      const transformDetails = transformComplaintDetails(complaintDataResponse);
      setCardData(transformDetails);
    }
  }, [complaintDataResponse]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    setActivatorNodeRef,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: "Task",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  const bg =
    task.content.status === "processing"
      ? "#FDB82C"
      : task.content.status === "completed"
      ? "#01BA4C"
      : "#E9212E";

  useEffect(() => {
    if (viewOnly) return;
    if (isDragging) {
      wasRecentlyDragged.current = true;
    } else if (wasRecentlyDragged.current) {
      // Set a small delay to ensure the drag operation is fully complete
      const timer = setTimeout(() => {
        if (!noDrag) {
          setModalOpen(true);
        }
        wasRecentlyDragged.current = false;
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isDragging, noDrag, viewOnly]);

  const handleCardClick = () => {
    if (viewOnly) return;
    if (noDrag && onClick) {
      onClick();
    }
    if (!isDragging && !wasRecentlyDragged.current && noDrag) {
      setModalOpen(true);
    } else {
      router.push(`/tasks/complaints/${task?.id}/manage-complain/`);
    }
  };

  const handleSubmit = (notes: string) => {
    onConfirm?.(notes);
    setModalOpen(false);
  };

  return (
    <div className={`group ${styles}`}>
      <Card
        ref={setNodeRef}
        style={style}
        className={variants({
          dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
        })}
        onClick={handleCardClick}
      >
        <CardHeader className="px-3 py-3 space-between flex flex-row border-secondary relative">
          <div className="w-full flex items-center space-x-2">
            <Avatar className="hidden h-9 w-9 rounded-full sm:flex overflow-hidden custom-secondary-bg">
              <AvatarImage
                src={task.avatarSrc}
                alt="Avatar"
                className="group-hover:scale-125 transition-all duration-700 ease-in-out"
              />
              <AvatarFallback>{task.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-x-1">
              <p className="text-sm font-medium text-text-primary dark:text-darkText-1 flex items-center space-x-0.5 capitalize">
                {task.name}
                <BadgeIcon color={getBadgeColor(task?.tier) ?? "gray"} />
              </p>
              <p className="text-xs text-brand-9 font-medium capitalize">
                {task.title}
              </p>
              <p className="text-xs text-text-tertiary dark:text-darkText-1 font-normal">
                {task.message.trim().slice(0, 33)}...
              </p>
            </div>
          </div>
          <button
            hidden={noDrag}
            {...attributes}
            {...listeners}
            className="text-secondary-foreground/50 h-auto cursor-pointer"
            ref={setActivatorNodeRef}
          >
            <span className="sr-only">Move task</span>
            <Image src={Drag} alt="theme" width={20} height={20} />
          </button>
          <button
            hidden={!noDrag}
            {...attributes}
            {...listeners}
            className="text-secondary-foreground/50 h-auto cursor-pointer"
            ref={setActivatorNodeRef}
          >
            <span className="sr-only">Move task</span>
            <VerticalEllipsisIcon color="#3f4247" size={18} />
          </button>
        </CardHeader>
        <CardContent className="px-3 py-3 cursor-pointer">
          <div>
            <div className="w-full flex items-center justify-between text-xs py-3">
              <div className="flex items-center align-middle">
                {/* <Image src={List} alt="theme" width={20} height={20} /> */}
                <ComplaintsListIcon />
                <p className="text-text-disabled font-bold capitalize">
                  {task.content.status}
                </p>
              </div>
              {task?.content?.status !== "rejected" && (
                <p
                  className="text-text-tertiary dark-text-darkText-1 font-normal"
                  hidden={isNew}
                >
                  {task?.content?.status === "completed"
                    ? 100
                    : task.content.progress}
                  /100%
                </p>
              )}
            </div>
            <div className="py-2">
              <Progress
                value={
                  task?.content?.status === "rejected" ||
                  task?.content?.status === "completed"
                    ? 100
                    : task?.content?.progress
                }
                fillColor={isNew ? "" : bg}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-between">
            <div className="flex gap-2.5 items-center">
              <MailIcon size={20} />
              <ClipIcon />
              <div className="flex itema-center">
                {task?.content?.userAvatars?.map((avatar, index) => (
                  <Avatar
                    key={index}
                    className={clsx(
                      "h-6 w-6 rounded-full border-2 border-white flex items-center",
                      index !== 0 && "-ml-2.5"
                    )}
                    style={{
                      width: "20px",
                      height: "20px",
                      boxShadow:
                        index !== task?.content?.userAvatars?.length - 1
                          ? "3px 4px 8px 0px rgba(53, 37, 19, 0.31)"
                          : undefined,
                      zIndex: index,
                    }}
                  >
                    <AvatarImage
                      src={avatar}
                      alt="Avatar"
                      className="rounded-full h-full w-full flex items-center"
                    />
                    <AvatarFallback>{avatar?.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>

            <p className="bg-[var(--secondary-color)] bg-opacity-10 text-xs rounded-md py-2 px-4">
              {task.content.date}
            </p>
          </div>
        </CardContent>
      </Card>

      {cardData && task?.content?.status === "pending" && (
        <Modal state={{ isOpen: isModalOpen, setIsOpen: setModalOpen }}>
          <ModalContent>
            <TaskModal
              onConfirm={handleSubmit}
              statusChanger={statusChanger}
              complaintData={cardData}
              setModalOpen={setModalOpen}
              targetStatus={taskStatus}
              showApproveRejectButtons={
                task?.content?.status === "pending" ? true : false
              }
            />
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};
