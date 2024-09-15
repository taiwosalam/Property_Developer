"use client";

import React, { useRef, useState } from "react";

// Images
import { ChevronDown } from "lucide-react";
import { trackOutsideClick } from "@/utils/track-outside-click";

const NavSwitchUserSwitch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("property manager");

  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleSwitch = () => {
    setIsOpen((prev) => !prev);

    if (!isOpen) {
      trackOutsideClick(containerRef, () => setIsOpen(false));
    }
  };

  const handleUserSwitch = (user: string) => {
    setActive(user);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative flex-1 max-w-[240px]">
      <button
        onClick={handleSwitch}
        className="w-full h-full p-4 flex items-center justify-between gap-2 rounded-lg bg-[#F1F1F1]"
      >
        <p className="text-[#0a132ea6] text-base font-semibold capitalize">
          {active}
        </p>
        <ChevronDown size={20} color="#0a132ea6" />
      </button>
      {isOpen && (
        <div
          style={{ boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.1)" }}
          className="absolute top-full left-0 w-full py-2 bg-white rounded-bl-lg rounded-br-lg"
        >
          <div className="custom-flex-col text-[#0a132ea6] text-base font-semibold">
            <button
              onClick={() => handleUserSwitch("property manager")}
              className="p-4 capitalize text-start hover:bg-neutral-2"
            >
              property manager
            </button>
            <button
              onClick={() => handleUserSwitch("hospilatity manager")}
              className="p-4 capitalize text-start hover:bg-neutral-2"
            >
              hospitality manager
            </button>
            <button
              onClick={() => handleUserSwitch("property developer")}
              className="p-4 capitalize text-start hover:bg-neutral-2"
            >
              property developer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavSwitchUserSwitch;
