"use client";

import { useEffect, useRef, createContext, useCallback, useState } from "react";

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
  requiredFields, // New optional prop
}) => {
  const progress = useRef(0);
  const barRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canSubmit, setCanSubmit] = useState(false);

  const handleInputChange = useCallback(() => {
    // console.log("as");
    const selector = inputClassName ? `.${inputClassName}` : "input";
    const inputs = Array.from(
      containerRef.current?.querySelectorAll(selector) || []
    ) as (HTMLInputElement | HTMLTextAreaElement)[];

    const stepValue = 100 / inputs.length;
    // Update the filter condition to account for Quill empty values
    const filledInputs = inputs.filter((input) => {
      const value = input.value.trim();

      // Handle PhoneInput by checking if the value contains only the country code (e.g., "+234")
      if (input.type === "tel") {
        // Adjust this condition based on your country code logic
        return value.length > 4; // Exclude inputs that only have the country code (e.g., +234)
      }

      return value && value !== "<p><br></p>" && value !== "<p></p>";
    });
    progress.current = filledInputs.length * stepValue;
    gsap.to(barRef.current, {
      width: `${progress.current}%`,
      ease: "expo.out",
    });

    // Check if all required fields are filled
    const allRequired = inputs.filter((input) => {
      // Select inputs that either have the 'required' class or match a name in requiredFields
      return (
        input.classList.contains("required") ||
        (requiredFields && requiredFields.includes(input.name))
      );
    });

    const allRequiredFilled = allRequired.every(
      (input) => input.value.trim() !== ""
    );

    setCanSubmit(allRequiredFilled);
    // console.log("Setting canSubmit to: ", allRequiredFilled);
  }, [inputClassName, requiredFields]);

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
    <FlowProgressContext.Provider
      value={{ handleInputChange, canSubmit: canSubmit }}
    >
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
