"use client";

import React, { useState } from "react";

// Types
import type { SettingsServicesTagProps } from "./types";

// Imports
import clsx from "clsx";

const SettingsServicesTag: React.FC<SettingsServicesTagProps> = ({
  active,
  children,
}) => {
  const [clicked, setClicked] = useState<boolean>(!!active);

  return (
    <button
      onClick={() => setClicked((prev) => !prev)}
      className={clsx("py-3 px-4 rounded-[4px] group", {
        "bg-brand-1": clicked,
        "bg-[rgba(245,245,245,0.5)]": !clicked,
      })}
    >
      <p
        className={clsx("text-sm font-normal", {
          "text-brand-9": clicked,
          "text-[rgba(0,0,0,0.5)] group-hover:text-black duration-150":
            !clicked,
        })}
      >
        {children}
      </p>
    </button>
  );
};

export default SettingsServicesTag;
