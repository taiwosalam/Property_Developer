import {
  useEffect,
  useState,
  useContext,
  useRef,
  RefObject,
  Fragment,
} from "react";
import dynamic from "next/dynamic";
import type { TextAreaProps } from "./types";
import clsx from "clsx";
import Label from "../Label/label";
import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";
import ReactQuill, { type ReactQuillProps } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UndoIcon, RedoIcon } from "@/public/icons/icons";

// Dynamically import ReactQuill with SSR option set to false
const DynamicReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    const Component = ({
      forwardedRef,
      ...props
    }: { forwardedRef: RefObject<ReactQuill> } & ReactQuillProps) => (
      <RQ ref={forwardedRef} {...props} />
    );

    Component.displayName = "ReactQuillComponent";
    return Component;
  },
  {
    ssr: false,
  }
);

const TextArea: React.FC<TextAreaProps> = ({
  id,
  hiddenInputClassName,
  label,
  value,
  required,
  className,
  defaultValue,
  placeholder,
  inputSpaceClassName,
  onChange,
  resetKey,
  requiredNoStar,
}) => {
  const { handleInputChange } = useContext(FlowProgressContext);
  const [mounted, setMounted] = useState(false);
  const quillRef = useRef<ReactQuill>(null);
  const [editorValue, setEditorValue] = useState(defaultValue);

  const handleChange = (content: string) => {
    setEditorValue(content); // Update editorValue state
    if (onChange) {
      onChange(content);
    }
  };

  // Handle undo and redo
  const handleUndo = () => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      editor.history.undo();
    }
  };

  const handleRedo = () => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      editor.history.redo();
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // For Flow Progress
  useEffect(() => {
    handleInputChange && handleInputChange();
  }, [handleInputChange, editorValue]);

  useEffect(() => {
    setEditorValue(value || defaultValue);
  }, [value, defaultValue, resetKey]);

  return (
    <div className={clsx("custom-flex-col gap-2", className)}>
      {label && (
        <Label id={id} required={required}>
          {label}
        </Label>
      )}
      <div className="flex flex-col">
        {mounted && (
          <Fragment>
            <DynamicReactQuill
              forwardedRef={quillRef}
              value={editorValue}
              onChange={handleChange}
              placeholder={placeholder}
              className={clsx("quill-editor", inputSpaceClassName)}
              modules={{
                toolbar: {
                  container: `#toolbar-${id}`,
                },
                history: {
                  delay: 2000,
                  maxStack: 500,
                  userOnly: true,
                },
              }}
            />
            <input
              type="hidden"
              name={id}
              id={id}
              value={editorValue || ""}
              required={required || requiredNoStar}
              className={clsx("react-quill-hidden-input dark:bg-darkText-primary dark:border dark:border-[#2A2B26] dark:text-black", hiddenInputClassName)}
            />
            {/* Hidden input field */}

            <div
              id={`toolbar-${id}`}
              className="quill-toolbar bg-[#F3F6F9] dark:bg-darkText-primary dark:text-black max-w-full"
            >
              <select className="ql-header" defaultValue="">
                <option value="">Paragraph</option>
                <option value="1">Header 1</option>
                <option value="2">Header 2</option>
              </select>
              <button type="button" className="ql-bold">
                Bold
              </button>
              <button type="button" className="ql-italic">
                Italic
              </button>
              <button type="button" className="ql-underline">
                Underline
              </button>
              <button type="button" className="ql-list" value="ordered">
                Ordered List
              </button>
              <button type="button" className="ql-list" value="bullet">
                Bullet List
              </button>
              <button type="button" className="ql-align" value="">
                Align Left
              </button>
              <button type="button" className="ql-align" value="center">
                Align Center
              </button>
              <button type="button" className="ql-align" value="right">
                Align Right
              </button>
              <button type="button" className="ql-link">
                Link
              </button>
              <button type="button" className="ql-blockquote">
                Blockquote
              </button>
              <button
                type="button"
                className="hover:text-[#06c]"
                onClick={handleUndo}
                aria-label="Undo"
              >
                <UndoIcon />
              </button>
              <button
                type="button"
                className="hover:text-[#06c]"
                onClick={handleRedo}
                aria-label="Redo"
              >
                <RedoIcon />
              </button>
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default TextArea;
