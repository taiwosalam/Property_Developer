import React from "react";

// Types
import type { FlowProgressBarProps } from "./types";

// Imports
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
          className="h-full rounded-full"
          style={{
            backgroundColor: bar_color,
            width: complete ? "100%" : "0%",
          }}
        ></div>
      </div>
    );
  }
);

FlowProgressBar.displayName = "FlowProgressBar";

export default FlowProgressBar;
