import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ColumnId } from "./KanbanBoard";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

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
  isOverlay?: boolean;
}

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
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

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="px-3 py-3 space-between flex flex-row border-secondary relative">
        <div className="w-full flex items-center space-x-2">
          <Avatar className="hidden h-9 w-9 rounded-full sm:flex">
            <AvatarImage src={task.avatarSrc} alt="Avatar" />
            <AvatarFallback>{task.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-x-1">
            <p className="text-sm font-medium text-text-primary">{task.name}</p>

            <p className="text-xs text-text-secondary capitalize">
              {task.title}
            </p>
            <p className="text-xs text-text-tertiary font-normal">
              {task.message.trim().slice(0, 33)}...
            </p>
          </div>
        </div>
        <Button
          variant={"ghost"}
          {...attributes}
          {...listeners}
          className="p-0.5 text-secondary-foreground/50 h-auto cursor-pointer"
        >
          <span className="sr-only">Move task</span>
          <GripVertical />
        </Button>
      </CardHeader>
      <CardContent className="px-3 py-3">
        <div>
          <div className="w-full flex items-center justify-between text-xs py-3">
            <p className="text-text-disabled font-bold">
              {task.content.status}
            </p>
            <p className="text-text-tertiary font-normal">
              {task.content.progress}/100%
            </p>
          </div>
          <div></div>
        </div>
        <div>
          <div></div>
          <div></div>
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
  );
}
