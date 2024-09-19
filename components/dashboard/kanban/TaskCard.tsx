import { useState, useEffect, useRef } from "react";
import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { GripVertical } from "lucide-react";
import { ColumnId } from "./KanbanBoard";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

// Icons
import Mail from "@/public/icons/mail.svg";
import Clip from "@/public/icons/clip.svg";
import List from "@/public/icons/list.svg";
import Drag from "@/public/icons/drag.svg";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import TaskModal from "./task-action-modal";
import { useRouter } from "next/navigation";

export interface Task {
  id: UniqueIdentifier;
  columnId: ColumnId;
  content: {
    messageCount: number;
    linkCount: number;
    userAvatars: [string, string, string];
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
}

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

export function TaskCard({ task, isOverlay, noDrag }: TaskCardProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const wasRecentlyDragged = useRef(false);
  const router = useRouter();

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
      : task.content.status === "approved"
      ? "#01BA4C"
      : "#E9212E";

  useEffect(() => {
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
  }, [isDragging, noDrag]);

  const handleCardClick = () => {
    if (!isDragging && !wasRecentlyDragged.current && noDrag) {
      setModalOpen(true);
    } else {
      router.push("/tasks/complaints/1/manage-complain/");
    }
  };

  return (
    <div className="group">
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
            <Avatar className="hidden h-9 w-9 rounded-full sm:flex overflow-hidden">
              <AvatarImage
                src={task.avatarSrc}
                alt="Avatar"
                className="group-hover:scale-125 transition-all duration-700 ease-in-out"
              />
              <AvatarFallback>{task.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-x-1">
              <p className="text-sm font-medium text-text-primary">
                {task.name}
              </p>
              <p className="text-xs text-[#0033C4] font-medium capitalize">
                {task.title}
              </p>
              <p className="text-xs text-text-tertiary font-normal">
                {task.message.trim().slice(0, 33)}...
              </p>
            </div>
          </div>
          <button
            hidden={noDrag}
            {...attributes}
            {...listeners}
            className="stext-secondary-foreground/50 h-auto cursor-pointer"
            ref={setActivatorNodeRef}
          >
            <span className="sr-only">Move task</span>
            <Image src={Drag} alt="theme" width={20} height={20} />
          </button>
        </CardHeader>
        <CardContent className="px-3 py-3 cursor-pointer">
          <div>
            <div className="w-full flex items-center justify-between text-xs py-3">
              <div className="flex items-center align-middle">
                <Image src={List} alt="theme" width={20} height={20} />
                <p className="text-text-disabled font-bold">
                  {task.content.status}
                </p>
              </div>
              <p className="text-text-tertiary font-normal">
                {task.content.progress}/100%
              </p>
            </div>
            <div className="py-2">
              <Progress value={task.content.progress} fillColor={bg} />
            </div>
          </div>
          <div className="flex space-x-5">
            <div className="flex space-x-2 items-center">
              <Image
                src={Mail}
                alt="messages"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <Image
                src={Clip}
                alt="theme"
                width={16}
                height={16}
                className="w-4 h-4"
              />
            </div>
            <div className="w-full flex items-center justify-between">
              <div className="flex -space-x-2.5 overflow-hidden">
                {task.content.userAvatars.map((avatar, index) => (
                  <Avatar
                    key={index}
                    className="h-6 w-6 rounded-full border-2 border-white"
                  >
                    <AvatarImage src={avatar} alt="Avatar" />
                    <AvatarFallback>{avatar.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <p className="bg-brand-2 text-xs rounded-md py-2 px-4">
                {task.content.date}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal state={{ isOpen: isModalOpen, setIsOpen: setModalOpen }}>
        <ModalContent>
          <TaskModal complaintData={complaintData} />
        </ModalContent>
      </Modal>
    </div>
  );
}

const complaintData = {
  senderName: "Muibi Saheed",
  senderVerified: true,
  complaintTitle: "Door complain",
  propertyName: "David Hall",
  propertyAddress: "Olorishaoko, Moniya",
  accountOfficer: "Ajala David",
  branch: "Akinyele",
  brief:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius fugiat provident porro sunt atque deserunt dicta voluptatem ipsum hic. Repellat est, totam eos sed magni distinctio laudantium exercitationem molestiae aliquid.",
};
