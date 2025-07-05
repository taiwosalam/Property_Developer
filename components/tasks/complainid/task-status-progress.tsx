import clsx from "clsx";
import Button from "@/components/Form/Button/button";
import PageProgressBar from "@/components/PageProgressBar/page-progress-bar";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import TaskProgressModal from "./task-progress-modal";

interface ITask {
  task_bar: {
    progress: string;
    text: string;
    approve_by: string;
    time: string;
    date: string;
  }[];
}
interface TaskStatusProgressProps {
  percentage?: number;
  taskStatus?: boolean
  date?: string;
  task_bar?: ITask;
  task?: {
    title: string;
    approve_by: string;
    date: string;
    time: string;
  };
}
const TaskStatusProgress = ({
  percentage = 50,
  date,
  task_bar,
  task,
  taskStatus
}: TaskStatusProgressProps) => {
  // updateProgressStatus
  return (
    <div
      className="border border-[rgba(193,194,195,0.40)] rounded-lg bg-white dark:bg-darkText-primary px-4 pt-4 pb-6"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="flex items-center justify-between text-xs font-medium mb-8">
        <div className="space-y-1">
          <h6 className="text-black text-base dark:text-white">
            Task status progress bar
          </h6>
          <p
            className={clsx(
              "text-xs",
              percentage === 100
                ? "text-status-success-primary"
                : "text-status-caution-2"
            )}
          >
            {`${
              percentage === 100 ? "Completed" : "Processing"
            } (${percentage}% done)`}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-neutral-4">Last updated:</p>
          <p className="text-text-label">{date}</p>
        </div>
      </div>
      <PageProgressBar
        breakpoints={[50]}
        percentage={percentage}
        className="mb-12"
      />
      <Modal>
        <ModalTrigger className="flex justify-end items-end ml-auto">
          <Button size="xs_medium" className="px-4 py-2 block ml-auto" disabled={taskStatus}>
            Edit Status bar
          </Button>
        </ModalTrigger>
        <ModalContent>
          <TaskProgressModal task_bar={task_bar?.task_bar || []} task={task} />
        </ModalContent>
      </Modal>
      {/* <Button size="xs_medium" className="px-4 py-2 block ml-auto">
        Edit Status bar
      </Button> */}
    </div>
  );
};

export default TaskStatusProgress;
