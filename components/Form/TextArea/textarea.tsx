"use client";
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
import { UndoIcon, RedoIcon, AiIcon } from "@/public/icons/icons";
import { toast } from "sonner";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import AIPopOver from "./text-area-popover";

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
  minChar,
  ai,
}) => {
  const { handleInputChange } = useContext(FlowProgressContext);
  const [mounted, setMounted] = useState(false);
  const quillRef = useRef<ReactQuill>(null);
  const [editorValue, setEditorValue] = useState(defaultValue);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showPopover, setShowPopover] = useState(false);

  const handleChange = (content: string) => {
    setEditorValue(content); // Update editorValue state
    if (onChange) {
      setShowPopover(true);
      onChange(content);
    }

    // Clear previous timeout if typing continues
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set a new timeout to check minChar after user stops typing
    const newTimeout = setTimeout(() => {
      if(minChar && content.length >= minChar ){
        setShowPopover(true);
      }
    }, 1000); 

    setTypingTimeout(newTimeout); // Store the new timeout
    setShowPopover(false);
  };

    // Function to simulate typing effect
    const simulateTyping = (content: string) => {
      let i = 0;
      const intervalId = setInterval(() => {
        setEditorValue((prevValue) => prevValue + content[i]);
        i += 1;
        if (i >= content.length) {
          clearInterval(intervalId); // Clear the interval once all characters are added
        }
      }, 50); // Adjust typing speed here (50ms between characters)
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
      <div className="flex flex-col dark:border dark:border-darkText-1 dark:rounded-lg">
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
              className={clsx("react-quill-hidden-input", hiddenInputClassName)}
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
                className="hover:text-[#06c] dark:text-neutral-4"
                onClick={handleUndo}
                aria-label="Undo"
              >
                <UndoIcon />
              </button>
              <button
                type="button"
                className="hover:text-[#06c] dark:text-neutral-4"
                onClick={handleRedo}
                aria-label="Redo"
              >
                <RedoIcon />
              </button>
                <AIPopOver
                  editorValue={editorValue as string}
                  setEditorValue={setEditorValue}
                  autoPop={showPopover}
                />
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default TextArea;
