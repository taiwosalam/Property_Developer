// Types
import type { ButtonProps } from "./types";

// Imports

import clsx from "clsx";
import { button_variants } from "./data";

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  size = "default",
  variant = "default",
  ...props
}) => {
  return (
    <button
      className={clsx(
        "rounded-[4px] capitalize",
        button_variants.size[size],
        button_variants.variant[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
