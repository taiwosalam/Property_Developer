// Types
import type { LabelProps } from "./types";

const Label: React.FC<LabelProps> = ({
  id,
  children,
  important = false,
  className,
}) => {
  return (
    <label
      htmlFor={id}
      className={`text-base font-medium capitalize text-text-label ${className}`}
    >
      {important && <span className="text-status-error-primary">*</span>}
      {children}
    </label>
  );
};

export default Label;
