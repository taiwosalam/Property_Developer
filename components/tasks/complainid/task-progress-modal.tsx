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
}
const TaskProgressModal: React.FC<ITaskProgressModal> = ({
  task_bar,
  task,
  setIsOpen,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const param = useParams();
  const id = param.complainId as string;

  const [checkedTasks, setCheckedTasks] = useState<string[]>(
    task_bar.map((bar) => bar.text)
  );

  // Track the most recently checked task
  const [lastCheckedTask, setLastCheckedTask] = useState<string | null>(null);

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

  // Handle checkbox changes with useCallback for stability
  const handleCheckboxChange = useCallback(
    (taskValue: string, checked: boolean) => {
      setCheckedTasks((prev) => {
        if (checked) {
          // Add task if not already checked
          if (!prev.includes(taskValue)) {
            setLastCheckedTask(taskValue);
            return [...prev, taskValue];
          }
          return prev;
        } else {
          // Allow unchecking only if task is not in task_bar
          if (!task_bar.some((bar) => bar.text === taskValue)) {
            const newCheckedTasks = prev.filter((val) => val !== taskValue);
            // Update lastCheckedTask if the unchecked task was the last checked
            if (taskValue === lastCheckedTask) {
              // Set to the most recently checked task still in checkedTasks
              const remainingTasks = newCheckedTasks.filter(
                (val) => !task_bar.some((bar) => bar.text === val)
              );
              setLastCheckedTask(
                remainingTasks[remainingTasks.length - 1] || null
              );
            }
            return newCheckedTasks;
          }
          return prev;
        }
      });
    },
    [task_bar, lastCheckedTask]
  );

  const getTaskToSubmit = () => {
    if (!lastCheckedTask) return null;
    const task = assignTaskCheckList.find((t) => t.value === lastCheckedTask);
    return task ? { task: task.value, progress: task.progress } : null;
  };

  // Handle form submission
  const handleUpdateStatusProgress = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const taskToSubmit = getTaskToSubmit();
    if (!taskToSubmit) {
      toast.error("Please check a task before submitting.");
      return;
    }
    try {
      setIsLoading(true);
      const res = await updateProgressStatus(
        id,
        taskToSubmit.task,
        taskToSubmit.progress
      );
      if (res) {
        toast.success(`Status updated: ${taskToSubmit?.task}`);
        // Clear lastCheckedTask after successful submission
        setLastCheckedTask(null);
        setIsOpen?.(false);
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsLoading(false);
    }
  };

  //Sync checkedTasks with task_bar when it changes
  useEffect(() => {
    // Only update checkedTasks if task_bar has new completed tasks
    setCheckedTasks((prev) => {
      const backendTasks = task_bar.map((bar) => bar.text);
      // Preserve locally checked tasks that aren't yet in task_bar
      const newCheckedTasks = [...new Set([...prev, ...backendTasks])];
      return newCheckedTasks;
    });
    // Reset lastCheckedTask if it's already in task_bar
    if (
      lastCheckedTask &&
      task_bar.some((bar) => bar.text === lastCheckedTask)
    ) {
      setLastCheckedTask(null);
    }
  }, [task_bar, lastCheckedTask]);

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
        <form className="space-y-4">
          <div>
            <p className="text-green-500 text-lg">{""}</p>
            <p className="text-black dark:text-white">Processing stage</p>
            <p className="text-text-tertiary">
              Kindly check the box if you are done with a particular task
            </p>
          </div>

          <div className="space-y-2 relative">
            {assignTaskCheckList.map((task) => {
              const matchedTaskBar = task_bar.find(
                (bar) => bar.text === task.value
              );
              const isChecked = checkedTasks.includes(task.value);
              const isDisabled =
                !isChecked && task_bar.some((bar) => bar.text === task.value); // Disable if already checked in backend
              return (
                <Checkbox
                  key={task.value}
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
                  disabled={isDisabled}
                >
                  {task.label}
                </Checkbox>
              );
            })}
          </div>
          <div className="space-y-5 w-full">
            <Button
              disabled={isLoading || !lastCheckedTask}
              type="submit"
              size="xs_normal"
              className="py-2 px-6 w-full"
              onClick={handleUpdateStatusProgress}
            >
              {isLoading ? "Please wait..." : "Update Progress bar"}
            </Button>
          </div>
        </form>
      </div>
    </ModalPreset>
  );
};

export default TaskProgressModal;
