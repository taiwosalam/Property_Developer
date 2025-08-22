import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";
import useDarkMode from "@/hooks/useCheckDarkMode";

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  fillColor: string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, fillColor, ...props }, ref) => {
  const isDarkMode = useDarkMode()
  return (
    <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-1 w-full overflow-hidden rounded-full",
        className
      )}
      style={{ backgroundColor: isDarkMode ? '#eee' : "#1C1D2214" }}
      {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 transition-all"
      style={{
        backgroundColor: fillColor,
        transform: `translateX(-${100 - (value || 0)}%)`,
      }}
    />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
