"use client";

import React, { useEffect, useRef, useState } from "react";

// Types
import type { AuthSliderProps } from "./types";

// Imports
import gsap from "gsap";
import { AuthSliderBar, AuthSliderContent } from "./auth-slider-components";

const AuthSlider: React.FC<AuthSliderProps> = ({ content = [] }) => {
  const height = 177; // Height of the slider content area

  const skip_animation = useRef(true); // Ref to skip the initial animation on mount

  const [activeIndex, setActiveIndex] = useState(0); // State to track the currently active index

  const barsRef = useRef<(HTMLDivElement | null)[]>([]); // Ref to store bar elements
  const sliderRef = useRef<HTMLDivElement | null>(null); // Ref to store the slider container element
  const contentsRef = useRef<(HTMLDivElement | null)[]>([]); // Ref to store content elements

  useEffect(() => {
    // Skip the animation on the initial mount
    // if (skip_animation.current) {
    //   skip_animation.current = false;
    //   return;
    // }

    // Check if refs are available
    const bars = barsRef.current;
    const slider = sliderRef.current;
    const contents = contentsRef.current;

    if (!slider || bars.length === 0 || contents.length === 0) {
      return;
    }

    const timeline = gsap.timeline({
      defaults: { duration: 3, ease: "expo.out" }, // Set default animation duration and easing
    });

    // Get the active and remaining bars
    const active_bar = bars[activeIndex];
    const remaining_bars = bars.filter((_, index) => index !== activeIndex);

    // Get the active and remaining contents
    const active_content = contents[activeIndex];
    const remaining_contents = contents.filter(
      (_, index) => index !== activeIndex
    );

    timeline
      // Reset styles for all bars except the active one
      .to(remaining_bars, { flex: 0, opacity: 0.4, backgroundColor: "#6083ed" })
      // Apply styles to the active bar
      .to(active_bar, { flex: 1, opacity: 1, backgroundColor: "#315ee7" }, "0")
      // Reset opacity for all content except the active one
      .to(remaining_contents, { opacity: 0 }, "0")
      // Apply opacity to the active content
      .to(active_content, { opacity: 1 }, "0")
      // Move the slider to the position of the active content
      .to(slider, { y: -(activeIndex * height) }, "0")
      // Update the active index after the animation duration
      .call(
        () => {
          setActiveIndex((prev) => (prev + 1) % contents.length);
        },
        undefined,
        "+=3" // Delay the call by 3 seconds to match the duration of the animation
      );
  }, [activeIndex]); // Re-run effect when activeIndex changes

  // Check if content is available
  if (!content.length) {
    console.warn("AuthSlider component has no content to display");
    return null;
  }

  return (
    <div className="flex justify-center gap-[6px]" style={{ height }}>
      <div className="flex flex-col justify-center gap-1 p-4 xl:p-5">
        {content.map((_, index) => (
          <AuthSliderBar
            key={index}
            ref={(el) => {
              barsRef.current[index] = el;
            }}
          />
        ))}
      </div>
      <div
        className="h-full overflow-hidden"
        style={{ width: "min(100%, 540px)" }}
      >
        <div ref={sliderRef} className="w-full custom-flex-col">
          {content.map((item, index) => (
            <AuthSliderContent
              key={index}
              height={height}
              title={item.title}
              ref={(el) => {
                contentsRef.current[index] = el;
              }}
            >
              {item.desc}
            </AuthSliderContent>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthSlider;
