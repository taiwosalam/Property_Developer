"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SidenavArrow } from "@/public/icons/icons";

// Imports
import clsx from "clsx";
import { LayoutContext } from "@/components/Layout/layout-context";
import SVG from "@/components/SVG/svg";
import { Color } from "@/types/global";
import SideNav from "@/components/Nav/sidenav";
import { useThemeStoreSelectors } from "@/store/themeStore";
import useWindowWidth from "@/hooks/useWindowWidth";
import Header from "@/components/Nav/navbar";
import { trackOutsideClick } from "@/utils/track-outside-click";

const NavLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const sideNavRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useWindowWidth();
  const [isSideNavOpen, setIsSideNavOpen] = useState(true);

  const primaryColor = useThemeStoreSelectors.use.primaryColor();

  useEffect(() => {
    let removeOutsideClickListener: (() => void) | undefined;
    if (isMobile && isSideNavOpen && sideNavRef.current) {
      removeOutsideClickListener = trackOutsideClick(sideNavRef, () =>
        setIsSideNavOpen(false)
      );
    }
    return () => {
      if (removeOutsideClickListener) {
        removeOutsideClickListener();
      }
    };
  }, [isSideNavOpen, isMobile]);

  useEffect(() => {
    setIsSideNavOpen(!isMobile);
  }, [isMobile]);

  return (
    <LayoutContext.Provider value={{ isSideNavOpen }}>
      <Header />

      <>
        <aside
          ref={sideNavRef}
          className={clsx(
            "h-[calc(100dvh-100px)] w-[250px] fixed top-[100px] z-[3] bg-white dark:bg-[#020617] dark:border-[#252525] dark:border-r no-scrollbar overflow-auto transition-transform duration-300",
            {
              "-translate-x-full md:w-[110px]": !isSideNavOpen,
              "translate-x-0 md:w-[235px] lg:w-[250px]": isSideNavOpen,
            },
            "md:translate-x-0"
          )}
          style={{
            // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            transitionProperty: "width, transform",
          }}
        >
          <SideNav
            closeSideNav={() => {
              if (isMobile) {
                setIsSideNavOpen(false);
              }
            }}
            isCollapsed={!isSideNavOpen}
          />
        </aside>
        <div
          style={{
            boxShadow: "0px 2px 20px 0px rgba(0, 0, 0, 0.02)",
            transitionProperty: "margin-left",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          className={clsx(
            "custom-flex-col sticky top-[99px] z-[2] duration-300",
            {
              "md:ml-[110px] lg:ml-[110px]": !isSideNavOpen,
              "md:ml-[235px] lg:ml-[250px]": isSideNavOpen,
            }
          )}
        >
          <div
            className="h-[1px]"
            style={{ boxShadow: "0px 2px 20px 0px rgba(0, 0, 0, 0.02)" }}
          />
          <div className="h-[50px] px-3 flex flex-wrap items-center justify-between gap-2 bg-white dark:bg-[#020617] max-w-full overflow-hidden">
            <button
              type="button"
              aria-label="toggle sidenav"
              onClick={() => {
                setIsSideNavOpen(!isSideNavOpen);
              }}
            >
              {isSideNavOpen ? (
                <SVG
                  type="sidebar"
                  color={primaryColor as Color}
                  className="w-8 h-8"
                />
              ) : (
                <>
                  <SVG
                    type="sidebar"
                    color={primaryColor as Color}
                    className="w-8 h-8 md:hidden"
                  />
                  <div className="hidden md:block text-brand-9">
                    <SidenavArrow />
                  </div>
                </>
              )}
            </button>
            <p className="capitalize text-text-primary dark:text-darkText-2 text-sm font-medium truncate">
              {pathname.split("/").slice(1).join(" > ")}
            </p>
          </div>
          <div
            className="h-[1px]"
            style={{ boxShadow: "0px 2px 20px 0px rgba(0, 0, 0, 0.02)" }}
          />
        </div>
        <main
          style={{
            transitionProperty: "margin-left",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          className={clsx(
            "p-6 bg-neutral-2 dark:bg-[#000000] relative z-[1] duration-300",
            {
              "md:ml-[110px] lg:ml-[110px]": !isSideNavOpen,
              "opacity-50 pointer-events-none md:ml-[235px] lg:ml-[250px]":
                isSideNavOpen,
            },
            "md:opacity-100 md:pointer-events-auto"
          )}
        >
          {children}
        </main>
      </>
    </LayoutContext.Provider>
  );
};

export default NavLayout;
