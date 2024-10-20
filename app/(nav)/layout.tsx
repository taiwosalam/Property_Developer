"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, Fragment } from "react";
import { SidenavArrow } from "@/public/icons/icons";

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
import { useAuthStoreSelectors } from "@/store/authstrore";

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
    "top-[100px] overflow-x-hidden overflow-y-auto no-scrollbar bg-white dark:bg-[#020617] dark:border-[#252525] dark:border-r ";
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

  const router = useRouter();
  const { isAuthenticated } = useAuthStoreSelectors.getState();

  useEffect(() => {
    // Function to handle redirect based on authentication state
    const handleRedirect = async () => {
      if (isAuthenticated) {
        // router.push("/dashboard"); // Redirect to dashboard if both are valid
      }
    };

    handleRedirect(); // Call the function on component mount
  }, [isAuthenticated, router]); // Re-run this logic if isAuthenticated or companyId changes

  return (
    <Fragment>
      <Navbar />
      <div className="w-full flex relative z-[1] ">
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
            <Sidenav
              showLogo
              closeSidenav={() => setFixedSidenavIsOpen(false)}
            />
          </div>
        ) : (
          <div
            ref={containerRef}
            style={{
              height: sidenav_height,
            }}
            className={clsx("sticky z-[2]", sidenav_class_styles, {
              "sidenav-collapsed": !sidenavIsOpen,
            })}
          >
            <Sidenav />
          </div>
        )}
        <div className="w-full custom-flex-col flex-1 bg-neutral-2 dark:bg-[#000000]">
          <div
            style={{ boxShadow: "0px 2px 20px 0px rgba(0, 0, 0, 0.02)" }}
            className="custom-flex-col sticky top-[99px] bg-white dark:bg-[#697565] z-[2]"
          >
            <div
              className="h-[1px]"
              style={{ boxShadow: "0px 2px 20px 0px rgba(0, 0, 0, 0.02)" }}
            ></div>
            <div className="h-[50px] px-3 sm:pr-10 flex flex-wrap items-center justify-between gap-2 bg-white dark:bg-[#020617] max-w-full overflow-hidden">
              <button
                type="button"
                aria-label="toggle sidenav"
                onClick={() => {
                  if (isSmallTablet) {
                    setFixedSidenavIsOpen(true);
                  } else {
                    setSidenavIsOpen(!sidenavIsOpen);
                  }
                }}
              >
                {sidenavIsOpen ? (
                  <SVG
                    type="sidebar"
                    color={primaryColor as Color}
                    className="w-8 h-8"
                  />
                ) : (
                  <SidenavArrow />
                )}
              </button>
              <p className="capitalize text-text-primary text-sm font-medium truncate dark:text-white">
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
    </Fragment>
  );
};

export default NavLayout;
