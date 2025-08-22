import React from "react";

// Types
import type { PageProgressBarBreakpointProps } from "./types";

const PageProgressBarBreakpoint: React.FC<PageProgressBarBreakpointProps> = ({
  width,
  height = 11,
  complete,
  percentage,
  activeColor,
  disabledColor,
  completeColor,
  allComplete,
}) => {
  const active_text_color = "#0033C4";

  return (
    <div
      style={{ left: `${percentage}%` }}
      className="absolute custom-flex-col gap-1 -translate-x-2/4"
    >
      <div className="flex justify-center">
        <div
          style={{
            width: width / 1.3,
            height,
            backgroundColor: allComplete
              ? completeColor
              : complete
              ? activeColor
              : disabledColor,
          }}
        ></div>
      </div>
      <p
        className="text-sm font-medium"
        style={{ color: complete ? active_text_color : disabledColor }}
      >
        {percentage}%
      </p>
    </div>
  );
};

export default PageProgressBarBreakpoint;
