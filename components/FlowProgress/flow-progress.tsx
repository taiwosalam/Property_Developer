"use client";

import { useEffect, useRef, createContext, useCallback, useState } from "react";
import { z } from "zod";

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

  // Helper function to check if an input is filled
  const isInputFilled = (input: HTMLInputElement | HTMLTextAreaElement) => {
    let value = input.value.trim();

    if (input.type === "tel") {
      value = value.replace(/\s+/g, "");
      return value.length > 4;
    }

    if (input.type === "text" && input.classList.contains("date-input")) {
      const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
      return datePattern.test(value);
    }

    // Handle email input using Zod for validation
    if (input.type === "email") {
      const emailSchema = z.string().email();
      return emailSchema.safeParse(value).success;
    }

    return value && value !== "<p><br></p>" && value !== "<p></p>";
  };

  const handleInputChange = useCallback(() => {
    const selector = inputClassName ? `.${inputClassName}` : "input";
    const inputs = Array.from(
      containerRef.current?.querySelectorAll(selector) || []
    ) as (HTMLInputElement | HTMLTextAreaElement)[];

    const stepValue = 100 / inputs.length;
    const filledInputs = inputs.filter(isInputFilled);
    progress.current = filledInputs.length * stepValue;
    gsap.to(barRef.current, {
      width: `${progress.current}%`,
      ease: "expo.out",
    });

    // Check if all required fields are filled
    const allRequired = inputs.filter((input) => {
      return (
        input.classList.contains("required") ||
        (requiredFields && requiredFields.includes(input.name))
      );
    });
    const allRequiredFilled = allRequired.every(isInputFilled);
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
        <div className="flex gap-[10px] bg-white" style={style}>
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
