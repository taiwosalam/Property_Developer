"use client";
import { useState } from "react";
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
  {
    label: "Assign Task",
    value: "Assign task",
  },
  {
    label: "Task Inspection",
    value: "Task inspection",
  },
  {
    label: "Create Maintenance",
    value: "Create maintenance",
  },
  {
    label: "Task Perfection",
    value: "Task perfection",
  },
  {
    label: "Rechecking of Task",
    value: "Rechecking of task",
  },
  {
    label: "Close Task",
    value: "Close task",
  },
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
}
const TaskProgressModal: React.FC<ITaskProgressModal> = ({
  task_bar,
  task,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const param = useParams();
  const id = param.complainId;

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

  const handleUpdateStatusProgress = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setIsLoading(true);
      const res = await updateProgressStatus(id as string, checkedTasks[0]);
      if (res) {
        toast.success("Status updated");
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

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
            <p className="text-text-tertiary dark:text-white">
              Caution Deposits Details:
            </p>
          </div>

          <div className="space-y-2 relative">
            {assignTaskCheckList.map((task) => {
              const matchedTaskBar = task_bar.find(
                (bar) => bar.text === task.value
              );
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
                  checked={checkedTasks.includes(task.value)}
                //   onChange={(checked: boolean) => { // this ensures no data is added twice
                //     setCheckedTasks((prev) =>
                //       checked
                //         ? prev.includes(task.value)
                //           ? prev
                //           : [...prev, task.value]
                //         : prev.filter((val) => val !== task.value)
                //     );
                //   }}
                  onChange={(checked: boolean) => {
                    setCheckedTasks(
                      (prev) =>
                        checked
                          ? prev.includes(task.value)
                            ? prev
                            : [...prev, task.value]
                          : prev // Prevent unchecking
                    );
                  }}
                >
                  {task.label}
                </Checkbox>
              );
            })}
          </div>
          <div className="space-y-5 w-full">
            <Button
              disabled={isLoading}
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
