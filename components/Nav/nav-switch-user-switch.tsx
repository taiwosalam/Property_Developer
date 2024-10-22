"use client";

import { useRef, useState, useEffect } from "react";

// Images
import { ChevronDown } from "lucide-react";
import { trackOutsideClick } from "@/utils/track-outside-click";
import useDarkMode from "@/hooks/useCheckDarkMode";

const NavSwitchUserSwitch: React.FC<{
  userType: string;
  loading: boolean;
  error: Error | null;
}> = ({ userType, loading, error }) => {
  const isDarkMode = useDarkMode();
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(userType);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleSwitch = () => {
    setIsOpen((prev) => !prev);

    if (!isOpen) {
      trackOutsideClick(containerRef, () => setIsOpen(false));
    }
  };

  const handleModuleSwitch = (val: string) => {
    setActive(val);
    setIsOpen(false);
  };

  useEffect(() => {
    setActive(userType);
  }, [userType]);

  return (
    <div ref={containerRef} className="relative flex-1 max-w-[240px]">
      <button
        type="button"
        onClick={handleSwitch}
        aria-label="switch user"
        className="w-full h-full px-4 py-[12px] flex items-center justify-between gap-2 rounded-lg bg-[#F1F1F1] dark:bg-[#3C3D37]"
      >
        <span className="text-[#0a132ea6] dark:text-white text-base font-semibold capitalize custom-truncated">
          {loading ? "loading..." : error ? "Property Manager" : userType}
        </span>
        <ChevronDown size={20} color={isDarkMode ? "#fff" : "#0a132ea6"} />
      </button>

      {isOpen && (
        <div
          style={{ boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.1)" }}
          className="absolute top-full left-0 w-full py-2 bg-white dark:bg-[#3C3D37] rounded-bl-lg rounded-br-lg"
        >
          <div className="custom-flex-col text-[#0a132ea6] text-base font-semibold dark:text-white">
            <button
              type="button"
              onClick={() => handleModuleSwitch("property manager")}
              className="p-4 capitalize text-start hover:bg-neutral-2 dark:hover:bg-[#292d32]"
            >
              Property Manager
            </button>
            <button
              type="button"
              onClick={() => handleModuleSwitch("hospilatity manager")}
              className="p-4 capitalize text-start hover:bg-neutral-2 dark:hover:bg-[#292d32]"
            >
              Hospitality Manager
            </button>
            <button
              type="button"
              onClick={() => handleModuleSwitch("property developer")}
              className="p-4 capitalize text-start hover:bg-neutral-2 dark:hover:bg-[#292d32]"
            >
              Property Developer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavSwitchUserSwitch;
