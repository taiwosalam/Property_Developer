"use client";

import Link from "next/link";
import SVG from "../SVG/svg";
import { useModal } from "../Modal/modal";
import useDarkMode from "@/hooks/useCheckDarkMode";
import { useRole } from "@/hooks/roleContext";
import type { NavCreateNewColumnProps } from "./types";
import { useMemo } from "react";
import { sanitizeClassName, useNavPermissions } from "./sidenav-permission";
import { filterCreateNavItems } from "./nav-create-permission";

const NavCreateNewColumn: React.FC<NavCreateNewColumnProps> = ({
  data = [],
  handleModalTrigger,
}) => {
  const { setIsOpen } = useModal();
  const isDarkMode = useDarkMode();
  const { role } = useRole();

  // Get permissions and configuration
  const { permissionsCache, permissionMapping } = useNavPermissions(role);

  const filteredContent = useMemo(() => {
    return filterCreateNavItems({
      items: data as any, 
      role,
      permissionsCache,
      permissionMapping,
    });
  }, [data, role, permissionsCache, permissionMapping]);

  const class_styles = "flex items-center gap-4";
  const icon = (
    <SVG
      type="horizontal_line"
      className="w-[30px] flex justify-center"
      color={isDarkMode ? "#fff" : "#050901"}
    />
  );

  const closeCreateNewModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex gap-10 w-full overflow-auto custom-round-scrollbar">
      {filteredContent.map(({ type, label, content }, index) => (
        <div key={`${sanitizeClassName(label)}-${index}`} className="custom-flex-col text-base font-medium">
          <div className="flex items-center gap-2">
            <SVG
              type={type}
              color={isDarkMode ? "#fff" : "#050901"}
              className="w-[30px] flex justify-center"
            />
            <p className="text-text-primary dark:text-white capitalize">
              {label}
            </p>
          </div>
          {content.map(({ label, href, modal }, idx) => (
            <div key={`${sanitizeClassName(label)}-${idx}`} className="py-3 px-5">
              {href ? (
                <Link
                  href={href}
                  className={class_styles}
                  onClick={closeCreateNewModal}
                >
                  {icon}
                  <p className="text-text-secondary dark:text-darkText-1 capitalize">
                    {label}
                  </p>
                </Link>
              ) : (
                <button
                  type="button"
                  className={class_styles}
                  onClick={() => handleModalTrigger(modal)}
                >
                  {icon}
                  <p className="text-text-secondary dark:text-darkText-1 capitalize">
                    {label}
                  </p>
                </button>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default NavCreateNewColumn;