// // "use client";

// // import { useEffect, useRef, useState } from "react";
// // import { createPortal } from "react-dom";
// // import { cn } from "@/lib/utils";
// // import { CheckCircle2, AlertCircle } from "lucide-react";
// // import { SuccessProgressIcon, WarningProgressIcon } from "@/public/icons/icons";

// // export interface ProgressCardStep {
// //   title: string;
// //   desc: string;
// //   type: "warning" | "success";
// // }

// // interface ProgressCardLoaderProps {
// //   loading: boolean;
// //   steps: ProgressCardStep[];
// //   className?: string;
// //   onClose?: () => void;
// // }

// // const ProgressCardLoader = ({
// //   loading,
// //   steps,
// //   className,
// //   onClose,
// // }: ProgressCardLoaderProps) => {
// //   const [mounted, setMounted] = useState(false);
// //   const [currentStep, setCurrentStep] = useState(0);
// //   const [visible, setVisible] = useState(false);
// //   const intervalRef = useRef<NodeJS.Timeout | null>(null);

// //   useEffect(() => {
// //     setMounted(true);
// //     return () => setMounted(false);
// //   }, []);

// //   // Handle step progression
// //   useEffect(() => {
// //     if (!mounted) return;
// //     if (loading) {
// //       setVisible(true);
// //       setCurrentStep(0);

// //       const stepDuration = 2000; // ms per step while loading
// //       intervalRef.current = setInterval(() => {
// //         setCurrentStep((prev) => {
// //           if (prev < steps.length - 1) {
// //             return prev + 1;
// //           }
// //           return prev;
// //         });
// //       }, stepDuration);
// //     } else {
// //       // stop interval and jump to last step
// //       if (intervalRef.current) clearInterval(intervalRef.current);
// //       setCurrentStep(steps.length - 1);
// //       setTimeout(() => setVisible(false), 1200); // small delay to show last step
// //     }

// //     return () => {
// //       if (intervalRef.current) clearInterval(intervalRef.current);
// //     };
// //   }, [loading, mounted, steps.length]);

// //   if (!mounted || !visible) return null;
// //   const target = typeof document !== "undefined" ? document.body : null;
// //   if (!target) return null;

// //   const step = steps[currentStep];
// //   const isSuccess = step?.type === "success";

// //   return createPortal(
// //     <div className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
// //       <div
// //         className={cn(
// //           "bg-white rounded-2xl shadow-lg md:w-[50%] sm:w-1/2 p-6 flex flex-col items-center gap-4 text-center",
// //           className
// //         )}
// //       >
// //         {isSuccess ? (
// //           <SuccessProgressIcon
// //             percentage={Math.round(((currentStep + 1) / steps.length) * 100)}
// //           />
// //         ) : (
// //           <WarningProgressIcon
// //             percentage={Math.round(((currentStep + 1) / steps.length) * 100)}
// //           />
// //         )}
// //         {/* TEXT CONTENTS */}
// //         <div className="flex flex-col gap-2">
// //           <h2 className="text-md font-semibold">{step?.title}</h2>
// //           <p className="text-sm font-normal"> → {step.desc} </p>
// //         </div>
// //         {/* PROGRESS */}
// //         <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
// //           <div
// //             className={cn(
// //               "h-2 transition-all duration-500 ease-out",
// //               isSuccess ? "bg-green-500" : "bg-yellow-500"
// //             )}
// //             style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
// //           />
// //         </div>

// //         {onClose && (
// //           <button
// //             onClick={onClose}
// //             className="absolute top-4 right-4 py-1 px-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
// //           >
// //             ×
// //           </button>
// //         )}
// //       </div>
// //     </div>,
// //     target
// //   );
// // };

// // export default ProgressCardLoader;

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { createPortal } from "react-dom";
// import { cn } from "@/lib/utils";
// import { CheckCircle2, AlertCircle } from "lucide-react";
// import { SuccessProgressIcon, WarningProgressIcon } from "@/public/icons/icons";

// export interface ProgressCardStep {
//   title: string;
//   desc: string;
//   type: "warning" | "success";
// }

// interface ProgressCardLoaderProps {
//   loading: boolean;
//   steps: ProgressCardStep[];
//   className?: string;
//   onClose?: () => void;
// }

// const ProgressCardLoader = ({
//   loading,
//   steps,
//   className,
//   onClose,
// }: ProgressCardLoaderProps) => {
//   const [mounted, setMounted] = useState(false);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [visible, setVisible] = useState(false);
//   const [isWaitingAtSecondToLast, setIsWaitingAtSecondToLast] = useState(false);
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);
//   const finalStepTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     setMounted(true);
//     return () => setMounted(false);
//   }, []);

//   // Handle step progression
//   useEffect(() => {
//     if (!mounted) return;

//     if (loading) {
//       setVisible(true);
//       setCurrentStep(0);
//       setIsWaitingAtSecondToLast(false);

//       const stepDuration = 2000; // ms per step while loading
//       intervalRef.current = setInterval(() => {
//         setCurrentStep((prev) => {
//           const nextStep = prev + 1;
//           // If we're about to reach the last step and loading is still true
//           if (nextStep >= steps.length - 1) {
//             setIsWaitingAtSecondToLast(true);
//             if (intervalRef.current) clearInterval(intervalRef.current);
//             return steps.length - 2; // Stay at second-to-last step
//           }
//           return nextStep;
//         });
//       }, stepDuration);
//     } else {
//       // Loading finished
//       if (intervalRef.current) clearInterval(intervalRef.current);

//       // Always show the last step when loading is false
//       setCurrentStep(steps.length - 1);
//       setIsWaitingAtSecondToLast(false);

//       // Show last step for 1 second before closing
//       finalStepTimeoutRef.current = setTimeout(() => {
//         setVisible(false);
//       }, 1000);
//     }

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//       if (finalStepTimeoutRef.current) clearTimeout(finalStepTimeoutRef.current);
//     };
//   }, [loading, mounted, steps.length]);

//   // Clean up timeouts on unmount
//   useEffect(() => {
//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//       if (finalStepTimeoutRef.current) clearTimeout(finalStepTimeoutRef.current);
//     };
//   }, []);

//   if (!mounted || !visible) return null;
//   const target = typeof document !== "undefined" ? document.body : null;
//   if (!target) return null;

//   const step = steps[currentStep];
//   const isSuccess = step?.type === "success";

//   return createPortal(
//     <div className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
//       <div
//         className={cn(
//           "bg-white rounded-2xl shadow-lg md:w-[50%] sm:w-1/2 p-6 flex flex-col items-center gap-4 text-center",
//           className
//         )}
//       >
//         {isSuccess ? (
//           <SuccessProgressIcon
//             percentage={Math.round(((currentStep + 1) / steps.length) * 100)}
//           />
//         ) : (
//           <WarningProgressIcon
//             percentage={Math.round(((currentStep + 1) / steps.length) * 100)}
//           />
//         )}
//         {/* TEXT CONTENTS */}
//         <div className="flex flex-col gap-2">
//           <h2 className="text-md md:text-lg font-semibold">{step?.title}</h2>
//           <p className="text-sm md:text-base font-normal"> → {step.desc} </p>
//         </div>
//         {/* PROGRESS */}
//         <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
//           <div
//             className={cn(
//               "h-2 transition-all duration-500 ease-out",
//               isSuccess ? "bg-green-500" : "bg-yellow-500"
//             )}
//             style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
//           />
//         </div>

//         {onClose && (
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 py-1 px-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
//           >
//             ×
//           </button>
//         )}
//       </div>
//     </div>,
//     target
//   );
// };

// export default ProgressCardLoader;

"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { SuccessProgressIcon, WarningProgressIcon } from "@/public/icons/icons";

export interface ProgressCardStep {
  title: string;
  desc: string;
  type: "warning" | "success";
}

interface ProgressCardLoaderProps {
  loading: boolean;
  steps: ProgressCardStep[];
  className?: string;
  onClose?: () => void;
}

const ProgressCardLoader = ({
  loading,
  steps,
  className,
  onClose,
}: ProgressCardLoaderProps) => {
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isWaitingAtSecondToLast, setIsWaitingAtSecondToLast] = useState(false);
  const [stepProgress, setStepProgress] = useState(0); // New state for individual step progress
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null); // New ref for progress animation
  const finalStepTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Function to animate step progress from 0 to 100
  const animateStepProgress = () => {
    setStepProgress(0);
    const progressDuration = 2000; // Same as stepDuration
    const progressInterval = 50; // Update every 50ms for smooth animation
    const progressIncrement = (100 / progressDuration) * progressInterval;

    progressIntervalRef.current = setInterval(() => {
      setStepProgress((prev) => {
        const newProgress = prev + progressIncrement;
        if (newProgress >= 100) {
          if (progressIntervalRef.current)
            clearInterval(progressIntervalRef.current);
          return 100;
        }
        return newProgress;
      });
    }, progressInterval);
  };

  // Handle step progression
  useEffect(() => {
    if (!mounted) return;

    if (loading) {
      setVisible(true);
      setCurrentStep(0);
      setIsWaitingAtSecondToLast(false);
      animateStepProgress(); // Start progress animation for first step

      const stepDuration = 2000; // ms per step while loading
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          const nextStep = prev + 1;
          // If we're about to reach the last step and loading is still true
          if (nextStep >= steps.length - 1) {
            setIsWaitingAtSecondToLast(true);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return steps.length - 2; // Stay at second-to-last step
          }
          // Start progress animation for the next step
          animateStepProgress();
          return nextStep;
        });
      }, stepDuration);
    } else {
      // Loading finished
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);

      // Always show the last step when loading is false
      setCurrentStep(steps.length - 1);
      setIsWaitingAtSecondToLast(false);
      setStepProgress(100); // Set final step to 100% immediately

      // Show last step for 1 second before closing
      finalStepTimeoutRef.current = setTimeout(() => {
        setVisible(false);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
      if (finalStepTimeoutRef.current)
        clearTimeout(finalStepTimeoutRef.current);
    };
  }, [loading, mounted, steps.length]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
      if (finalStepTimeoutRef.current)
        clearTimeout(finalStepTimeoutRef.current);
    };
  }, []);

  if (!mounted || !visible) return null;
  const target = typeof document !== "undefined" ? document.body : null;
  if (!target) return null;

  const step = steps[currentStep];
  const isSuccess = step?.type === "success";

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={cn(
          "bg-white rounded-2xl shadow-lg md:w-[50%] sm:w-1/2 p-6 flex flex-col items-center gap-4 text-center",
          className
        )}
      >
        {isSuccess ? (
          <SuccessProgressIcon
            percentage={Math.round(stepProgress)} // Use stepProgress instead of overall progress
          />
        ) : (
          <WarningProgressIcon
            percentage={Math.round(stepProgress)} // Use stepProgress instead of overall progress
          />
        )}
        {/* TEXT CONTENTS */}
        <div className="flex flex-col gap-2">
          <h2 className="text-md md:text-lg font-semibold">{step?.title}</h2>
          <p className="text-sm md:text-base font-normal"> → {step.desc} </p>
        </div>
        {/* PROGRESS */}
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-2 transition-all duration-500 ease-out",
              isSuccess ? "bg-green-500" : "bg-yellow-500"
            )}
            style={{ width: `${stepProgress}%` }} // Use stepProgress for progress bar width
          />
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 py-1 px-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
          >
            ×
          </button>
        )}
      </div>
    </div>,
    target
  );
};

export default ProgressCardLoader;
