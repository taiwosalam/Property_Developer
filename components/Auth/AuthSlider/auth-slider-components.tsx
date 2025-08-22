"use client";

import React from "react";

// Types
import type { AuthSliderBarProps, AuthSliderContentprops } from "./types";

// Imports
import clsx from "clsx";

export const AuthSliderBar = React.forwardRef<
  HTMLDivElement,
  AuthSliderBarProps
>(({ active }, ref) => (
  <div
    ref={ref}
    className={clsx("w-1 h-5 rounded-lg", {
      "opacity-40 bg-transparent": !active,
      "bg-transparent flex-1": active,
    })}
  ></div>
));

AuthSliderBar.displayName = "AuthSliderBar";

export const AuthSliderContent = React.forwardRef<
  HTMLDivElement,
  AuthSliderContentprops
>(({ height, title, children }, ref) => (
  <div
    ref={ref}
    className="p-4 xl:p-5 custom-flex-col gap-3 justify-center opacity-0 dark"
    style={{ height }}
  >
    <p className="custom-primary-color text-3xl xl:text-4xl font-bold capitalize">
      {title}
    </p>
    <p className="text-text-secondary text-sm xl:text-base font-normal">
      {children}
    </p>
  </div>
));

AuthSliderContent.displayName = "AuthSliderContent";
