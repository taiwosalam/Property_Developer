"use client";

import Link from "next/link";
import SVG from "../SVG/svg";
import { useModal } from "../Modal/modal";
import useDarkMode from "@/hooks/useCheckDarkMode";
import { useRole } from "@/hooks/roleContext";
import { usePermission } from "@/hooks/getPermission";
import type { NavCreateNewColumnProps } from "./types";
import { useMemo } from "react";
import { permissionMapping } from "./nav-create-new-items";


const NavCreateNewColumn: React.FC<NavCreateNewColumnProps> = ({
  data = [],
  handleModalTrigger,
}) => {
  const { setIsOpen } = useModal();
  const isDarkMode = useDarkMode();
  const { role } = useRole();

  const filteredContent = useMemo(() => {
    const options = ["management", "tasks", "accounting", "documents"];
    return data
      .filter((item) => options.includes(item.label.toLowerCase()))
      .map((item) => ({
        ...item,
        content: item.content?.filter(({ label }) => {
          const mapping = permissionMapping[label.toLowerCase()];
          // Render item if no permission is defined or if the role is not an owner
          if (!mapping || !mapping.ownerRoles.includes(role)) {
            return true;
          }
          // Only filter out if the role owns the permission and it's false
          return usePermission(role, mapping.permission);
        }),
      }))
      .filter((item) => item.content && item.content.length > 0);
  }, [data, role]);

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
        <div key={index} className="custom-flex-col text-base font-medium">
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
          {content?.map(({ label, link, modal }, idx) => (
            <div key={idx} className="py-3 px-5">
              {link ? (
                <Link
                  href={link}
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
