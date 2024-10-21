import React from "react";

// Import
import type { MessageProps } from "./types";
import clsx from "clsx";

const Message: React.FC<MessageProps> = ({
  text,
  time,
  type = "from user",
}) => {
  return (
    <div
      className={clsx("flex", {
        "justify-end": type === "from user",
      })}
    >
      <div
        className={clsx("py-2 px-4 flex gap-4 rounded-2xl max-w-[70%]", {
          "bg-brand-primary rounded-tr-none": type === "from user",
          "bg-status-caution-1 rounded-tl-none": type === "to user",
        })}
      >
        <p
          className={clsx("flex-1 text-sm font-normal", {
            "text-white": type === "from user",
            "text-text-quaternary": type === "to user",
          })}
        >
          {text}
        </p>
        <div className="flex items-end">
          <p
            className={clsx("text-[10px] font-normal", {
              "text-text-invert": type === "from user",
              "text-text-disabled": type === "to user",
            })}
          >
            {time}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Message;
