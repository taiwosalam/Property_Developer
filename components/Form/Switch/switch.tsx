import React from "react";

// Types
import type { SwitchProps } from "./types";
import clsx from "clsx";

const Switch: React.FC<SwitchProps> = ({
  state,
  checked,
  onClick,
  size = 20,
  spacing = 2,
}) => {
  const active = checked || state?.checked;

  return (
    <button
      onClick={onClick}
      className={clsx("flex items-center rounded-full", {
        "bg-status-success-primary justify-end": active,
        "bg-[#F1F2F4] justify-start": !active,
      })}
      style={{
        padding: spacing,
        width: (size + spacing) * 2,
      }}
    >
      <div
        className="rounded-full bg-white"
        style={{ width: size, height: size }}
      ></div>
    </button>
  );
};

export default Switch;
