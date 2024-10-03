import Link from "next/link";

// Types
import type { ButtonProps } from "./types";

// Imports

import clsx from "clsx";
import { button_variants } from "./data";

const Button: React.FC<ButtonProps> = ({
  href,
  style,
  children,
  className,
  size = "default",
  variant = "default",
  ...props
}) => {
  return href ? (
    <Link
      href={href}
      className={clsx(
        "rounded-[4px] capitalize flex items-center text-center",
        button_variants.size[size],
        button_variants.variant[variant],
        className
      )}
      style={style}
    >
      {children}
    </Link>
  ) : (
    <button
      className={clsx(
        "rounded-[4px] capitalize",
        button_variants.size[size],
        button_variants.variant[variant],
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
