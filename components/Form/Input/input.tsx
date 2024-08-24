"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";

// Types
import type { InputProps } from "./types";

// Images
import EyeHide from "@/public/icons/eye-hide.svg";
import EyeShow from "@/public/icons/eye-show.svg";

// Imports
import clsx from "clsx";
import Label from "../Label/label";

const Input: React.FC<InputProps> = ({
  id,
  label,
  placeholder,
  type = "text",
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputTypeChange = () => {
    setIsPasswordVisible((prev) => !prev);
    if (inputRef.current) {
      inputRef.current.type = isPasswordVisible ? "password" : "text";
    }
  };

  return (
    <div className="custom-flex-col gap-2">
      {label && <Label id={id}>{label}</Label>}
      <div className="relative flex items-center">
        <input
          id={id}
          name={id}
          ref={inputRef}
          type={type === "password" && isPasswordVisible ? "text" : type}
          placeholder={placeholder}
          className={clsx(
            "p-3 rounded-[4px] w-full focus:outline-brand-primary border border-solid bg-neutral-2",
            {
              "pr-11": type === "password",
            }
          )}
          style={{ borderColor: "rgba(186, 199, 213, 0.50)" }}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={handleInputTypeChange}
            className="absolute p-1 bg-neutral-2 right-3"
            aria-label="Toggle password visibility"
          >
            <Image
              src={isPasswordVisible ? EyeHide : EyeShow}
              alt="Toggle visibility"
              height={21}
            />
          </button>
        )}
      </div>
      {/* NOTE: Hide this when conditions are met */}
      <p className="text-sm text-red-500 font-medium">Error messages go here</p>
    </div>
  );
};

export default Input;
