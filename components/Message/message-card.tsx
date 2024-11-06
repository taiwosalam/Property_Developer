import Link from "next/link";

// Images
import VerifiedIcon from "@/public/icons/verified.svg";

// Types
import type { MessageCardProps } from "./types";

// Imports
import clsx from "clsx";
import { empty } from "@/app/config";
import Picture from "../Picture/picture";
import { SectionSeparator } from "../Section/section-components";

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
}) => {
  const Children = () => (
    <>
      <div></div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Picture src={pfp} alt="profile picture" size={60} rounded status />
          <div className="custom-flex-col gap-1 flex-1">
            <div className="flex items-center gap-[10px]">
              <p className="text-text-primary dark:text-white text-base font-medium capitalize">
                {fullname}
              </p>
              {verified && (
                <Picture src={VerifiedIcon} alt="verified" size={16} />
              )}
            </div>
            <p className="text-text-quaternary dark:text-darkText-2 text-sm font-normal custom-truncated">
              {desc}
            </p>
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

  return onClick ? (
    <button
      type="button"
      onClick={onClick}
      className={clsx("custom-flex-col gap-4", {
        "bg-neutral-2 dark:bg-[#3C3D37]": highlight,
      })}
    >
      <Children />
    </button>
  ) : (
    <Link
      href={`/messages/${id}`}
      className={clsx("custom-flex-col gap-4", {
        "bg-neutral-2 dark:bg-[#3C3D37]": highlight,
      })}
    >
      <Children />
    </Link>
  );
};

export default MessageCard;
