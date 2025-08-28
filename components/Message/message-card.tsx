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
import { truncateText } from "../tasks/vehicles-record/data";
import { useChatPrefetch } from "@/app/(nav)/(messages-reviews)/messages/hooks";
import { throttle } from "lodash";

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
  dataId,
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

  // Badge color logic:
  // - No badge for group chats
  // - For special roles (director, account, staff, manager, super-admin) with tier 2: gray badge
  // - For non-special roles with a tier: use tierColorMap
  // - Otherwise, no badge
  let badgeColor: string | undefined;
  if (!isGroupChat) {
    const specialRoles = [
      "director",
      "account",
      "staff",
      "manager",
      "super-admin",
    ];
    if (specialRoles.includes(role ?? "")) {
      badgeColor = tier === 2 ? "gray" : undefined;
    } else if (tier && tierColorMap[tier as keyof typeof tierColorMap]) {
      badgeColor = tierColorMap[tier as keyof typeof tierColorMap];
    }
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

    console.log("refetching now");
    const event = new CustomEvent("refetch-users-msg", {
      detail: { timestamp: Date.now() },
    });
    window.dispatchEvent(event);
    console.log("refetching done");
    console.log("routing to", `/messages/${id}`);
    setGlobalStore("isGroupChat", isGroupChat);
    if (onClick) {
      onClick();
    } else {
      console.log("routing to", `/messages/${id}`);
      router.push(`/messages/${id}`);
    }
  };

  const { prefetchChatMessages, prefetchUserProfile } = useChatPrefetch();

  const handleMouseEnter = throttle((id: string, isGroupChat: boolean) => {
    prefetchChatMessages(id, isGroupChat);
    if (!isGroupChat) {
      prefetchUserProfile(id);
    }
  }, 4000);

  // Prefetch on click too (just in case hover didn't trigger)

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
          <div className="custom-flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center gap-[10px] min-w-0">
              <p className="text-text-primary dark:text-white text-base font-medium capitalize truncate min-w-0">
                {capitalizeWords(fullname)}
              </p>
              {!isGroupChat && badgeColor && (
                <BadgeIcon color={badgeColor as any} />
              )}
            </div>
            {content_type === "text" ? (
              <p className="text-text-quaternary dark:text-darkText-2 text-sm font-normal truncate w-full max-w-full min-w-0">
                {truncateText(desc, 30) || ""}
              </p>
            ) : (
              <div className="flex gap-1 text-sm items-center text-brand-9 min-w-0">
                {IconComponent && <IconComponent />}
                <span className="truncate">{content_type}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center font-normal">
          <p className="text-text-disabled text-xs whitespace-nowrap">{time}</p>
          {!!messages && (
            <div className="size-5 rounded-full flex items-center justify-center bg-highlight">
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
      data-id={dataId}
      tabIndex={0}
      onClick={handleClick}
      onMouseEnter={() => {
        handleMouseEnter(id, isGroupChat);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      className={clsx(
        "custom-flex-col gap-4 cursor-pointer transition-colors duration-200 w-full max-w-full overflow-hidden",
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
