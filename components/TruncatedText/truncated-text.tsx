"use client";
import { useState, useRef, useEffect, ReactNode, useCallback } from "react";
import clsx from "clsx";

interface TruncatedTextProps {
  children: ReactNode;
  lines?: number;
  className?: string;
  disableShowLess?: boolean;
  as?: "p" | "span" | "div";
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
  children,
  lines = 2,
  className,
  disableShowLess = false,
  as: Component = "p",
}) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  const checkIfTruncated = useCallback(() => {
    if (textRef.current) {
      const { clientHeight, scrollHeight } = textRef.current;
      setIsTruncated(scrollHeight > clientHeight);
    }
  }, []);

  useEffect(() => {
    // Initial check after content is rendered
    checkIfTruncated();

    // Debounced resize handler
    let timeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(checkIfTruncated, 100); // Debounce by 100ms
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, [children, checkIfTruncated]); // Depend on children to re-check when content changes

  const handleToggle = () => {
    setShowFullText(!showFullText);
  };

  return (
    <div className={className}>
      <Component
        ref={textRef}
        className={clsx("overflow-hidden", {
          "line-clamp": !showFullText,
        })}
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: showFullText ? "unset" : lines,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {children}
      </Component>
      {isTruncated && !showFullText && (
        <button onClick={handleToggle} className="text-highlight mt-1">
          read more...
        </button>
      )}
      {!disableShowLess && showFullText && (
        <button
          type="button"
          onClick={handleToggle}
          className="text-highlight mt-1"
        >
          show less
        </button>
      )}
    </div>
  );
};

export default TruncatedText;
