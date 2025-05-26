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
  const handleKeyPressSend = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) form.requestSubmit();
    }
  };

  return (
    <textarea
      name={name}
      id={id}
      value={value}
      placeholder={placeholder}
      onKeyDown={handleKeyPressSend}
      onChange={onChange}
      className={cn(
        "w-full px-2 py-1 border border-solid border-[#C1C2C366] bg-neutral-3 outline-brand-9 max-h-[80px] rounded-[4px] overflow-y-auto custom-round-scrollbar",
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
