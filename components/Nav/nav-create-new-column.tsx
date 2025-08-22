"use client";

import { useMemo } from "react";
import Link from "next/link";
import SVG from "../SVG/svg";
import { useModal } from "../Modal/modal";
import useDarkMode from "@/hooks/useCheckDarkMode";
import { useRole } from "@/hooks/roleContext";
import type { NavCreateNewColumnProps } from "./types";
import { filterNavCreateItems, useNavCreatePermissions } from "./nav-create-permission";

const NavCreateNewColumn: React.FC<NavCreateNewColumnProps> = ({
  data = [] as any,
  handleModalTrigger,
}) => {
  const { setIsOpen } = useModal();
  const isDarkMode = useDarkMode();
  const { role } = useRole();

  // Get permissions using the custom hook
  const { permissionsCache, permissionMapping } = useNavCreatePermissions(role);

  // Filter content based on permissions
  const filteredContent = useMemo(() => {
    return filterNavCreateItems({
      data,
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

  const renderNavItem = (item: { label: string; link?: string; modal?: string }, idx: number) => {
    const itemContent = (
      <>
        {icon}
        <p className="text-text-secondary dark:text-darkText-1 capitalize">
          {item.label}
        </p>
      </>
    );

    return (
      <div key={`${item.label}-${idx}`} className="py-3 px-5">
        {item.link ? (
          <Link
            href={item.link}
            className={class_styles}
            onClick={closeCreateNewModal}
          >
            {itemContent}
          </Link>
        ) : (
          <button
            type="button"
            className={class_styles}
            onClick={() => item.modal && handleModalTrigger(item.modal)}
          >
            {itemContent}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex gap-10 w-full overflow-auto custom-round-scrollbar">
      {filteredContent.map((section, index) => (
        <div key={`${section.label}-${index}`} className="custom-flex-col text-base font-medium">
          <div className="flex items-center gap-2">
            <SVG
              type={section.type}
              color={isDarkMode ? "#fff" : "#050901"}
              className="w-[30px] flex justify-center"
            />
            <p className="text-text-primary dark:text-white capitalize">
              {section.label}
            </p>
          </div>
          
          {section.content?.map((item, idx) => renderNavItem(item, idx))}
        </div>
      ))}
    </div>
  );
};

export default NavCreateNewColumn;