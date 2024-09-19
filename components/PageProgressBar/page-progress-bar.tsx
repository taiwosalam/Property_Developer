import clsx from "clsx";

// Types
import type { PageProgressBarProps } from "./types";

// Imports
import { sanitizeBreakpoints } from "./data";
import PageProgressBarBreakpoint from "./page-progress-bar-breakpoint";

const PageProgressBar: React.FC<PageProgressBarProps> = ({
  percentage = 0,
  breakpoints = [],
  className
}) => {
  const height = 5;
  const active_color = "#FFBB53";
  const disabled_color = "#C1C2C3";

  const points = sanitizeBreakpoints(breakpoints);

  return (
    <div className={clsx("px-2", className)}>
      <div className="relative w-full">
        <div style={{ height, backgroundColor: disabled_color }}>
          <div
            className="h-full rounded-tr-full rounded-br-full"
            style={{ width: `${percentage}%`, backgroundColor: active_color }}
          ></div>
        </div>
        <div className="absolute top-0 left-0 w-full">
          {points.map((point, index) => (
            <PageProgressBarBreakpoint
              key={index}
              width={height}
              percentage={point}
              activeColor={active_color}
              disabledColor={disabled_color}
              complete={point <= percentage && percentage !== 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageProgressBar;
