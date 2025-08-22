// Types
import type { LabelProps } from "./types";
import clsx from "clsx";

const Label: React.FC<LabelProps> = ({ id, required, children, labelclassName }) => {
  return (
    <label
      htmlFor={id}
      className={clsx(
        "flex gap-[2px] text-xs md:text-sm lg:text-base font-medium capitalize",
        labelclassName
      )}
    >
      {required && <span className="text-status-error-primary">*</span>}
      <p className="text-text-label dark:text-darkText-2">{children}</p>
    </label>
  );
};

export default Label;
