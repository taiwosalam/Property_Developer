// Types
import clsx from "clsx";
import type {
  SectionDescProps,
  SectionTitleProps,
  SectionHeadingProps,
  SectionProps,
} from "./types";

export const SectionTitle: React.FC<SectionTitleProps> = ({
  children,
  required,
}) => (
  <div className="flex gap-[2px] text-base font-medium">
    {required && <span className="text-status-error-primary">*</span>}
    <p className="text-text-quaternary capitalize">{children}</p>
  </div>
);

export const SectionDesc: React.FC<SectionDescProps> = ({ children }) => (
  <p className="text-text-disabled text-sm font-normal">{children}</p>
);

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  children,
  required,
}) => (
  <div className="custom-flex-col gap-[2px]">
    {title && <SectionTitle required={required}>{title}</SectionTitle>}
    <SectionDesc>{children}</SectionDesc>
  </div>
);

export const SectionSeparator: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div
    className={clsx("h-[1px] w-full bg-borders-dark opacity-10", className)}
  />
);

export const Section: React.FC<SectionProps> = ({
  children,
  separatorStyles,
}) => (
  <div className="custom-flex-col gap-6">
    {children}
    <SectionSeparator className={separatorStyles} />
  </div>
);
