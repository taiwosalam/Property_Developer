import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { TextAreaProps } from "./types";
import clsx from "clsx";
import Label from "../Label/label";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

// Dynamically import ReactQuill with SSR option set to false
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const TextArea: React.FC<TextAreaProps> = ({
  id,
  label,
  value,
  required,
  className,
  placeholder,
  onChange,
  textAreaStyles,
}) => {
  const quillRef = useRef<ReactQuill | null>(null);
  const [editorClass, setEditorClass] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  const handleChange = (content: string) => {
    if (onChange) {
      onChange(content.trim());
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={clsx("custom-flex-col gap-2", className)}>
      {label && (
        <Label id={id} required={required}>
          {label}
        </Label>
      )}
      <div className="flex flex-col">
        <ReactQuill
          ref={quillRef}
          id={id}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={clsx("quill-editor", textAreaStyles, editorClass)}
          modules={{
            toolbar: {
              container: "#toolbar",
            },
          }}
        />
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
