// "use client";

// import { useRef, useState, useEffect } from "react";

// // Images
// import { ChevronDown } from "lucide-react";
// import { useOutsideClick } from "@/hooks/useOutsideClick";
// import useDarkMode from "@/hooks/useCheckDarkMode";
// import { toast } from "sonner";

// const NavSwitchUserSwitch = () => {
//   const isDarkMode = useDarkMode();
//   const [isOpen, setIsOpen] = useState(false);
//   // const [active, setActive] = useState("Property Manager");

//   const containerRef = useRef<HTMLDivElement | null>(null);

//   useOutsideClick(containerRef, () => {
//     if (isOpen) setIsOpen(false);
//   });

//   const handleSwitch = () => {
//     setIsOpen((prev) => !prev);
//   };

//   const handleModuleSwitch = (val: string) => {
//     // Capitalize the first letter
//     const capitalizedVal = val.charAt(0).toUpperCase() + val.slice(1);

//     // setActive(val);
//     if (val !== "property manager") {
//       toast.warning(`${capitalizedVal} coming soon`);
//       return;
//     }
//     setIsOpen(false);
//   };

//   return (
//     <div ref={containerRef} className="relative flex-1 max-w-[240px]">
//       <button
//         type="button"
//         onClick={handleSwitch}
//         aria-label="switch user"
//         className="w-full h-full px-4 py-[12px] flex items-center justify-between gap-2 rounded-lg bg-[#F1F1F1] dark:bg-[#3C3D37]"
//       >
//         <span className="text-[#0a132ea6] dark:text-white text-base font-semibold capitalize custom-truncated">
//           Property Manager
//         </span>
//         <ChevronDown size={20} color={isDarkMode ? "#fff" : "#0a132ea6"} />
//       </button>

//       {isOpen && (
//         <div
//           style={{ boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.1)" }}
//           className="absolute top-full left-0 w-full py-2 bg-white dark:bg-[#3C3D37] rounded-bl-lg rounded-br-lg"
//         >
//           <div className="custom-flex-col text-[#0a132ea6] text-base font-semibold dark:text-white">
//             <button
//               type="button"
//               onClick={() => handleModuleSwitch("property manager")}
//               className="p-4 capitalize text-start hover:bg-neutral-2 dark:hover:bg-[#292d32]"
//             >
//               Property Manager
//             </button>
//             <button
//               type="button"
//               onClick={() => handleModuleSwitch("hospilatity manager")}
//               className="p-4 capitalize text-start hover:bg-neutral-2 dark:hover:bg-[#292d32]"
//             >
//               Hospitality Manager
//             </button>
//             <button
//               type="button"
//               onClick={() => handleModuleSwitch("property developer")}
//               className="p-4 capitalize text-start hover:bg-neutral-2 dark:hover:bg-[#292d32]"
//             >
//               Property Developer
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NavSwitchUserSwitch;















"use client";

import { useRef, useState, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import useDarkMode from "@/hooks/useCheckDarkMode";
import { toast } from "sonner";

const DROPDOWN_ANIMATION = {
  initial: { opacity: 0, y: -10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.98 },
  transition: { duration: 0.18, ease: "easeInOut" },
};

const MOBILE_BREAKPOINT = 768; // px

export default function NavSwitchUserSwitch({ trigger }: { trigger?: React.ReactNode }) {
  const isDarkMode = useDarkMode();
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  useOutsideClick(containerRef, () => {
    if (isOpen) setIsOpen(false);
  });

  // Compute center position on mobile
  useLayoutEffect(() => {
    if (isOpen && triggerRef.current && dropdownRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // Only on mobile, center under trigger
      if (viewportWidth < MOBILE_BREAKPOINT) {
        const left =
          triggerRect.left +
          triggerRect.width / 2 -
          dropdownRect.width / 2;

        // Clamp so dropdown never overflows window horizontally
        const clampedLeft = Math.max(
          8, // small left margin
          Math.min(
            left,
            viewportWidth - dropdownRect.width - 8 // small right margin
          )
        );

        setDropdownStyle({
          left: clampedLeft,
          right: "auto",
          minWidth: 180,
          width: 220,
        });
      } else {
        // Desktop: align left, full width
        setDropdownStyle({
          left: 0,
          right: "auto",
          width: "100%",
          minWidth: 220,
        });
      }
    }
  }, [isOpen]);

  const handleSwitch = () => setIsOpen((prev) => !prev);

  const handleModuleSwitch = (val: string) => {
    const capitalizedVal = val.charAt(0).toUpperCase() + val.slice(1);
    if (val !== "property manager") {
      toast.warning(`${capitalizedVal} coming soon`);
      return;
    }
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative flex-1 max-w-[240px]">
      {trigger ? (
        <div ref={triggerRef} onClick={handleSwitch} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleSwitch}
          aria-label="switch user"
          className="w-full h-full px-4 py-[12px] flex items-center justify-between gap-2 rounded-lg bg-[#F1F1F1] dark:bg-[#3C3D37]"
          ref={triggerRef}
        >
          <span className="text-[#0a132ea6] dark:text-white text-base font-semibold capitalize custom-truncated">
            Property Manager
          </span>
          <ChevronDown size={20} color={isDarkMode ? "#fff" : "#0a132ea6"} />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            key="dropdown"
            initial="initial"
            animate="animate"
            exit="exit"
            transition={DROPDOWN_ANIMATION.transition}
            variants={DROPDOWN_ANIMATION}
            style={{
              ...dropdownStyle,
              boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.1)",
              position: "absolute",
              top: "100%",
              zIndex: 50,
            }}
            className={`
              py-2 bg-white dark:bg-[#3C3D37]
              rounded-bl-lg rounded-br-lg
              ${typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT ? "text-sm" : "text-base"}
            `}
          >
            <div className="custom-flex-col text-[#0a132ea6] font-semibold dark:text-white">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}