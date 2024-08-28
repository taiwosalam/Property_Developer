import Image from "next/image";

// Types
import Link from "next/link";
import clsx from "clsx";
import type {
  SectionDescProps,
  SectionTitleProps,
  SectionHeadingProps,
  SectionProps,
  SectionContainerProps,
} from "./types";
import SVG from "../SVG/svg";

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
    <SectionSeparator />
  </div>
);

export const SectionContainer: React.FC<SectionContainerProps> = ({
  href,
  heading,
  children,
}) => (
  <div className="custom-flex-col gap-4">
    <div className="flex items-center justify-between">
      <h1 className="text-text-primary text-xl font-medium capitalize">
        {heading}
      </h1>
      {href && (
        <Link href={href} className="flex items-center gap-1">
          <p className="text-text-label text-base font-medium">See all</p>
          <SVG
            color="#5A5D61"
            type="arrow_right"
            className="w-4 flex justify-center"
          />
        </Link>
      )}
    </div>
    {children}
  </div>
);
