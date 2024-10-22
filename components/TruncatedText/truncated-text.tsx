"use client";
import { useState, useRef, useEffect, ReactNode } from "react";
import clsx from "clsx";

interface TruncatedTextProps {
  children: ReactNode;
  lines?: number;
  className?: string;
  disableShowLess?: boolean;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
  children,
  lines = 2,
  className,
  disableShowLess = false,
}) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkIfTruncated = () => {
      if (textRef.current) {
        const { clientHeight, scrollHeight } = textRef.current;
        // Check if text is truncated by comparing clientHeight and scrollHeight
        setIsTruncated(scrollHeight > clientHeight);
      }
    };

    checkIfTruncated();
    window.addEventListener("resize", checkIfTruncated);
    return () => window.removeEventListener("resize", checkIfTruncated);
  }, []);

  const handleToggle = () => {
    setShowFullText(!showFullText);
  };

  return (
    <div className={className}>
      <p
        ref={textRef}
        className={clsx("overflow-hidden", {
          "line-clamp": !showFullText, // Add "line-clamp" class conditionally based on state
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
      </p>
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
