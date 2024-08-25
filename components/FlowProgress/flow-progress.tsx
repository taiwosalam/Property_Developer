"use client";

import React, { useEffect, useRef } from "react";

// Types
import type { FlowProgressProps } from "./types";

// Imports
import gsap from "gsap";
import FlowProgressBar from "./flow-progress-bar";

const FlowProgress: React.FC<FlowProgressProps> = ({
  steps,
  style,
  children,
  className,
  activeStep,
}) => {
  const progress = useRef(0);
  const barRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const inputs = Array.from(
      containerRef.current?.querySelectorAll("input") || []
    );

    const stepValue = 100 / inputs.length;

    const handleInputChange = () => {
      const filledInputs = inputs.filter((input) => input.value.trim());
      progress.current = filledInputs.length * stepValue;
      gsap.to(barRef.current, {
        width: `${progress.current}%`,
        ease: "expo.out",
      });
    };

    inputs.forEach((input) => {
      input.addEventListener("input", handleInputChange);
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("input", handleInputChange);
      });
    };
  }, [activeStep]);

  return (
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
  );
};

export default FlowProgress;
