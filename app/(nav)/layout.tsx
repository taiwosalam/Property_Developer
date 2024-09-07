"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

// Imports
import clsx from "clsx";
import gsap from "gsap";
import SVG from "@/components/SVG/svg";
import { Color } from "@/types/global";
import Sidenav from "@/components/Nav/sidenav";
import { useThemeStoreSelectors } from "@/store/themeStore";

import Navbar from "@/components/Nav/navbar";
import useWindowWidth from "@/hooks/useWindowWidth";
import { trackOutsideClick } from "@/utils/track-outside-click";

const NavLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();

  const { isSmallTablet } = useWindowWidth(1024);

  const [sidenavIsOpen, setSidenavIsOpen] = useState(true);
  const [fixedSidenavIsOpen, setFixedSidenavIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const fixedContainerRef = useRef<HTMLDivElement>(null);

  const sidenav_width = 250;

  const primaryColor = useThemeStoreSelectors.use.primaryColor();

  const sidenav_class_styles =
    "top-[100px] overflow-x-hidden overflow-y-auto no-scrollbar bg-white";
  const sidenav_height = "calc(100vh - 100px)";

  useEffect(() => {
    if (containerRef.current) {
      const timeline = gsap.timeline();

      timeline.to(containerRef.current, {
        width: sidenavIsOpen ? sidenav_width : 110,
        duration: 0.5,
        ease: "expo.out",
      });
    }
  }, [sidenavIsOpen]);

  useEffect(() => {
    if (fixedContainerRef.current) {
      const timeline = gsap.timeline();

      timeline.to(fixedContainerRef.current, {
        xPercent: fixedSidenavIsOpen ? 100 : 0,
        duration: 0.5,
        ease: "expo.out",
      });

      trackOutsideClick(fixedContainerRef, () => setFixedSidenavIsOpen(false));
    }
  }, [fixedSidenavIsOpen]);

  return (
    <>
      <Navbar />
      <div className="w-full flex relative z-[1]">
        {isSmallTablet ? (
          <div
            ref={fixedContainerRef}
            style={{ height: sidenav_height }}
            className={clsx(
              "fixed z-10 -translate-x-full",
              sidenav_class_styles,
              {
                "pointer-events-none": !sidenavIsOpen,
              }
            )}
          >
            <Sidenav />
          </div>
        ) : (
          <div
            ref={containerRef}
            style={{
              height: sidenav_height,
            }}
            className={clsx("sticky", sidenav_class_styles, {
              "sidenav-collapsed": !sidenavIsOpen,
            })}
          >
            <Sidenav />
          </div>
        )}
        <div className="custom-flex-col flex-1 bg-neutral-2">
          <div className="custom-flex-col sticky top-[99px] bg-white z-[2]">
            <div
              className="h-[1px]"
              style={{ boxShadow: "0px 2px 20px 0px rgba(0, 0, 0, 0.02)" }}
            ></div>
            <div className="h-[50px] px-3 sm:pr-10 flex items-center justify-between bg-white ">
              <button
                onClick={() => {
                  if (isSmallTablet) {
                    setFixedSidenavIsOpen(true);
                  } else {
                    setSidenavIsOpen(!sidenavIsOpen);
                  }
                }}
              >
                <SVG
                  type="sidebar"
                  color={primaryColor as Color}
                  className="w-8 h-8"
                />
              </button>
              <p className="capitalize text-text-primary text-sm font-medium">
                {pathname.split("/").slice(1).join(" > ")}
              </p>
            </div>
            <div
              className="h-[1px]"
              style={{ boxShadow: "0px 2px 20px 0px rgba(0, 0, 0, 0.02)" }}
            ></div>
          </div>
          <main
            style={{
              maxWidth: `calc(100vw - ${
                isSmallTablet ? 0 : sidenavIsOpen ? sidenav_width : 110
              }px)`,
            }}
            className={clsx("p-6 relative z-[1]", {
              "opacity-50": fixedSidenavIsOpen,
            })}
          >
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default NavLayout;
