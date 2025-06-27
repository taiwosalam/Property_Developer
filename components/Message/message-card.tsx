import Link from "next/link";

// Images
import VerifiedIcon from "@/public/icons/verified.svg";

// Types
import type { MessageCardProps, UserDetailsResponse } from "./types";

// Imports
import clsx from "clsx";
import { empty } from "@/app/config";
import Picture from "../Picture/picture";
import { SectionSeparator } from "../Section/section-components";
import { getIconByContentType } from "@/app/(nav)/(messages-reviews)/messages/data";
import { useGlobalStore } from "@/store/general-store";
import { useRouter } from "next/navigation";
import BadgeIcon, { tierColorMap } from "../BadgeIcon/badge-icon";
import useFetch from "@/hooks/useFetch";
import { getCleanRoleName } from "./data";
import { capitalizeWords } from "@/hooks/capitalize-words";

const MessageCard: React.FC<MessageCardProps> = ({
  id,
  pfp = empty,
  desc,
  time,
  fullname,
  verified,
  highlight,
  messages = 0,
  onClick,
  content_type,
  online,
  last_seen,
  tier,
  title,
  role,
  type,
  // badgeColor,
}) => {
  const router = useRouter();
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const IconComponent = getIconByContentType(content_type as string);
  const isGroupChat = type?.toLowerCase() === "group";
  const isOnline = last_seen?.toLowerCase() === "online";

  // Only show badge for:
  // - Not group chat
  // - If role is in special roles array and tier is 2
  // - OR if not in special roles array but tier is defined (custom tier badge)
  const specialRoles = ["director", "account", "staff", "manager"];

  let badgeColor: string | undefined;
  if (!isGroupChat) {
    if (specialRoles.includes(role ?? "")) {
      if (tier === 2) {
        badgeColor = tierColorMap[2];
      }
      // else badgeColor remains undefined (do not show badge)
    } else if (tier && tierColorMap[tier as keyof typeof tierColorMap]) {
      // other roles but with a tier (map their tier as badge)
      badgeColor = tierColorMap[tier as keyof typeof tierColorMap];
    }
    // else, badgeColor remains undefined (no badge)
  }

  const handleClick = () => {
    setGlobalStore("messageUserData", {
      id: Number(id),
      branch_id: 1,
      position: "",
      name: fullname,
      imageUrl: pfp,
      last_seen,
    });

    if (onClick) {
      onClick();
    } else {
      router.push(`/messages/${id}`);
    }
  };

  const Children = () => (
    <>
      <div></div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Picture
            src={pfp || empty}
            alt="profile picture"
            size={60}
            rounded
            status={online}
            containerClassName="custom-secondary-bg rounded-full"
          />
          <div className="custom-flex-col gap-1 flex-1">
            <div className="flex items-center gap-[10px]">
              <p className="text-text-primary dark:text-white text-base font-medium capitalize">
                {capitalizeWords(fullname)}
              </p>
              {!isGroupChat && badgeColor && <BadgeIcon color={badgeColor as any} />}
            </div>
            {content_type === "text" ? (
              <p className="text-text-quaternary dark:text-darkText-2 text-sm font-normal truncate w-full max-w-full">
                {desc}
              </p>
            ) : (
              <div className="flex gap-1 text-sm items-center text-brand-9">
                {IconComponent && <IconComponent />}
                {content_type}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center font-normal">
          <p className="text-text-disabled text-xs whitespace-nowrap">{time}</p>
          {!!messages && (
            <div className="w-4 h-4 pt-[1px] rounded-full flex items-center justify-center bg-highlight">
              <p className="text-white dark:text-black text-[10px] leading-[10px]">
                {messages}
              </p>
            </div>
          )}
        </div>
      </div>
      <SectionSeparator />
    </>
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      className={clsx(
        "custom-flex-col gap-4 cursor-pointer transition-colors duration-200",
        {
          "bg-neutral-2 dark:bg-[#3C3D37]": highlight,
          "hover:bg-neutral-1 dark:hover:bg-[#2A2B27]": !highlight,
        }
      )}
    >
      <Children />
    </div>
  );
};

export default MessageCard;
