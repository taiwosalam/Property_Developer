import { useEffect, useState, useContext } from "react";
import dynamic from "next/dynamic";
import type { TextAreaProps } from "./types";
import clsx from "clsx";
import Label from "../Label/label";
import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";
import "react-quill/dist/quill.snow.css";

// Dynamically import ReactQuill with SSR option set to false
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const TextArea: React.FC<TextAreaProps> = ({
  id,
  hiddenInputClassName,
  label,
  value,
  required,
  className,
  placeholder,
  inputSpaceClassName,
  onChange,
}) => {
  const { handleInputChange } = useContext(FlowProgressContext);
  const [mounted, setMounted] = useState(false);

  const [editorValue, setEditorValue] = useState(value || "");

  const handleChange = (content: string) => {
    const trimmedContent = content.trim();
    setEditorValue(trimmedContent); // Update editorValue state
    if (onChange) {
      onChange(trimmedContent);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // For Flow Progress
  useEffect(() => {
    handleInputChange && handleInputChange();
  }, [handleInputChange, editorValue]);

  return (
    <div className={clsx("custom-flex-col gap-2", className)}>
      {label && (
        <Label id={id} required={required}>
          {label}
        </Label>
      )}
      <div className="flex flex-col">
        {mounted && (
          <>
            <ReactQuill
              value={editorValue}
              onChange={handleChange}
              placeholder={placeholder}
              className={clsx("quill-editor", inputSpaceClassName)}
              modules={{
                toolbar: {
                  container: "#toolbar",
                },
              }}
            />
            <input
              type="hidden"
              name={id}
              id={id}
              value={editorValue || ""}
              className={hiddenInputClassName}
            />
            {/* Hidden input field */}
          </>
        )}
        <div id="toolbar" className="quill-toolbar bg-[#F3F6F9]">
          <button className="ql-bold">Bold</button>
          <button className="ql-italic">Italic</button>
          <button className="ql-underline">Underline</button>
          <button className="ql-list" value="ordered">
            Ordered List
          </button>
          <button className="ql-list" value="bullet">
            Bullet List
          </button>
          <button className="ql-align" value="">
            Align Left
          </button>
          <button className="ql-align" value="center">
            Align Center
          </button>
          <button className="ql-align" value="right">
            Align Right
          </button>
          <button className="ql-link">Link</button>
        </div>
      </div>
    </div>
  );
};

export default TextArea;
