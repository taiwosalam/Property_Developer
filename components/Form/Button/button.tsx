import Link from "next/link";

// Types
import type { ButtonProps } from "./types";

// Imports

import { cn } from "@/lib/utils";
import { button_variants } from "./data";

const Button: React.FC<ButtonProps> = ({
  href,
  style,
  children,
  className,
  size = "default",
  variant = "default",
  onClick,
  blankPage,
  ...props
}) => {
  return href ? (
    <Link
      href={href}
      className={cn(
        "rounded-[4px] h-[44px] capitalize flex items-center text-center",
        button_variants.size[size],
        button_variants.variant[variant],
        className
      )}
      target={blankPage ? "_blank" : undefined}
      style={style}
      onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
    >
      {children}
    </Link>
  ) : (
    <button
      type="button"
      className={cn(
        "rounded-[4px] capitalize h-[44px]",
        button_variants.size[size],
        button_variants.variant[variant],
        className
      )}
      style={style}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
