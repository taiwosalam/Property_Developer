"use client";
import { useCallback, useEffect, useState } from "react";
import type { LabelValuePairProps } from "../property-requests/types";
import { PointerDownSVG } from "@/public/icons/icons";
import { DepositRequestModalProps } from "../deposit-requests/types";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import ModalPreset from "@/components/Wallet/wallet-modal-preset";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import { useParams } from "next/navigation";
import { updateProgressStatus } from "@/app/(nav)/tasks/complaints/[complainId]/manage-complain/data";
import { toast } from "sonner";
import { string } from "zod";

const assignTaskCheckList = [
  { label: "Assign Task", value: "Assign task", progress: 16.7 },
  { label: "Task Inspection", value: "Task inspection", progress: 33.4 },
  { label: "Create Maintenance", value: "Create maintenance", progress: 50.1 },
  { label: "Task Perfection", value: "Task perfection", progress: 66.8 },
  { label: "Rechecking of Task", value: "Rechecking of task", progress: 83.5 },
  { label: "Close Task", value: "Close task", progress: 100 },
];

const LabelValuePair: React.FC<LabelValuePairProps> = ({ label, value }) => {
  return (
    <div className="flex justify-between font-medium">
      <p className="text-text-tertiary dark:text-darkText-1 text-base">
        {label}
      </p>
      <p className="text-text-secondary text-sm text-right dark:text-darkText-2 capitalize">
        {value}
      </p>
    </div>
  );
};

interface ITaskProgressModal {
  task_bar: {
    progress: string;
    text: string;
    approve_by: string;
    time: string;
    date: string;
  }[];
  task?: {
    title: string;
    approve_by: string;
    date: string;
    time: string;
  };
  setIsOpen?: (val: boolean) => void;
  percentage: number;
  onTaskUpdate?: () => void; // Callback to refresh parent data
}

const TaskProgressModal: React.FC<ITaskProgressModal> = ({
  task_bar,
  task,
  setIsOpen,
  percentage,
  onTaskUpdate,
}) => {
  const [pendingTasks, setPendingTasks] = useState<Set<string>>(new Set());
  const [processingTasks, setProcessingTasks] = useState<Set<string>>(
    new Set()
  );

  const param = useParams();
  const id = param.complainId as string;

  const [checkedTasks, setCheckedTasks] = useState<string[]>(
    task_bar.map((bar) => bar.text)
  );

  const commonClasses =
    "bg-neutral-3 dark:bg-[#3C3D37] px-[18px] py-2 rounded-[4px] flex-row-reverse justify-between items-center w-full";

  const HoverContent = ({
    approve_by,
    date,
    time,
  }: {
    approve_by: string;
    time: string;
    date: string;
  }) => (
    <div className="w-[250px] absolute bottom-full right-[12px] z-10 bg-brand-10 py-2 px-4 space-y-[10px] text-white text-sm font-normal">
      <p className="flex gap-2">
        <span>Approved by:</span>
        <span className="capitalize">{approve_by}</span>
      </p>
      <p className="flex gap-2">
        <span>Date:</span>
        <span>{date}</span>
      </p>
      <p className="flex gap-2">
        <span>Time:</span>
        <span>{time}</span>
      </p>
      <div className="!m-0 absolute right-2 top-full text-brand-10">
        <PointerDownSVG />
      </div>
    </div>
  );

  // Function to submit a task to the backend
  const submitTask = async (taskValue: string) => {
    const taskConfig = assignTaskCheckList.find((t) => t.value === taskValue);
    if (!taskConfig) return false;

    try {
      setProcessingTasks((prev) => new Set([...prev, taskValue]));

      const res = await updateProgressStatus(
        id,
        taskConfig.value,
        taskConfig.progress
      );

      if (res) {
        toast.success(`Task completed: ${taskConfig.label}`);
        // Remove from pending tasks on success
        setPendingTasks((prev) => {
          const newSet = new Set(prev);
          newSet.delete(taskValue);
          return newSet;
        });
        // Trigger parent refresh if callback provided
        onTaskUpdate?.();
        return true;
      }
      return false;
    } catch (error) {
      toast.error(`Failed to update task: ${taskConfig?.label}`);
      console.error("Task update error:", error);
      return false;
    } finally {
      setProcessingTasks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(taskValue);
        return newSet;
      });
    }
  };

  // Handle checkbox changes with immediate backend submission
  const handleCheckboxChange = useCallback(
    async (taskValue: string, checked: boolean) => {
      if (checked) {
        // Immediately update UI
        setCheckedTasks((prev) => {
          if (!prev.includes(taskValue)) {
            return [...prev, taskValue];
          }
          return prev;
        });

        // Add to pending tasks and submit
        setPendingTasks((prev) => new Set([...prev, taskValue]));

        // Submit to backend
        const success = await submitTask(taskValue);

        if (!success) {
          // Revert UI state if submission failed
          setCheckedTasks((prev) => prev.filter((val) => val !== taskValue));
          setPendingTasks((prev) => {
            const newSet = new Set(prev);
            newSet.delete(taskValue);
            return newSet;
          });
        }
      } else {
        // Handle unchecking (only for tasks not yet submitted to backend)
        const isBackendTask = task_bar.some((bar) => bar.text === taskValue);
        const isPending = pendingTasks.has(taskValue);

        if (!isBackendTask && !isPending) {
          setCheckedTasks((prev) => prev.filter((val) => val !== taskValue));
        }
      }
    },
    [task_bar, pendingTasks, id]
  );

  // Get the task status for display
  const getTaskStatus = (taskValue: string) => {
    const isBackendCompleted = task_bar.some((bar) => bar.text === taskValue);
    const isPending = pendingTasks.has(taskValue);
    const isProcessing = processingTasks.has(taskValue);

    if (isBackendCompleted) return "completed";
    if (isProcessing) return "processing";
    if (isPending) return "pending";
    return "available";
  };

  // Sync checkedTasks with task_bar when it changes
  useEffect(() => {
    setCheckedTasks((prev) => {
      const backendTasks = task_bar.map((bar) => bar.text);
      const pendingTasksArray = Array.from(pendingTasks);
      // Combine backend tasks with pending tasks
      const newCheckedTasks = [
        ...new Set([...prev, ...backendTasks, ...pendingTasksArray]),
      ];
      return newCheckedTasks;
    });
  }, [task_bar, pendingTasks]);

  return (
    <ModalPreset title="Task bar">
      <div className="text-base">
        <div className="space-y-2">
          <LabelValuePair label="Name of task" value={task?.title || ""} />
          <LabelValuePair
            label="Task accepted by:"
            value={task?.approve_by || ""}
          />
          <LabelValuePair label="Date accepted" value={task?.date || ""} />
          <LabelValuePair label="Time" value={task?.time || ""} />
        </div>
        <div className="border-t border-brand-7 my-5 -mx-6 border-dashed" />
        <div className="space-y-4">
          <div>
            {percentage === 100 ? (
              <p className="text-green-500 text-lg">{"Completed"}</p>
            ) : (
              <p className="text-black dark:text-white">Processing stage</p>
            )}
            <p className="text-text-tertiary">
              Tasks are automatically saved when checked
            </p>
          </div>

          <div className="space-y-2 relative">
            {assignTaskCheckList.map((task) => {
              const matchedTaskBar = task_bar.find(
                (bar) => bar.text === task.value
              );
              const isChecked = checkedTasks.includes(task.value);
              const taskStatus = getTaskStatus(task.value);
              const isDisabled =
                taskStatus === "completed" || taskStatus === "processing";

              // Create dynamic classes based on task status
              let checkboxClasses = commonClasses;
              if (taskStatus === "processing") {
                checkboxClasses += " opacity-60";
              } else if (taskStatus === "pending") {
                checkboxClasses +=
                  " bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700";
              } else if (taskStatus === "completed") {
                checkboxClasses +=
                  " bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700";
              }

              return (
                <div key={task.value} className="relative">
                  <Checkbox
                    className={commonClasses}
                    hoverContent={
                      matchedTaskBar && (
                        <HoverContent
                          approve_by={matchedTaskBar.approve_by}
                          time={matchedTaskBar.time}
                          date={matchedTaskBar.date}
                        />
                      )
                    }
                    checked={isChecked}
                    onChange={(checked: boolean) =>
                      handleCheckboxChange(task.value, checked)
                    }
                    //disabled={isDisabled}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{task.label}</span>
                      {taskStatus === "processing" && (
                        <span className="text-xs text-blue-500 ml-2">
                          Saving...
                        </span>
                      )}
                      {taskStatus === "pending" && (
                        <span className="text-xs text-yellow-600 dark:text-yellow-400 ml-2">
                          Pending
                        </span>
                      )}
                    </div>
                  </Checkbox>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ModalPreset>
  );
};

export default TaskProgressModal;
