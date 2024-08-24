import React from "react";

// Types
import type { FlowProgressBarProps } from "./types";
import clsx from "clsx";

const FlowProgressBar = React.forwardRef<HTMLDivElement, FlowProgressBarProps>(
  ({ complete, bg_color = "#a4a7b0", bar_color = "#01ba4c" }, ref) => {
    return (
      <div
        className="flex-1 h-1 rounded-full overflow-hidden"
        style={{ backgroundColor: bg_color }}
      >
        <div
          ref={ref}
          className={clsx("h-full", {
            "w-0": !complete,
            "w-full": complete,
          })}
          style={{ backgroundColor: bar_color }}
        ></div>
      </div>
    );
  }
);

FlowProgressBar.displayName = "FlowProgressBar";

export default FlowProgressBar;
