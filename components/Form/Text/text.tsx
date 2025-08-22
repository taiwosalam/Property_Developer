import React from "react";
import type { TextProps } from "./types";
import { cn } from "@/lib/utils";
import { text_variants } from "./data";

const Text: React.FC<TextProps> = ({
  as: Component = "p",
  size = "default",
  variant = "default",
  className,
  children,
  ...props
}) => {
  return (
    <Component
      className={cn(
        "leading-[1.5] sm:leading-[1.6] lg:leading-[1.7]",
        text_variants.size[size],
        text_variants.variant[variant],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Text;
