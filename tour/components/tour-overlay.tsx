import React, { useEffect, useRef } from "react";
import { TourStep } from "../types";

interface TourOverlayProps {
  step: TourStep;
  isFirstStep: boolean;
  targetRect: DOMRect | null;
}

const TourOverlay: React.FC<TourOverlayProps> = ({
  step,
  isFirstStep,
  targetRect,
}) => {
  return (
    <div
      className="fixed inset-0 z-[10001]"
      role="presentation"
      aria-hidden="true"
    >
      {step.target === "body" ? (
        <div className="absolute inset-0 bg-black/20" />
      ) : targetRect ? (
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
            fill="rgba(0, 0, 0, 0.20)" // Darker 20% opacity
            mask="url(#cutout-mask)"
          />
        </svg>
      ) : null}
      {step.target !== "body" && targetRect && (
        <div
          className="absolute bg-transparent border-2 border-blue-500 shadow-lg"
          style={{
            top: `${targetRect.top - 4}px`,
            left: `${targetRect.left - 4}px`,
            width: `${targetRect.width + 8}px`,
            height: `${targetRect.height + 8}px`,
            animation:
              step.disableBeacon && isFirstStep
                ? "pulse 1.5s infinite"
                : "none",
          }}
        />
      )}
      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default TourOverlay;





// interface TourOverlayProps {
//   step: TourStep;
//   isFirstStep: boolean;
//   targetRect: DOMRect;
// }

// const TourOverlay: React.FC<TourOverlayProps> = ({
//   step,
//   isFirstStep,
//   targetRect,
// }) => {
//   const overlayRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!overlayRef.current) return;

//     const overlay = overlayRef.current;
//     const isInteractiveStep = step.isInteractive === true;

//     if (isFirstStep || step.target === "body") {
//       // Full-screen overlay for welcome step
//       overlay.style.background = "rgba(0, 0, 0, 0.5)";
//       overlay.style.pointerEvents = "auto";
//     } else if (isInteractiveStep) {
//       // Allow clicks on interactive target
//       overlay.style.background = "transparent";
//       overlay.style.pointerEvents = "none";
//       const target = document.querySelector(step.target);
//       if (target) {
//         target.style.position = "relative";
//         target.style.zIndex = "10003"; // Above overlay
//         console.log(`TourOverlay: Enabling clicks for ${step.target}`);
//       }
//     } else {
//       // Highlight target with cutout
//       overlay.style.background = "rgba(0, 0, 0, 0.5)";
//       overlay.style.pointerEvents = "auto";
//       const padding = 10;
//       const highlightStyle = `
//         box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5),
//                     inset 0 0 0 2px #fff;
//         position: absolute;
//         top: ${targetRect.top - padding}px;
//         left: ${targetRect.left - padding}px;
//         width: ${targetRect.width + padding * 2}px;
//         height: ${targetRect.height + padding * 2}px;
//         border-radius: 4px;
//         pointer-events: none;
//       `;
//       overlay.innerHTML = `<div style="${highlightStyle}"></div>`;
//     }

//     return () => {
//       overlay.innerHTML = "";
//       const target = document.querySelector(step.target);
//       if (target) {
//         target.style.position = "";
//         target.style.zIndex = "";
//       }
//     };
//   }, [step, isFirstStep, targetRect]);

//   return (
//     <div
//       ref={overlayRef}
//       className="fixed inset-0 z-[10002]"
//       style={{ pointerEvents: "auto" }}
//     />
//   );
// };

// export default TourOverlay;
