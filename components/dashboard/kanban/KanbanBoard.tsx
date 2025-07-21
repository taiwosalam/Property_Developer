"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";

import { BoardColumn, BoardContainer } from "./BoardColumn";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  useSensor,
  useSensors,
  KeyboardSensor,
  Announcements,
  UniqueIdentifier,
  TouchSensor,
  MouseSensor,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { type Task, TaskCard } from "./TaskCard";
import type { Column } from "./BoardColumn";
import { hasDraggableData } from "./utils";
import { coordinateGetter } from "./multipleContainersKeyboardPreset";
import { LoadingSpinner } from "@/app/(nav)/tasks/complaints/pending-scroll";
import { Loader2 } from "lucide-react";
import {
  approveAndProcessComplaint,
  rejectComplaint,
  transformComplaintDetails,
} from "@/app/(nav)/tasks/complaints/data";
import { toast } from "sonner";
import { Modal, ModalContent } from "@/components/Modal/modal";
import TaskModal from "./task-action-modal";
import useFetch from "@/hooks/useFetch";
import {
  ComplaintDetailResponse,
  ComplaintDetailsPageData,
} from "@/app/(nav)/tasks/complaints/types";

const defaultCols = [
  {
    id: "processing" as const,
    title: "Processing",
  },
  {
    id: "completed" as const,
    title: "Completed",
  },
  {
    id: "rejected" as const,
    title: "Rejected",
  },
] satisfies Column[];

export type ColumnId = (typeof defaultCols)[number]["id"] | string;

// Pagination state for each column
interface ColumnPagination {
  page: number;
  hasMore: boolean;
  loading: boolean;
}

interface KanbanBoardProps {
  kanbanTask?: Task[];
  pagination?: {
    total_pages: number;
    current_page: number;
    per_page: number;
    total: number;
  };
  onLoadMore?: (columnId: ColumnId, page: number) => Promise<void>;
  loading?: boolean;
  silentLoading?: boolean;
  //setTaskStatus?: (prevState: ColumnId | null) => void
}

export function KanbanBoard({
  kanbanTask,
  pagination,
  onLoadMore,
  loading: initialLoading = false,
  silentLoading = false,
}: KanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const pickedUpTaskColumn = useRef<ColumnId | null>(null);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState<Task[]>(kanbanTask ?? []);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Inside your KanbanBoard component, add these state variables
  const [statusChangeModalOpen, setStatusChangeModalOpen] = useState(false);
  const [currentTaskForStatusChange, setCurrentTaskForStatusChange] =
    useState<Task | null>(null);
  const [targetStatus, setTargetStatus] = useState<ColumnId | null>(null);
  const [cardData, setCardData] = useState<ComplaintDetailsPageData | null>(
    null
  );

  const complaintId = currentTaskForStatusChange?.id;
  const {
    data: complaintDataResponse,
    loading,
    error: fetchError,
  } = useFetch<ComplaintDetailResponse>(`complaint/${complaintId}`);

  useEffect(() => {
    if (complaintDataResponse) {
      const transformDetails = transformComplaintDetails(complaintDataResponse);
      setCardData(transformDetails);
    }
  }, [complaintDataResponse]);

  // Pagination state for each column
  const [columnPagination, setColumnPagination] = useState<
    Record<ColumnId, ColumnPagination>
  >({
    processing: { page: 1, hasMore: true, loading: false },
    approved: { page: 1, hasMore: true, loading: false },
    rejected: { page: 1, hasMore: true, loading: false },
  });

  // Intersection observer refs for each column
  const observerRefs = useRef<Record<ColumnId, IntersectionObserver | null>>({
    processing: null,
    approved: null,
    rejected: null,
  });

  const loadingRefs = useRef<Record<ColumnId, HTMLDivElement | null>>({
    processing: null,
    approved: null,
    rejected: null,
  });

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter,
    })
  );

  function getDraggingTaskData(taskId: UniqueIdentifier, columnId: ColumnId) {
    const tasksInColumn = tasks.filter((task) => task.columnId === columnId);
    const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId);
    const column = columns.find((col) => col.id === columnId);
    return {
      tasksInColumn,
      taskPosition,
      column,
    };
  }

  const handleStatusChange = async (
    note: string,
    tasksStatus?: "completed" | "rejected" | "processing" | "approved"
  ) => {
    if (!currentTaskForStatusChange || !targetStatus) {
      toast.error("Something went wrong!!");
      return;
    }

    if (
      (currentTaskForStatusChange.columnId === "completed" ||
        currentTaskForStatusChange.columnId === "rejected") &&
      (tasksStatus === "processing" || targetStatus === "processing")
    ) {
      toast.error("Cannot move completed or rejected tasks to Processing");
      return;
    }

    try {
      let response;
      const taskId = currentTaskForStatusChange?.id?.toString();

      switch (targetStatus) {
        case "completed": // Changed from "completed" to match column id
          response = await approveAndProcessComplaint(note, {
            id: taskId,
            route: "complete",
          });
          break;
        case "rejected":
          response = await rejectComplaint(note, taskId);
          break;
        case "processing":
          response = await approveAndProcessComplaint(note, {
            id: taskId,
            route: "process",
          });
          break;
        default:
          toast.error("Invalid status selected");
          return;
      }

      if (response) {
        window.dispatchEvent(new Event("refetchComplaints"));
        setStatusChangeModalOpen(false);
        setCurrentTaskForStatusChange(null);
        setTargetStatus(null);
      } else {
        throw new Error(`No response from ${targetStatus} API`);
      }
    } catch (error) {
      window.dispatchEvent(new Event("refetchComplaints"));
      setStatusChangeModalOpen(false);

      //toast.error(`Failed to update complaint to ${targetStatus}`);
    }
  };

  // Update tasks when new data comes in (append, don't replace)
  useEffect(() => {
    if (kanbanTask && kanbanTask.length > 0) {
      setTasks((prevTasks) => {
        // If this is the first page or a reset, replace the tasks
        if (pagination?.current_page === 1) {
          return kanbanTask;
        }

        // Otherwise, append new tasks avoiding duplicates
        const existingIds = new Set(prevTasks.map((task) => task.id));
        const newTasks = kanbanTask.filter((task) => !existingIds.has(task.id));
        return [...prevTasks, ...newTasks];
      });
    }
  }, [kanbanTask, pagination?.current_page]);

  // Update pagination state based on the global pagination
  useEffect(() => {
    if (pagination) {
      setColumnPagination((prev) => ({
        ...prev,
        // Update all columns with the same pagination info
        // In a real scenario, you might want to track pagination per column
        processing: {
          ...prev.processing,
          page: pagination.current_page,
          hasMore: pagination.current_page < pagination.total_pages,
          loading: false,
        },
        approved: {
          ...prev.approved,
          page: pagination.current_page,
          hasMore: pagination.current_page < pagination.total_pages,
          loading: false,
        },
        rejected: {
          ...prev.rejected,
          page: pagination.current_page,
          hasMore: pagination.current_page < pagination.total_pages,
          loading: false,
        },
      }));
    }
  }, [pagination]);

  // Load more data for a specific column
  const handleLoadMore = useCallback(
    async (columnId: ColumnId) => {
      const currentPagination = columnPagination[columnId];

      if (
        !currentPagination.hasMore ||
        currentPagination.loading ||
        !onLoadMore
      ) {
        return;
      }

      setColumnPagination((prev) => ({
        ...prev,
        [columnId]: {
          ...prev[columnId],
          loading: true,
        },
      }));

      try {
        await onLoadMore(columnId, currentPagination.page + 1);
      } catch (error) {
        // Reset loading state on error
        setColumnPagination((prev) => ({
          ...prev,
          [columnId]: {
            ...prev[columnId],
            loading: false,
          },
        }));
      }
    },
    [columnPagination, onLoadMore]
  );

  // Setup intersection observers for infinite scroll
  useEffect(() => {
    const setupObserver = (columnId: ColumnId) => {
      if (observerRefs.current[columnId]) {
        observerRefs.current[columnId]?.disconnect();
      }

      observerRefs.current[columnId] = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            handleLoadMore(columnId);
          }
        },
        {
          threshold: 0.1,
          rootMargin: "100px",
        }
      );

      const loadingElement = loadingRefs.current[columnId];
      if (loadingElement && observerRefs.current[columnId]) {
        observerRefs.current[columnId]?.observe(loadingElement);
      }
    };

    // Setup observers for all columns
    columns.forEach((col) => setupObserver(String(col.id)));

    return () => {
      // Cleanup observers
      Object.values(observerRefs.current).forEach((observer) => {
        observer?.disconnect();
      });
    };
  }, [columns, handleLoadMore]);

  // Ref callback for loading indicators
  const setLoadingRef = useCallback((columnId: ColumnId) => {
    return (element: HTMLDivElement | null) => {
      loadingRefs.current[columnId] = element;

      if (element && observerRefs.current[columnId]) {
        observerRefs.current[columnId]?.observe(element);
      }
    };
  }, []);

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;
      if (active.data.current?.type === "Column") {
        const startColumnIdx = columnsId.findIndex((id) => id === active.id);
        const startColumn = columns[startColumnIdx];
        return `Picked up Column ${startColumn?.title} at position: ${
          startColumnIdx + 1
        } of ${columnsId.length}`;
      } else if (active.data.current?.type === "Task") {
        pickedUpTaskColumn.current = active.data.current.task.columnId;
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          active.id,
          pickedUpTaskColumn.current
        );
        return `Picked up Task ${
          active.data.current.task.content
        } at position: ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`;
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;

      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnIdx = columnsId.findIndex((id) => id === over.id);
        return `Column ${active.data.current.column.title} was moved over ${
          over.data.current.column.title
        } at position ${overColumnIdx + 1} of ${columnsId.length}`;
      } else if (
        active.data.current?.type === "Task" &&
        over.data.current?.type === "Task"
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.columnId
        );
        if (over.data.current.task.columnId !== pickedUpTaskColumn.current) {
          return `Task ${
            active.data.current.task.content
          } was moved over column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was moved over position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`;
      }
    },
    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpTaskColumn.current = null;
        return;
      }
      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnPosition = columnsId.findIndex((id) => id === over.id);

        return `Column ${
          active.data.current.column.title
        } was dropped into position ${overColumnPosition + 1} of ${
          columnsId.length
        }`;
      } else if (
        active.data.current?.type === "Task" &&
        over.data.current?.type === "Task"
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.columnId
        );
        if (over.data.current.task.columnId !== pickedUpTaskColumn.current) {
          return `Task was dropped into column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was dropped into position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`;
      }
      pickedUpTaskColumn.current = null;
    },
    onDragCancel({ active }) {
      pickedUpTaskColumn.current = null;
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`;
    },
  };

  return (
    <>
      <DndContext
        accessibility={{
          announcements,
        }}
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="relative">
          <BoardContainer>
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <BoardColumn
                  key={col.id}
                  column={col}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                  loadingIndicator={
                    columnPagination[col.id]?.hasMore ? (
                      <div
                        ref={setLoadingRef(String(col.id))}
                        className="flex justify-center items-center p-6 text-sm text-gray-500 border-t border-gray-100 bg-gray-50/50"
                      >
                        {columnPagination[col.id]?.loading ? (
                          <div className="flex items-center gap-3 animate-pulse">
                            <div className="relative">
                              <div className="w-6 h-6 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                              <div className="absolute inset-0 w-6 h-6 border-3 border-transparent border-r-blue-300 rounded-full animate-spin animate-reverse"></div>
                            </div>

                            <Loader2 className="text-blue-600 animate-spin text-lg" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xs opacity-60 hover:opacity-80 transition-opacity">
                            {/* <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                              />
                            </svg>
                            Scroll for more */}
                          </div>
                        )}
                      </div>
                    ) : columnPagination[col.id]?.page > 1 ? (
                      <div className="flex justify-center items-center p-4 text-xs text-gray-400">
                        {/* <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          All tasks loaded
                        </div> */}
                      </div>
                    ) : null
                  }
                />
              ))}
            </SortableContext>
          </BoardContainer>

          {/* Global loading overlay for silent loading operations */}
          {silentLoading && (
            <div className="absolute top-0 right-0 m-4 z-50">
              <div className="flex items-center gap-2 bg-white shadow-lg rounded-lg px-4 py-2 border">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600">Updating...</span>
              </div>
            </div>
          )}
        </div>

        {typeof window !== "undefined" &&
          createPortal(
            <DragOverlay>
              {activeColumn && (
                <BoardColumn
                  isOverlay
                  column={activeColumn}
                  tasks={tasks.filter(
                    (task) => task.columnId === activeColumn.id
                  )}
                />
              )}
              {activeTask && (
                <TaskCard
                  task={activeTask}
                  isOverlay
                  taskStatus={targetStatus}
                  onConfirm={handleStatusChange}
                />
              )}
            </DragOverlay>,
            document.body
          )}
      </DndContext>

      {
        <Modal
          state={{
            isOpen: statusChangeModalOpen,
            setIsOpen: setStatusChangeModalOpen,
          }}
        >
          <ModalContent>
            <TaskModal
              onConfirm={handleStatusChange}
              statusChanger={true}
              complaintData={{
                id: cardData?.id || 0,
                senderName: cardData?.senderName || "___ ___",
                senderVerified: true,
                complaintTitle: cardData?.complaintTitle || "___ ___",
                propertyName: cardData?.propertyName || "___ ___",
                unitName: cardData?.unitName || "___ ___",
                propertyAddress: cardData?.propertyAddress || "___ ___",
                accountOfficer: cardData?.accountOfficer || "___ ___",
                branch: cardData?.branch || "___ ___",
                brief: cardData?.brief || "___ ___",
                tier: cardData?.tier || 0,
              }}
              //setModalOpen={setStatusChangeModalOpen}
              destinationColumn={targetStatus}
            />
          </ModalContent>
        </Modal>
      }
    </>
  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === "Column") {
      setActiveColumn(data.column);
      //setStatusChangeModalOpen(true);
      return;
    }

    if (data?.type === "Task") {
      setActiveTask(data.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
    // SAMPLE

    const { active, over } = event;

    if (!active || !over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (!activeData || !overData) return;

    // Task being dragged
    const draggedTask = activeData.task;

    // From which column the task came
    const fromColumn = draggedTask.columnId;

    let toColumn: ColumnId | null = null;

    // CASE 1: Dropped on another task
    if (overData.type === "Task") {
      const targetTask = overData.task;
      toColumn = targetTask.columnId;
    }

    // CASE 2: Dropped directly on a column
    if (overData.type === "Column") {
      toColumn = over.id as ColumnId; // Assuming over.id is the column id
    }

    if (toColumn !== "processing") {
      setTimeout(() => {
        setStatusChangeModalOpen(true);
      }, 1000);
    }

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    if (activeId === overId) return;

    const isActiveAColumn = activeData?.type === "Column";
    const isActiveATask = activeData?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveAColumn) {
      setColumns((columns) => {
        const activeColumnIndex = columns.findIndex(
          (col) => col.id === activeId
        );
        const overColumnIndex = columns.findIndex((col) => col.id === overId);
        return arrayMove(columns, activeColumnIndex, overColumnIndex);
      });
    }

    if (isActiveATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const activeTask = tasks[activeIndex];

        if (isOverATask) {
          const overIndex = tasks.findIndex((t) => t.id === overId);
          const overTask = tasks[overIndex];

          if (
            activeTask &&
            overTask &&
            activeTask.columnId !== overTask.columnId
          ) {
            if (
              (activeTask.columnId === "completed" ||
                activeTask.columnId === "rejected") &&
              overTask.columnId === "processing"
            ) {
              // toast.error(
              //   "Cannot move completed or rejected tasks to Processing"
              // );
              return tasks;
            }
            setCurrentTaskForStatusChange(activeTask);
            setTargetStatus(overTask.columnId as ColumnId);
            activeTask.columnId = overTask.columnId;
            return arrayMove(tasks, activeIndex, overIndex - 1);
          }
          return arrayMove(tasks, activeIndex, overIndex);
        }

        if (isOverAColumn) {
          if (
            activeTask &&
            (activeTask.columnId === "completed" ||
              activeTask.columnId === "rejected") &&
            overId === "processing"
          ) {
            // toast.error(
            //   "Cannot move completed or rejected tasks to Processing"
            // );
            return tasks;
          }
          setCurrentTaskForStatusChange(activeTask);
          setTargetStatus(overId as ColumnId);

          if (activeTask) {
            activeTask.columnId = overId as ColumnId;
            return arrayMove(tasks, activeIndex, activeIndex);
          }
        }
        return tasks;
      });
    }
    pickedUpTaskColumn.current = null;
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveATask = activeData?.type === "Task";
    const isOverATask = overData?.type === "Task";
    const isOverAColumn = overData?.type === "Column";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        const activeTask = tasks[activeIndex];
        const overTask = tasks[overIndex];

        if (
          activeTask &&
          overTask &&
          activeTask.columnId !== overTask.columnId
        ) {
          // Prevent moving from "approved" or "rejected" to "processing"
          if (
            (activeTask.columnId === "completed" ||
              activeTask.columnId === "rejected") &&
            overTask.columnId === "processing"
          ) {
            // toast.error(
            //   "Cannot move completed or rejected tasks to Processing"
            // );
            return tasks; // No state change
          }

          //setCurrentTaskForStatusChange(activeTask);
          //setTargetStatus(overTask.columnId as ColumnId);
          //setStatusChangeModalOpen(true);
          activeTask.columnId = overTask.columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const activeTask = tasks[activeIndex];
        if (activeTask) {
          // Prevent moving from "approved" or "rejected" to "processing"
          if (
            (activeTask.columnId === "completed" ||
              activeTask.columnId === "rejected") &&
            overId === "processing"
          ) {
            toast.error(
              "Cannot move completed or rejected tasks to Processing"
            );
            return tasks; // No state change
          }

          setCurrentTaskForStatusChange(activeTask);
          setTargetStatus(overId as ColumnId);
          //setStatusChangeModalOpen(true);
          activeTask.columnId = overId as ColumnId;
          return arrayMove(tasks, activeIndex, activeIndex);
        }
        return tasks;
      });
    }
  }
}
