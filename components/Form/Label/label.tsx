// Types
import type { LabelProps } from "./types";

const Label: React.FC<LabelProps> = ({ id, required, children }) => {
  return (
    <label htmlFor={id} className="flex gap-[2px] text-xs md:text-sm lg:text-base font-medium">
      {required && <span className="text-status-error-primary">*</span>}
      <p className="text-text-label capitalize">{children}</p>
    </label>
  );
};

export default Label;
