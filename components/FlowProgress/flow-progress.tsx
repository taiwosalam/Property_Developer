"use client";

import { useEffect, useRef, createContext, useCallback } from "react";

// Types
import type { FlowProgressProps } from "./types";

// Imports
import gsap from "gsap";
import FlowProgressBar from "./flow-progress-bar";

export const FlowProgressContext = createContext<Record<string, any>>({});

const FlowProgress: React.FC<FlowProgressProps> = ({
  steps,
  style,
  children,
  className,
  activeStep,
  inputClassName, // New optional prop
}) => {
  const progress = useRef(0);
  const barRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleInputChange = useCallback(() => {
    console.log("as");
    const selector = inputClassName ? `.${inputClassName}` : "input";
    const inputs = Array.from(
      containerRef.current?.querySelectorAll(selector) || []
    );
    console.log(inputs.map((i) => i.value));

    const stepValue = 100 / inputs.length;
    const filledInputs = inputs.filter((input) => input.value.trim());
    progress.current = filledInputs.length * stepValue;
    gsap.to(barRef.current, {
      width: `${progress.current}%`,
      ease: "expo.out",
    });
  }, [inputClassName]);

  useEffect(() => {
    const selector = inputClassName ? `.${inputClassName}` : "input";
    const inputs = Array.from(
      containerRef.current?.querySelectorAll(selector) || []
    );
    handleInputChange();

    // Invoke the passed callback function when input changes
    inputs.forEach((input) => {
      input.addEventListener("input", handleInputChange);
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("input", handleInputChange);
      });
    };
  }, [activeStep, handleInputChange, inputClassName]);

  return (
    <FlowProgressContext.Provider value={{ handleInputChange }}>
      <div ref={containerRef} className={className}>
        <div className="flex gap-[10px]" style={style}>
          {Array(steps)
            .fill(null)
            .map((_, index) => (
              <FlowProgressBar
                key={index}
                complete={activeStep > index}
                ref={activeStep === index ? barRef : undefined}
                bg_color="#D9D9D9"
                // bg_color="#EFF6FF"
              />
            ))}
        </div>
        {children}
      </div>
    </FlowProgressContext.Provider>
  );
};

export default FlowProgress;
