import React from "react";
import { TourStep } from "../types";
import { XIcon } from "@/public/icons/icons";
import Button from "@/components/Form/Button/button";
import { ChevronLeftIcon } from "lucide-react";
import parse from "html-react-parser"; 


interface TourCardProps {
  step: TourStep;
  stepIndex: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  isWelcomeStep?: boolean;
  tooltipRef: React.RefObject<HTMLDivElement>;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}

const TourCard: React.FC<TourCardProps> = ({
  step,
  stepIndex,
  totalSteps,
  isFirstStep,
  isLastStep,
  isWelcomeStep,
  tooltipRef,
  onBack,
  onNext,
  onSkip,
}) => {
  return (
    <div
      ref={tooltipRef}
      className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 min-w-[400px] max-w-[500px] z-[10002] text-gray-900 dark:text-gray-100"
      role="dialog"
      aria-labelledby={`tour-step-${stepIndex}-title`}
      aria-describedby={`tour-step-${stepIndex}-content`}
    >
      <div className="flex justify-between items-start">
        <h3
          id={`tour-step-${stepIndex}-title`}
          className="text-lg font-semibold mb-2"
        >
          {step.title}
        </h3>
        <button
          onClick={onSkip}
          className="text-sm text-gray-500 hover:text-blue-700 dark:hover:text-gray-300"
          aria-label="Close tour"
        >
          <XIcon size="30" />
        </button>
      </div>
      <p id={`tour-step-${stepIndex}-content`} className="text-sm mb-4">
        {/* {step.content} */}
        {parse(step.content)} 
      </p>
      <div className="flex justify-between items-center">
        {isWelcomeStep ? (
          <div className="gap-2 flex w-full justify-end items-end">
            <button
              onClick={onSkip}
              className="px-4 py-2 text-sm text-brand-9"
              aria-label="Decline tour"
            >
              Maybe Later
            </button>
            <Button
              onClick={onNext}
              type="button"
              size="sm_normal"
              className="px-4 py-2 text-white capitalize rounded-lg text-sm"
              aria-label="Start tour"
            >
              Take the Tour
            </Button>
          </div>
        ) : (
          <>
            <div className="text-sm text-gray-500">
              {stepIndex + 1} / {totalSteps}
            </div>
            <div className="flex gap-2">
              {!isFirstStep && (
                <Button
                  onClick={onBack}
                  variant="border"
                  size="sm_normal"
                  className="px-4 py-2"
                  aria-label="Previous step"
                >
                  <ChevronLeftIcon size="20" />
                </Button>
              )}
              <Button
                onClick={onNext}
                size="sm_normal"
                className="px-4 py-2 text-sm"
                aria-label={isLastStep ? "Finish tour" : "Next step"}
              >
                {isLastStep ? "Finish" : "Next"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TourCard;
