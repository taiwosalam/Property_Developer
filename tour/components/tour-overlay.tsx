import React, { useEffect, useRef, useState } from "react";
import { TourStep } from "../types";

interface TourOverlayProps {
  step: TourStep;
  targetElement: Element | null;
}

const TourOverlay: React.FC<TourOverlayProps> = ({ step, targetElement }) => {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const updateRect = () => {
      if (targetElement && step.target !== "body") {
        const rect = targetElement.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setTargetRect(rect);
        } else {
          console.warn(`Target ${step.target} has zero dimensions`, rect);
        }
      } else {
        setTargetRect(null);
      }
      animationFrameRef.current = requestAnimationFrame(updateRect);
    };

    animationFrameRef.current = requestAnimationFrame(updateRect);

    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [targetElement, step.target]);

  if (!targetElement) return null;

  return (
    <div
      className="fixed inset-0 z-[10001]"
      role="presentation"
      aria-hidden="true"
    >
      {step.target === "body" ? (
        <div className="absolute inset-0 bg-black/20" />
      ) : targetRect ? (
        <>
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <mask id="cutout-mask">
                <rect width="100%" height="100%" fill="white" />
                <rect
                  x={targetRect.left - 4}
                  y={targetRect.top - 4}
                  width={targetRect.width + 8}
                  height={targetRect.height + 8}
                  fill="black"
                  rx="4"
                />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="rgba(0, 0, 0, 0.20)"
              mask="url(#cutout-mask)"
            />
          </svg>
          <div
            className="absolute bg-transparent border-2 border-brand-9 shadow-lg rounded"
            style={{
              top: `${targetRect.top - 4}px`,
              left: `${targetRect.left - 4}px`,
              width: `${targetRect.width + 8}px`,
              height: `${targetRect.height + 8}px`,
              pointerEvents: "none",
            }}
          />
        </>
      ) : null}
    </div>
  );
};

export default TourOverlay;