import React from "react";

// Types
import { NavGlobalSearchItemProps } from "./types";

// Images
import Verified from "@/public/icons/verified.svg";

// Imports
import SVG from "../SVG/svg";
import Picture from "../Picture/picture";
import { useThemeStoreSelectors } from "@/store/themeStore";
import { Badge } from "../ui/badge";
import { getBadgeColor } from "@/lib/utils";
import BadgeIcon from "../BadgeIcon/badge-icon";
import TruncatedText from "../TruncatedText/truncated-text";

const NavGlobalSearchItem: React.FC<NavGlobalSearchItemProps> = ({
  icon,
  title,
  subtitle,
  extra,
  query,
  type,
  isVerified = false,
  tier_id,
}) => {
  const primaryColor = useThemeStoreSelectors.use.primaryColor();

  // Highlight the query in text (case-insensitive)
  const highlightQuery = (text: string) => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className="py-2 px-4 rounded-md flex justify-between"
      style={{ boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.03)" }}
    >
      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-start gap-3">
          <div className="w-[60px] h-[60px] aspect-square rounded-lg custom-secondary-bg flex items-center justify-center">
            <SVG
              type={icon}
              color={primaryColor || "#0033C4"}
              className="w-[30px] h-[30px]"
            />
          </div>
          <div className="custom-flex-col gap-1 font-medium">
            <div className="flex items-center gap-2">
              <p className="text-black dark:text-white text-base capitalize">
                {highlightQuery(title ?? "")}
              </p>
              {isVerified && (
                <BadgeIcon color={getBadgeColor(tier_id) || "gray"} />
              )}
            </div>
            {type?.toLowerCase() === "announcement" ? (
              <TruncatedText className="text-text-tertiary text-sm" lines={1}>
                <div
                  className="text-text-tertiary text-sm"
                  dangerouslySetInnerHTML={{
                    __html: subtitle || "",
                  }}
                />
              </TruncatedText>
            ) : (
              <p className="text-text-tertiary text-sm capitalize">
                {highlightQuery(subtitle ?? "")}
              </p>
            )}

            <p className="text-text-tertiary text-base font-medium capitalize">
              {extra}
            </p>
          </div>
        </div>
      </div>
      <p className="text-text-tertiary text-base font-medium capitalize">
        {type && type === "landlords" ? "landlords/landlady" : type}
      </p>
    </div>
  );
};

export default NavGlobalSearchItem;
