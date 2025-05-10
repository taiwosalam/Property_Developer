// "use client";
// import {
//   useEffect,
//   useState,
//   useContext,
//   useRef,
//   RefObject,
//   Fragment,
// } from "react";
// import dynamic from "next/dynamic";
// import type { TextAreaProps } from "./types";
// import clsx from "clsx";
// import Label from "../Label/label";
// import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";
// import ReactQuill, { type ReactQuillProps } from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { UndoIcon, RedoIcon, } from "@/public/icons/icons";
// import AIPopOver from "./text-area-popover";
// import useTextGenerator from "@/hooks/useAIContentGenerator";
// import Typewriter from 'typewriter-effect';

// // Dynamically import ReactQuill with SSR option set to false
// const DynamicReactQuill = dynamic(
//   async () => {
//     const { default: RQ } = await import("react-quill");
//     const Component = ({
//       forwardedRef,
//       ...props
//     }: { forwardedRef: RefObject<ReactQuill> } & ReactQuillProps) => (
//       <RQ ref={forwardedRef} {...props} />
//     );

//     Component.displayName = "ReactQuillComponent";
//     return Component;
//   },
//   {
//     ssr: false,
//   }
// );

// const TextArea: React.FC<TextAreaProps> = ({
//   id,
//   hiddenInputClassName,
//   label,
//   value,
//   required,
//   className,
//   defaultValue,
//   placeholder,
//   inputSpaceClassName,
//   onChange,
//   resetKey,
//   requiredNoStar,
//   minChar,
//   ai,
// }) => {
//   const { handleInputChange } = useContext(FlowProgressContext);
//   const [mounted, setMounted] = useState(false);
//   const quillRef = useRef<ReactQuill>(null);
//   const [editorValue, setEditorValue] = useState(defaultValue);
//   const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
//   const [showPopover, setShowPopover] = useState(false);
//   const [showAiCreator, setShowAiCreator] = useState(false);
//   const [suggestions, setSuggestions] = useState("")
//   const [apiContentValue, setApiContentValue] = useState("");
//   const [showSuggestion, setShowSuggestion] = useState(false);
//   const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
//   const { content: apiContent, error: apiError, generateText, loading } = useTextGenerator();

//   const updateCursorPosition = () => {
//     const editor = quillRef.current?.getEditor();
//     if (editor) {
//       const range = editor.getSelection();
//       if (range) {
//         const bounds = editor.getBounds(range.index);
//         if (bounds) {
//           setCursorPosition({ top: bounds.top, left: bounds.left });
//         }
//       }
//     }
//   };

//   const handleChange = (content: string) => {
//     setEditorValue(content);
//     updateCursorPosition();
//     if (onChange) onChange(content);

//     if (typingTimeout) clearTimeout(typingTimeout);

//     const newTimeout = setTimeout(() => {
//       if (content && content.length >= 20) {
//         setShowSuggestion(true);
//       } else {
//         setShowSuggestion(false);
//       }
//     }, 1000);

//     setTypingTimeout(newTimeout);
//   };

//   // Handle undo and redo
//   const handleUndo = () => {
//     const editor = quillRef.current?.getEditor();
//     if (editor) {
//       editor.history.undo();
//     }
//   };

//   const handleRedo = () => {
//     const editor = quillRef.current?.getEditor();
//     if (editor) {
//       editor.history.redo();
//     }
//   };

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // For Flow Progress
//   useEffect(() => {
//     handleInputChange && handleInputChange();
//   }, [handleInputChange, editorValue]);

//   useEffect(() => {
//     setEditorValue(value || defaultValue);
//   }, [value, defaultValue, resetKey]);

//   return (
//     <div className={clsx("custom-flex-col gap-2", className)}>
//       {label && (
//         <Label id={id} required={required}>
//           {label}
//         </Label>
//       )}
//       <div className="flex flex-col dark:border dark:border-darkText-1 dark:rounded-lg relative">
//         {mounted && (
//           <Fragment>
//             <DynamicReactQuill
//               forwardedRef={quillRef}
//               value={editorValue}
//               onChange={handleChange}
//               placeholder={placeholder}
//               className={clsx("quill-editor", inputSpaceClassName)}
//               modules={{
//                 toolbar: {
//                   container: `#toolbar-${id}`,
//                 },
//                 history: {
//                   delay: 2000,
//                   maxStack: 500,
//                   userOnly: true,
//                 },
//               }}
//             />
//             <input
//               type="hidden"
//               name={id}
//               id={id}
//               value={editorValue || ""}
//               required={required || requiredNoStar}
//               className={clsx("react-quill-hidden-input", hiddenInputClassName)}
//             />

//             <div
//               id={`toolbar-${id}`}
//               className="quill-toolbar bg-[#F3F6F9] dark:bg-darkText-primary dark:text-black max-w-full"
//             >
//               <select className="ql-header" defaultValue="">
//                 <option value="">Paragraph</option>
//                 <option value="1">Header 1</option>
//                 <option value="2">Header 2</option>
//               </select>
//               <button type="button" className="ql-bold">
//                 Bold
//               </button>
//               <button type="button" className="ql-italic">
//                 Italic
//               </button>
//               <button type="button" className="ql-underline">
//                 Underline
//               </button>
//               <button type="button" className="ql-list" value="ordered">
//                 Ordered List
//               </button>
//               <button type="button" className="ql-list" value="bullet">
//                 Bullet List
//               </button>
//               <button type="button" className="ql-align" value="">
//                 Align Left
//               </button>
//               <button type="button" className="ql-align" value="center">
//                 Align Center
//               </button>
//               <button type="button" className="ql-align" value="right">
//                 Align Right
//               </button>
//               <button type="button" className="ql-link">
//                 Link
//               </button>
//               <button type="button" className="ql-blockquote">
//                 Blockquote
//               </button>
//               <button
//                 type="button"
//                 className="hover:text-[#06c] text-black dark:text-neutral-4"
//                 onClick={handleUndo}
//                 aria-label="Undo"
//               >
//                 <UndoIcon />
//               </button>
//               <button
//                 type="button"
//                 className="hover:text-[#06c] text-black dark:text-neutral-4"
//                 onClick={handleRedo}
//                 aria-label="Redo"
//               >
//                 <RedoIcon />
//               </button>
//               <AIPopOver
//                 editorValue={editorValue as string}
//                 setEditorValue={setEditorValue}
//                 showAiCreator={showAiCreator}
//                 setShowAiCreator={setShowAiCreator}
//                 // apiContentValue={apiContentValue}
//                 // setApiContentValue={setApiContentValue}
//               />
//             </div>
//           </Fragment>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TextArea;

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
import { UndoIcon, RedoIcon } from "@/public/icons/icons";
import AIPopOver from "./text-area-popover";
import useTextGenerator from "@/hooks/useAIContentGenerator";
import Typewriter from "typewriter-effect";
import { useMemo } from "react";

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
  restrictedWords = [],
  readOnly
}) => {
  const { handleInputChange } = useContext(FlowProgressContext);
  const [mounted, setMounted] = useState(false);
  const quillRef = useRef<ReactQuill>(null);
  const [editorValue, setEditorValue] = useState(defaultValue);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAiCreator, setShowAiCreator] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });

  const lowerCaseRestrictedWords = useMemo(
    () => restrictedWords.map((w) => w.toLowerCase()),
    [restrictedWords]
  );

  // Helper function to check for restricted words
  const checkForRestrictedWords = (htmlContent: string): string | null => {
    // Strip HTML tags and normalize whitespace
    const plainText = htmlContent
      .replace(/<[^>]+>/g, " ") // Remove HTML tags
      .toLowerCase()
      .replace(/[\r\n\s]+/g, " ") // Replace newlines and multiple spaces with single space
      .trim();

    // Split into words
    const words = plainText
      .split(" ")
      .filter((word) => word && word.length > 0);

    // Find restricted words
    const matchedWords = words.filter((word) =>
      lowerCaseRestrictedWords.includes(word)
    );


    if (matchedWords.length > 0) {
      const uniqueMatches = [...new Set(matchedWords)];
      const formattedWords = uniqueMatches.map((w) => `"${w}"`).join(", ");
      const message = `Please don’t include ${formattedWords} as it restricted`;
      return message;
    }

    return null;
  };

  const updateCursorPosition = () => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      const range = editor.getSelection();
      if (range) {
        const bounds = editor.getBounds(range.index);
        if (bounds) {
          setCursorPosition({ top: bounds.top, left: bounds.left });
        }
      }
    }
  };

  const handleChange = (
    content: string,
    delta: any,
    source: string,
    editor: any
  ) => {
    setEditorValue(content);
    updateCursorPosition();
    if (onChange) onChange(content);

    if (typingTimeout) clearTimeout(typingTimeout);
    const newTimeout = setTimeout(() => {
      if (content && content.length >= 20) {
        setShowSuggestion(true);
      } else {
        setShowSuggestion(false);
      }
    }, 1000);
    setTypingTimeout(newTimeout);

    // Check for restricted words on user input
    if (source === "user" && restrictedWords.length > 0) {
      const error = checkForRestrictedWords(content);
      setErrorMessage(error);
      if (error) {
        // Delay clearing the input to allow error message to render
        setTimeout(() => {
          if (onChange) {
            onChange("");
          }
        }, 100);
      }
    }
  };

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

  useEffect(() => {
    handleInputChange && handleInputChange();
  }, [handleInputChange, editorValue]);

  useEffect(() => {
    setEditorValue(value || defaultValue);
  }, [value, defaultValue, resetKey]);

  useEffect(() => {
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [typingTimeout]);

  return (
    <div className={clsx("custom-flex-col gap-2", className)}>
      {label && (
        <Label id={id} required={required}>
          {label}
        </Label>
      )}
      <div className="flex flex-col dark:border dark:border-darkText-1 dark:rounded-lg relative">
        {mounted && (
          <Fragment>
            <DynamicReactQuill
              readOnly={readOnly}
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
                className="hover:text-[#06c] text-black dark:text-neutral-4"
                onClick={handleUndo}
                aria-label="Undo"
              >
                <UndoIcon />
              </button>
              <button
                type="button"
                className="hover:text-[#06c] text-black dark:text-neutral-4"
                onClick={handleRedo}
                aria-label="Redo"
              >
                <RedoIcon />
              </button>
              <AIPopOver
                editorValue={editorValue as string}
                setEditorValue={setEditorValue}
                showAiCreator={showAiCreator}
                setShowAiCreator={setShowAiCreator}
              />
            </div>
          </Fragment>
        )}
      </div>
      {errorMessage && (
        <div
          style={{ color: "red", marginTop: "8px", fontSize: "14px" }}
          className="text-red-500 mt-2 text-sm"
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default TextArea;
