"use client";

import { usePathname, useRouter } from "next/navigation";
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
import { useOutsideClick } from "@/hooks/useOutsideClick";
import useSettingsStore from "@/store/settings";
import TopNav from "@/components/Nav/topnav";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useRole } from "@/hooks/roleContext";
import { getRoleFromCookie } from "@/utils/getRole";
import { getLocalStorage, saveLocalStorage } from "@/utils/local-storage";
import { Modal, ModalContent } from "@/components/Modal/modal";
import { useGlobalStore } from "@/store/general-store";
import OtherAgreementDocument from "@/components/Documents/other-agreement";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { usePermissionsStore } from "@/store/permissions";
import { getRoleTitle } from "@/hooks/getPermission";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import ExpiredSubscriptionModal from "@/components/Modal/expired-subscription-flow";
import { SmartMarquee } from "@/components/Marquee/smart-marque";
import { useMarqueeData } from "@/components/Marquee/data";

const roleMapping: Record<string, string> = {
  "admin configuration (company director)": "director",
  "partner configuration (branch manager)": "manager",
  "colleague configuration (account officer)": "account",
  "staff configuration (other staff)": "staff",
  "Users Configuration (Landlord, Occupant & Tenants)": "user",
};

const NavLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedOptions, setSelectedOption } = useSettingsStore();
  const { openDocumentModal, selectedDocumentOption, setGlobalInfoStore } =
    useGlobalStore();
  const sideNavRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useWindowWidth();
  const [isExpiredModalOpen, setIsExpiredModalOpen] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navs = getLocalStorage("navbar");
  const primaryColor = useThemeStoreSelectors.use.primaryColor();
  const { role, setRole } = useRole();
  const hasMounted = useRef(false);

  // Get marquee data to determine if marquee is present
  const { hasMarquees } = useMarqueeData();

  const isSubscriptionExpired = usePersonalInfoStore(
    (state) => state.isSubscriptionExpired
  );

  // BELOW IS FOR TESTING PURPOSES ONLY
  // const isSubscriptionExpired = true;
  const { setPermissions, setLoading, setError } = usePermissionsStore();
  const loggedInUserDetails = getLocalStorage("additional_details");
  let appearance:
    | {
      colorMode: string;
      view: string;
      navbar: string;
      fonts: string;
      dashboardColor: string;
    }
    | undefined;
  if (loggedInUserDetails) {
    ({ appearance } = loggedInUserDetails);
  }

  const {
    data: manaConfigData,
    loading: configLoading,
    error: configError,
    refetch,
  } = useFetch<any>("/company/permissions");
  useRefetchOnEvent("refetchPermissions", () => refetch({ silent: true }));

  const [navbar, setNavbar] = useState(appearance?.navbar);

  useOutsideClick(sideNavRef, () => {
    if (isMobile) {
      setIsSideNavOpen(false);
    }
  });

  // Store permissions in Zustand when data is fetched
  useEffect(() => {
    if (manaConfigData?.data) {
      setLoading(configLoading);
      setError(configError);

      const formattedPermissions = Object.keys(manaConfigData.data).reduce(
        (acc, role) => {
          const title = getRoleTitle(role);
          acc[title] = manaConfigData.data[role] || [];
          return acc;
        },
        {} as Record<string, string[]>
      );

      setPermissions(formattedPermissions);
    }
  }, [
    manaConfigData,
    configLoading,
    configError,
    setPermissions,
    setLoading,
    setError,
  ]);

  useEffect(() => {
    if (navs !== null) {
      setNavbar(navs);
    }
    setSelectedOption("view", appearance?.view || "grid");
  }, [navs]);

  // Open expired subscription modal when isSubscriptionExpired is true
  useEffect(() => {
    if (isSubscriptionExpired) {
      setIsExpiredModalOpen(true);
    } else {
      setIsExpiredModalOpen(false);
    }
  }, [isSubscriptionExpired]);

  useEffect(() => {
    setIsSideNavOpen(!isMobile);
  }, [isMobile]);

  // Fetch role on component mount
  useEffect(() => {
    const fetchRole = async () => {
      const userRole = await getRoleFromCookie();
      setRole(userRole || "");
      setIsLoading(false);
    };
    fetchRole();
  }, [setRole]);

  // Simulate
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useAuthRedirect();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-neutral-100 dark:bg-neutral-900">
        <div className="animate-spin w-12 h-12 border-4 border-brand-9 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <LayoutContext.Provider value={{ isSideNavOpen }}>
      <Header />
      {navbar === "row" ? (
        <div className="sticky top-[100px] z-[2] bg-white dark:bg-[#020617]">
          <TopNav />
        </div>
      ) : (
        <aside
          ref={sideNavRef}
          className={clsx(
            "h-[calc(100vh-100px)] fixed top-[100px] z-[3] bg-white dark:bg-[#020617] dark:border-[#252525] dark:border-r no-scrollbar overflow-auto transition-transform duration-300",
            {
              // Closed state - responsive widths
              "-translate-x-full w-[200px] sm:w-[220px] md:w-[110px]":
                !isSideNavOpen,
              // Open state - responsive widths
              "translate-x-0 w-[200px] sm:w-[220px] md:w-[235px] lg:w-[250px]":
                isSideNavOpen,
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
      )}

      <>
        <div
          style={{
            boxShadow: "0px 2px 20px 0px rgba(0, 0, 0, 0.02)",
            transitionProperty: "margin-left",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            ...(isSideNavOpen && navbar !== "row"
              ? { width: "calc(100vw - 250px)" } // when sidenav open
              : { width: "100vw" }), // when sidenav closed‰„
          }}
          className={clsx("custom-flex-col fixed z-[2] duration-300", {
            "w-full top-[139px]": navbar === "row", // Adjusted top to 150px to account for TopNav height
            "top-[99px]": navbar !== "row",
            "md:ml-[110px] lg:ml-[110px] w-[calc(100vw - 250px)] w-full":
              !isSideNavOpen && navbar !== "row",
            "md:ml-[235px] lg:ml-[250px] w-full":
              isSideNavOpen && navbar !== "row",
          })}
        >
          <div
            className="h-[1px]"
            style={{ boxShadow: "0px 2px 20px 0px rgba(0, 0, 0, 0.02)" }}
          />
          <>
            <SmartMarquee className="bg-white dark:bg-[#020617]" />
          </>
          <div
            className={`h-[50px] px-3 flex items-center ${navbar !== "row" ? "justify-between" : "justify-end"
              } gap-2 bg-white dark:bg-[#020617] max-w-full`}
          >
            {navbar !== "row" && (
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
            )}
            <p
              className="capitalize text-text-primary dark:text-darkText-2 text-sm font-medium truncate md:mr-4"
              style={{
                direction: "rtl", // RTL direction for truncating from the start
              }}
            >
              {pathname.split("/").slice(1).join(" > ")}
            </p>
          </div>
          <div
            className="h-[1px]"
            style={{ boxShadow: "0px 2px 20px 0px rgba(0, 0, 0, 0.02)" }}
          />
        </div>
        {/* MAIN PAGE */}
        <main
          style={{
            transitionProperty: "margin-left",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          className={clsx(
            "px-2 sm:px-3 md:p-6 bg-neutral-2 dark:bg-[#000000] relative z-[1] duration-300 min-h-[calc(100vh-152px)]",
            // Conditional margin-top based on marquee presence
            hasMarquees ? "mt-[60px]" : "mt-[48px]",
            {
              "w-full md:ml-0 lg:ml-0": navbar === "row",
              "md:ml-[110px] lg:ml-[110px]": !isSideNavOpen && navbar !== "row",
              "opacity-50 pointer-events-none md:ml-[235px] lg:ml-[250px]":
                isSideNavOpen && navbar !== "row",
            },
            {
              "md:opacity-100 md:pointer-events-auto": navbar !== "row",
            },
          )}
        >
          {children}
        </main>
        {/* AGREEMENT MODAL IS HERE CUZ IT''S NEEDED ON NAVBAR COMPONENT*/}
        <Modal
          state={{
            isOpen: openDocumentModal,
            setIsOpen: (isOpen) =>
              setGlobalInfoStore("openDocumentModal", Boolean(isOpen)),
          }}
        >
          <ModalContent>
            {selectedDocumentOption ? (
              <OtherAgreementDocument selectedOption={selectedDocumentOption} />
            ) : (
              <div>No document selected</div>
            )}
          </ModalContent>
        </Modal>

        {/* EXPIRED PLAN MODAL  */}
        <Modal
          state={{
            isOpen: isExpiredModalOpen,
            setIsOpen: setIsExpiredModalOpen,
          }}
        >
          <ModalContent disableOutsideClick>
            <ExpiredSubscriptionModal />
          </ModalContent>
        </Modal>
      </>
    </LayoutContext.Provider>
  );
};

export default NavLayout;
