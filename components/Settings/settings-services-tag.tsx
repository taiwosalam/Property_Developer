"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";

interface SettingsServicesTagProps {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
}

const SettingsServicesTag: React.FC<SettingsServicesTagProps> = ({
  active,
  children,
  onClick,
  isSelected,
}) => {
  const [clicked, setClicked] = useState<boolean>(!!active);

  useEffect(() => {
    if(isSelected){
      setClicked(isSelected);
    }
  }, [isSelected]);

  return (
    <button
      onClick={onClick}
      className={clsx("py-3 px-4 rounded-[4px] group", {
        "bg-brand-1 dark:bg-darkBrand-1": clicked,
        "bg-[rgba(245,245,245,0.5)] dark:text-darkText-1": !clicked,
      })}
    >
      <p
        className={clsx("text-sm font-normal", {
          "text-brand-9": clicked,
          "text-[rgba(0,0,0,0.5)] dark:text-darkText-1 group-hover:text-black dark:group-hover:text-white duration-150":
            !clicked,
        })}
      >
        {children}
      </p>
    </button>
  );
};

export default SettingsServicesTag;
