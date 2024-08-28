"use client";
import { useEffect, useRef, useState } from "react";
// Types
import type { TextAreaProps } from "./types";

// Imports
import clsx from "clsx";
import Label from "../Label/label";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextArea: React.FC<TextAreaProps> = ({
  id,
  label,
  value,
  required,
  className,
  placeholder,
  initialValue,
  onChange,
  textAreaStyles,
}) => {
  // Reference to the input element

  const quillRef = useRef<ReactQuill>(null);
  const [editorClass, setEditorClass] = useState<string>("");
  const handleChange = (content: string) => {
    if (onChange) {
      onChange(content);
    }
  };

  // Set the input's "value" to an "initial value" when component mounts or when initialValue changes
  useEffect(() => {
    if (initialValue !== undefined && onChange != undefined) {
      onChange(initialValue);
    }
  }, [initialValue, onChange]);

  useEffect(() => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      const updateBackground = () => {
        const content = editor.getText().trim();
        if (content) {
          setEditorClass("quill-editor-content-filled");
        } else {
          setEditorClass("");
        }
      };

      // Update the background when the content changes
      editor.on("text-change", updateBackground);

      // Initial check for the existing content
      updateBackground();

      // Cleanup
      return () => {
        editor.off("text-change", updateBackground);
      };
    }
  }, [value]);

  return (
    <div className={clsx("custom-flex-col gap-2", className)}>
      {/* Render the label if provided */}
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
        {/* Custom toolbar container */}
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
