"use client";

import { useEffect, useRef, createContext, useCallback, useState } from "react";
import { z } from "zod";

// Types
import type { FlowProgressProps } from "./types";

// Imports
import gsap from "gsap";
import FlowProgressBar from "./flow-progress-bar";

interface FlowProgressContextType {
  handleInputChange: () => void;
  canSubmit: boolean;
}

export const FlowProgressContext = createContext<FlowProgressContextType>({
  handleInputChange: () => {},
  canSubmit: false,
});

const FlowProgress: React.FC<FlowProgressProps> = ({
  steps,
  style,
  children,
  className,
  activeStep,
  inputClassName,
  requiredFields,
  showProgressBar = true,
  images = [],
  imagesRequired = false,
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

    if (input.classList.contains("react-quill-hidden-input")) {
      return value && value !== "<p><br></p>" && value !== "<p></p>";
    }

    return value;
  };

  const handleInputChange = useCallback(() => {
    const selector = inputClassName ? `.${inputClassName}` : "input";
    const inputs = Array.from(
      containerRef.current?.querySelectorAll(selector) || []
    ) as (HTMLInputElement | HTMLTextAreaElement)[];

    const stepValue = 100 / inputs.length;
    const filledInputs = inputs.filter(isInputFilled);
    progress.current = filledInputs.length * stepValue;

    // Only animate the progress bar if it is shown
    if (showProgressBar) {
      gsap.to(barRef.current, {
        width: `${progress.current}%`,
        ease: "expo.out",
      });
    }

    // Check if all required fields are filled
    const allRequired = inputs.filter((input) => {
      return (
        input.classList.contains("required") ||
        input.hasAttribute("required") ||
        (requiredFields &&
          (requiredFields.includes(input.name) ||
            requiredFields.includes(input.id)))
      );
    });

    const allRequiredFilled = allRequired.every(isInputFilled);
    // Check if images are required and at least one image is present
    const imagesCondition = !imagesRequired || images.length > 0;
    setCanSubmit(allRequiredFilled && imagesCondition);
  }, [inputClassName, requiredFields, images, imagesRequired, showProgressBar]);

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
        {showProgressBar && (
          <div className="flex gap-[10px] bg-white" style={style}>
            {Array(steps)
              .fill(null)
              .map((_, index) => (
                <FlowProgressBar
                  key={index}
                  complete={activeStep > index}
                  ref={activeStep === index ? barRef : undefined}
                  bg_color="#D9D9D9"
                />
              ))}
          </div>
        )}
        {children}
      </div>
    </FlowProgressContext.Provider>
  );
};

export default FlowProgress;
