import { useEffect, useRef, createContext, useCallback, useState } from "react";
import { z } from "zod";
import gsap from "gsap";
import FlowProgressBar from "./flow-progress-bar";

interface FlowProgressProps {
  steps: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
  className?: string;
  activeStep: number;
  inputClassName?: string;
  requiredFields?: string[];
  showProgressBar?: boolean;
}

interface FlowProgressContextType {
  handleInputChange: () => void;
  validateForm: () => boolean;
  canSubmit: boolean;
  missingFields: string[];
}

export const FlowProgressContext = createContext<FlowProgressContextType>({
  handleInputChange: () => {},
  validateForm: () => false,
  canSubmit: false,
  missingFields: [],
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
}) => {
  const progress = useRef(0);
  const barRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const isInputFilled = (input: HTMLInputElement) => {
    if (input.type === "file") {
      return input.files && input.files.length > 0 && input.files[0].size > 0;
    }

    let value = input.value.trim();

    if (input.type === "tel") {
      value = value.replace(/\s+/g, "");
      return value.length > 4;
    }

    if (input.type === "text" && input.classList.contains("date-input")) {
      const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
      return datePattern.test(value);
    }

    if (input.type === "email") {
      const emailSchema = z.string().email();
      return emailSchema.safeParse(value).success;
    }

    if (input.classList.contains("react-quill-hidden-input")) {
      return value && value !== "<p><br></p>" && value !== "<p></p>";
    }

    return value;
  };

  const validateForm = useCallback(() => {
    const selector = inputClassName ? `.${inputClassName}` : "input";
    const inputs = Array.from(
      containerRef.current?.querySelectorAll(selector) || []
    ) as HTMLInputElement[];

    const stepValue = 100 / inputs.length;
    const filledInputs = inputs.filter(isInputFilled);
    progress.current = filledInputs.length * stepValue;

    if (showProgressBar) {
      gsap.to(barRef.current, {
        width: `${progress.current}%`,
        ease: "expo.out",
      });
    }

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
    const missing = allRequired
      .filter((input) => !isInputFilled(input))
      .map((input) => input.name || input.id);

    setCanSubmit(allRequiredFilled);
    setMissingFields(missing);

    return allRequiredFilled;
  }, [inputClassName, requiredFields, showProgressBar]);

  const handleInputChange = useCallback(() => {
    validateForm();
  }, [validateForm]);

  useEffect(() => {
    const selector = inputClassName ? `.${inputClassName}` : "input";
    const inputs = Array.from(
      containerRef.current?.querySelectorAll(selector) || []
    );

    handleInputChange();

    inputs.forEach((input) => {
      input.addEventListener("input", handleInputChange);
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("input", handleInputChange);
      });
    };
  }, [activeStep, handleInputChange, inputClassName]);

  useEffect(() => {
    handleInputChange();
  }, [children, handleInputChange]);

  return (
    <FlowProgressContext.Provider
      value={{ handleInputChange, validateForm, canSubmit, missingFields }}
    >
      <div ref={containerRef} className={className}>
        {showProgressBar && (
          <div
            className="setup-flow-progress flex xsmall_gap bg-white dark:bg-darkText-primary"
            style={style}
          >
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
