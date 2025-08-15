import React, { useRef } from "react";
import { cn } from "@/lib/utils";

export const MessageInput = ({
  className,
  placeholder,
  id,
  name,
  disabled,
  value,
  onChange,
}: {
  className?: string;
  placeholder: string;
  id: string;
  name: string;
  value?: string;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-expand height on every change (including Enter)
  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    // Reset height to recalculate
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 100) + "px";
    }
    // Pass value up
    if (onChange) onChange(e);
  };

  // If you want Ctrl+Enter to submit, handle here (optional)
  // const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  //   if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
  //     e.preventDefault();
  //     const form = e.currentTarget.form;
  //     if (form) form.requestSubmit();
  //   }
  // };

  return (
    <textarea
      ref={textareaRef}
      name={name}
      id={id}
      value={value}
      placeholder={placeholder}
      // onKeyDown={handleKeyDown} // Uncomment if you want Ctrl+Enter submit
      onChange={handleChange}
      className={cn(
        "w-full px-2 py-1 border-none max-h-[100px] rounded-[4px] overflow-y-auto custom-round-scrollbar",
        className
      )}
      disabled={disabled}
      style={{
        resize: "none",
        scrollBehavior: "smooth",
        scrollbarColor: "brand-9",
        msOverflowStyle: "none",
      }}
    ></textarea>
  );
};
