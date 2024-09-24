import clsx from "clsx";
import Button from "@/components/Form/Button/button";
import PageProgressBar from "@/components/PageProgressBar/page-progress-bar";

const TaskStatusProgress = ({ percentage = 100 }) => {
  return (
    <div
      className="border border-[rgba(193,194,195,0.40)] rounded-lg bg-white px-4 pt-4 pb-6"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="flex items-center justify-between text-xs font-medium mb-8">
        <div className="space-y-1">
          <h6 className="text-black text-base">Task status progress bar</h6>
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
          <p className="text-text-label">January 23, 2024</p>
        </div>
      </div>
      <PageProgressBar
        breakpoints={[50]}
        percentage={percentage}
        className="mb-12"
      />
      <Button size="xs_medium" className="px-4 py-2 block ml-auto">
        Edit Status bar
      </Button>
    </div>
  );
};

export default TaskStatusProgress;
