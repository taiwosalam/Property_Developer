import React from "react";
import { toast } from "sonner";

interface CopyTextProps {
  text: string;
  className?: string;
  color?: string;
}

const CopyText: React.FC<CopyTextProps> = ({ text, className,color }) => {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Text copied to clipboard!"))
      .catch((err) => toast.error("Failed to copy text: ", err));
  };

  return (
    <p
      onClick={handleCopy}
      className={className}
      style={{ cursor: "pointer", color: color ?? "blue", textDecoration: "underline" }}
      title="Click to copy"
    >
      {text}
    </p>
  );
};

export default CopyText;
