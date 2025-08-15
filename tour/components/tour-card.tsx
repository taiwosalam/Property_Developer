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
  onRestart: () => void;
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
  onRestart,
}) => {
  return (
    <>
      <div
        ref={tooltipRef}
        className="absolute bg-white dark:bg-[#3C3D37] rounded-lg shadow-xl p-6 min-w-[80vw] max-w-[500px] w-[80vw] sm:min-w-[300px] sm:w-auto sm:max-w-[300px] z-[10002] text-gray-900 dark:text-gray-100 responsive-tour-card"
        role="dialog"
        aria-labelledby={`tour-step-${stepIndex}-title`}
        aria-describedby={`tour-step-${stepIndex}-content`}
        style={{ boxSizing: 'border-box', margin: '0 0 0 -6px' }}
      >
        <div className="flex justify-between items-start">
          <h3
            id={`tour-step-${stepIndex}-title`}
            className="text-lg dark:text-white font-semibold mb-2 sm:text-lg text-base"
          >
            {step.title}
          </h3>
          <button
            onClick={onSkip}
            className="text-sm text-gray- dark:text-white hover:text-blue-700 dark:hover:text-gray-300"
            aria-label="Close tour"
          >
            <XIcon size="30" />
          </button>
        </div>
        <p
          id={`tour-step-${stepIndex}-content`}
          className="text-sm dark:text-white mb-4 sm:text-sm text-xs"
          style={{ wordBreak: 'break-word' }}
        >
          {parse(step.content)}
        </p>
        <div className="flex justify-between items-center">
          {isWelcomeStep ? (
            <div className="gap-2 flex w-full justify-end items-end">
              <button
                onClick={onSkip}
                className="px-4 py-2 text-sm text-brand-9 dark:text-white"
                aria-label="Decline tour"
              >
                Maybe Later
              </button>
              <Button
                onClick={onNext}
                type="button"
                size="sm_normal"
                className="px-4 py-2 text-white capitalize rounded-md text-sm"
                aria-label="Start tour"
              >
                Take the Tour
              </Button>
            </div>
          ) : (
            <>
              {isLastStep ? (
                <Button
                  onClick={onBack}
                  variant="border"
                  size="sm_normal"
                  className="px-4 py-2 dark:text-white"
                  aria-label="Previous step"
                >
                  <ChevronLeftIcon size="20" />
                </Button>
              ) : (
                <div className="text-sm text-gray-500 dark:text-white">
                  {stepIndex + 1} / {totalSteps}
                </div>
              )}
              <div className="flex gap-2">
                {(!isFirstStep && !isLastStep) && (
                  <Button
                    onClick={onBack}
                    variant="border"
                    size="sm_normal"
                    className="px-4 md:py-2 py-1 dark:text-white"
                    aria-label="Previous step"
                  >
                    <ChevronLeftIcon size="20" />
                  </Button>
                )}
                {isLastStep ? (
                  <>
                    <Button
                      onClick={onNext}
                      size="sm_normal"
                      className="px-4 md:py-2 py-1 text-sm"
                      aria-label="Finish tour"
                    >
                      Finish
                    </Button>
                    <Button
                      onClick={onRestart}
                      variant="border"
                      size="sm_normal"
                      className="px-4 md:py-2 py-1 text-sm dark:text-white"
                      aria-label="Restart tour"
                    >
                      Restart
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={onNext}
                    size="sm_normal"
                    className="px-4 md:py-2 py-1 text-sm"
                    aria-label="Next step"
                  >
                    Next
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <style jsx global>{`
        @media (max-width: 640px) {
          .responsive-tour-card {
            padding: 1rem !important;
            min-width: 0 !important;
            max-width: 98vw !important;
            width: 98vw !important;
          }
          .responsive-tour-card h3 {
            font-size: 1rem !important;
          }
          .responsive-tour-card p {
            font-size: 0.85rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default TourCard;
