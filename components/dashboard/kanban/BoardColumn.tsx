import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDndContext, type UniqueIdentifier } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import { Task, TaskCard } from "./TaskCard";
import { cva } from "class-variance-authority";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export interface Column {
  id: UniqueIdentifier;
  title: string;
}

export type ColumnType = "Column";

export interface ColumnDragData {
  type: ColumnType;
  column: Column;
}

interface BoardColumnProps {
  column: Column;
  tasks: Task[];
  isOverlay?: boolean;
}

export function BoardColumn({ column, tasks, isOverlay }: BoardColumnProps) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.title}`,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva(
    "h-[500px] max-h-[500px] min-w-[350px] lg:min-w-[45%] xl:min-w-[32%] border-2 border-dashed rounded-lg bg-white dark:bg-[#3C3D37] flex flex-col",
    {
      variants: {
        dragging: {
          default: "border-2 border-dotted",
          over: "ring-2 opacity-30 border-dotted",
          overlay: "ring-2 ring-primary border-dotted",
        },
      },
    }
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="px-4 py-4 font-semibold text-left flex flex-row space-between items-center">
        <span className="text-text-label dark:text-white">
          {column.title + ` (${tasks.length})`}
        </span>
      </CardHeader>
      {/* Ensure only the task content scrolls */}
      <div className="flex-grow overflow-y-auto no-scrollbar">
        <ScrollArea>
          <CardContent className="flex flex-grow flex-col gap-2 px-2">
            <SortableContext items={tasksIds}>
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} statusChanger={true} />
              ))}
            </SortableContext>
          </CardContent>
        </ScrollArea>
      </div>
    </div>
  );
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const variations = cva("px-2 md:px-0 flex lg:justify-center pb-4", {
    variants: {
      dragging: {
        default: "snap-x snap-mandatory",
        active: "snap-none",
      },
    },
  });

  return (
    <ScrollArea
      className={variations({
        dragging: dndContext.active ? "active" : "default",
      })}
    >
      <div className="flex gap-4 items-center flex-row justify-between md:w-[400px] lg:w-full">
        {children}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
