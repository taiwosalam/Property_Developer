// Types
import Link from "next/link";
import clsx from "clsx";
import { cn } from "@/lib/utils";
import type {
  SectionDescProps,
  SectionTitleProps,
  SectionHeadingProps,
  SectionProps,
  SectionContainerProps,
} from "./types";
import SVG from "../SVG/svg";
import { CSSProperties } from "react";

export const SectionTitle: React.FC<SectionTitleProps> = ({
  children,
  required,
}) => (
  <div className="flex gap-[2px] text-xs md:text-sm lg:text-base font-medium">
    {required && <span className="text-status-error-primary">*</span>}
    <p className="text-text-quaternary dark:text-white">{children}</p>
  </div>
);

export const SectionDesc: React.FC<SectionDescProps> = ({ children }) => (
  <p className="text-text-disabled text-xs md:text-sm font-normal">
    {children}
  </p>
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

export const SectionSeparator: React.FC<{
  className?: string;
  direction?: "x" | "y";
  style?: CSSProperties;
}> = ({ className, direction = "x", style }) => (
  <div
    style={style}
    className={cn(
      "bg-[rgba(192,194,200,0.2)] separator",
      {
        "h-[1px] w-full": direction === "x",
        "w-[1px] h-full": direction === "y",
      },
      className
    )}
  />
);

export const Section: React.FC<SectionProps> = ({
  children,
  separatorStyles,
}) => (
  <div className={"custom-flex-col gap-6"}>
    {children}
    <SectionSeparator className={separatorStyles} />
  </div>
);

export const SectionContainer: React.FC<SectionContainerProps> = ({
  href,
  heading,
  children,
  style,
  className,
}) => (
  <div className={cn("custom-flex-col gap-4", className)}>
    <div className="flex items-center justify-between">
      <h1 className="text-text-primary text-xl font-medium capitalize dark:text-[#f1f1fd]" style={style}>
        {heading}
      </h1>
      {href && (
        <Link href={href} className="flex items-center gap-1">
          <p className="text-text-label text-base font-medium dark:text-[#f1f1fd]">
            See all
          </p>
          <SVG
            color="#5A5D61"
            type="right_arrow"
            className="w-4 flex justify-center"
          />
        </Link>
      )}
    </div>
    {children}
  </div>
);
