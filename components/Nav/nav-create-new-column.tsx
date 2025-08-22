"use client";

import { useMemo } from "react";
import Link from "next/link";
import SVG from "../SVG/svg";
import { useModal } from "../Modal/modal";
import useDarkMode from "@/hooks/useCheckDarkMode";
import { useRole } from "@/hooks/roleContext";
import { useModule } from "@/contexts/moduleContext";
import type { NavCreateNewColumnProps } from "./types";
import {
  filterNavCreateItems,
  NavCreateSection,
  useNavCreatePermissions,
} from "./nav-create-permission";

const NavCreateNewColumn: React.FC<NavCreateNewColumnProps> = ({
  handleModalTrigger,
}) => {
  const { setIsOpen } = useModal();
  const isDarkMode = useDarkMode();
  const { role } = useRole();
  const { activeModule } = useModule();

  // Get permissions using the custom hook
  const { permissionsCache, permissionMapping } = useNavCreatePermissions(role);

  // Fetch create items from activeModule
  const data = activeModule.getCreateItems(role) as unknown as NavCreateSection[];


  // Filter content based on permissions
  const filteredContent = useMemo(() => {
    return filterNavCreateItems({
      data,
      role,
      permissionsCache,
      permissionMapping: activeModule.permissionMapping,
    });
  }, [data, role, permissionsCache, activeModule.permissionMapping]);

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

  const renderNavItem = (
    item: { label: string; link?: string; modal?: React.ReactNode },
    idx: number
  ) => {
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
            href={`${activeModule.basePath}${item.link}`}
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
      {filteredContent.length === 0 ? (
        <p className="text-gray-500 p-4">
          No create items available for {activeModule.name}.
        </p>
      ) : (
        filteredContent.map((section, index) => (
          <div
            key={`${section.label}-${index}`}
            className="custom-flex-col text-base font-medium"
          >
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
        ))
      )}
    </div>
  );
};

export default NavCreateNewColumn;
